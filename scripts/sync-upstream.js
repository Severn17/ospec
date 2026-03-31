#!/usr/bin/env node

const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const defaultProtectedPaths = [
  'README.md',
  'README.zh-CN.md',
  'SKILL.md',
  'skill.yaml',
  'agents/openai.yaml',
  'docs',
  'assets',
  '.ospec',
];

function printHelp() {
  console.log(`Usage: node scripts/sync-upstream.js [options]

Options:
  --upstream-branch <name>  Upstream branch to sync from (default: main)
  --mirror-branch <name>    Local mirror branch name (default: upstream-main)
  --main-branch <name>      Custom working branch name (default: main)
  --push                    Push updated branches to origin
  --rebase                  Unsupported in protected sync mode
  -h, --help                Show this help message

Examples:
  node scripts/sync-upstream.js --push
  node scripts/sync-upstream.js --main-branch custom-main
`);
}

function parseArgs(argv) {
  const options = {
    upstreamBranch: 'main',
    mirrorBranch: 'upstream-main',
    mainBranch: 'main',
    push: false,
    rebase: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case '--upstream-branch':
        options.upstreamBranch = argv[++index];
        break;
      case '--mirror-branch':
        options.mirrorBranch = argv[++index];
        break;
      case '--main-branch':
        options.mainBranch = argv[++index];
        break;
      case '--push':
        options.push = true;
        break;
      case '--rebase':
        options.rebase = true;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function exec(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: options.captureOutput ? ['inherit', 'pipe', 'pipe'] : 'inherit',
    shell: false,
  });

  return {
    status: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function run(command, args, options = {}) {
  const result = exec(command, args, options);

  if (result.status !== 0) {
    const output = `${result.stdout}${result.stdout && result.stderr ? '\n' : ''}${result.stderr}`.trim();
    throw new Error(output || `Command failed: ${command} ${args.join(' ')}`);
  }

  return options.captureOutput ? result.stdout : '';
}

function remoteExists(name) {
  return exec('git', ['remote', 'get-url', name], { captureOutput: true }).status === 0;
}

function localBranchExists(name) {
  const output = run('git', ['branch', '--list', name], { captureOutput: true });
  return output.length > 0;
}

function ensureCleanWorkingTree() {
  const output = run('git', ['status', '--porcelain'], { captureOutput: true });

  if (output.trim()) {
    throw new Error('Working tree is not clean. Commit or stash changes before syncing upstream.');
  }
}

function getCurrentCommit() {
  return run('git', ['rev-parse', 'HEAD'], { captureOutput: true });
}

function mergeInProgress() {
  return exec('git', ['rev-parse', '-q', '--verify', 'MERGE_HEAD'], { captureOutput: true }).status === 0;
}

function listUnmergedPaths() {
  const output = run('git', ['diff', '--name-only', '--diff-filter=U'], { captureOutput: true });
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function normalizeProtectedPath(pattern) {
  const normalized = pattern.replace(/\\/g, '/').trim();
  if (!normalized) {
    return null;
  }

  const wildcardIndex = normalized.search(/[\*\?\[]/);
  const target = wildcardIndex === -1 ? normalized : normalized.slice(0, wildcardIndex);
  const cleaned = target.replace(/\/+$/, '');
  return cleaned || null;
}

function parseProtectedPathsFromAttributes() {
  const attributesPath = path.join(rootDir, '.gitattributes');

  if (!fs.existsSync(attributesPath)) {
    return [];
  }

  return fs
    .readFileSync(attributesPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('merge=ours'))
    .map((line) => normalizeProtectedPath(line.split(/\s+/)[0]))
    .filter(Boolean);
}

function getProtectedPaths() {
  return [...new Set([...defaultProtectedPaths, ...parseProtectedPathsFromAttributes()])];
}

function pathExistsAtCommit(commitRef, targetPath) {
  return exec('git', ['cat-file', '-e', `${commitRef}:${targetPath.replace(/\\/g, '/')}`], { captureOutput: true }).status === 0;
}

function removePath(targetPath) {
  const fullPath = path.join(rootDir, targetPath);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }

  run('git', ['rm', '-r', '--cached', '--ignore-unmatch', '--', targetPath]);
}

function restoreProtectedPaths(sourceCommit) {
  for (const targetPath of getProtectedPaths()) {
    if (pathExistsAtCommit(sourceCommit, targetPath)) {
      run('git', ['restore', '--source', sourceCommit, '--staged', '--worktree', '--', targetPath]);
      continue;
    }

    removePath(targetPath);
  }
}

function runBrandingScriptIfPresent() {
  const scriptPath = path.join(rootDir, 'scripts', 'apply-ospec-branding.js');

  if (fs.existsSync(scriptPath)) {
    run('node', [scriptPath]);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (options.rebase) {
    throw new Error('Protected upstream sync does not support --rebase. Use merge mode to preserve branded paths and deleted docs.');
  }

  if (!remoteExists('upstream')) {
    throw new Error('Remote "upstream" is missing. Run setup-custom-fork.js first.');
  }

  if (!localBranchExists(options.mainBranch)) {
    throw new Error(`Local branch "${options.mainBranch}" is missing.`);
  }

  ensureCleanWorkingTree();

  run('git', ['fetch', 'upstream', '--prune']);

  if (localBranchExists(options.mirrorBranch)) {
    run('git', ['checkout', options.mirrorBranch]);
    run('git', ['reset', '--hard', `upstream/${options.upstreamBranch}`]);
  } else {
    run('git', ['checkout', '-B', options.mirrorBranch, `upstream/${options.upstreamBranch}`]);
  }

  if (options.push && remoteExists('origin')) {
    run('git', ['push', '-u', 'origin', options.mirrorBranch, '--force-with-lease']);
  }

  run('git', ['checkout', options.mainBranch]);
  const previousMainCommit = getCurrentCommit();

  try {
    const output = run('git', ['merge', '--no-commit', '--no-ff', options.mirrorBranch], { captureOutput: true });
    if (output) {
      console.log(output);
    }
  } catch (error) {
    if (!mergeInProgress()) {
      throw error;
    }

    console.warn('[sync-upstream] merge reported conflicts; restoring protected paths before re-checking.');
  }

  if (!mergeInProgress()) {
    console.log('Upstream is already integrated into the current main branch.');
    return;
  }

  restoreProtectedPaths(previousMainCommit);
  runBrandingScriptIfPresent();

  const unresolvedPaths = listUnmergedPaths();
  if (unresolvedPaths.length > 0) {
    throw new Error(`Unresolved merge conflicts remain after protected restore:\n- ${unresolvedPaths.join('\n- ')}`);
  }

  run('git', ['add', '-A']);
  run('git', ['commit', '-m', `chore: sync upstream/${options.upstreamBranch}`]);

  if (options.push && remoteExists('origin')) {
    run('git', ['push', 'origin', options.mainBranch]);
  }

  console.log('Upstream sync complete.');
  console.log(`- mirrored upstream/${options.upstreamBranch} into ${options.mirrorBranch}`);
  console.log(`- updated ${options.mainBranch} with protected merge mode`);
  console.log('- preserved branded paths and deleted docs from the current branch');
}

try {
  main();
} catch (error) {
  console.error(`[sync-upstream] ${error.message}`);
  process.exit(1);
}
