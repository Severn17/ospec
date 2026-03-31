#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function printHelp() {
  console.log(`Usage: node scripts/setup-custom-fork.js --gitlab <gitlab-repo-url> [options]

Options:
  --gitlab <url>            GitLab repository URL to use as origin
  --upstream <url>          GitHub upstream repository URL
  --upstream-branch <name>  Upstream branch to mirror (default: main)
  --mirror-branch <name>    Local mirror branch name (default: upstream-main)
  --main-branch <name>      Custom working branch name (default: main)
  --push                    Push mirror and main branches to origin
  -h, --help                Show this help message

Example:
  node scripts/setup-custom-fork.js \
    --gitlab git@gitlab.com:your-group/your-repo.git \
    --upstream https://github.com/your-org/upstream-repo.git \
    --push
`);
}

function parseArgs(argv) {
  const options = {
    upstreamBranch: 'main',
    mirrorBranch: 'upstream-main',
    mainBranch: 'main',
    push: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case '--gitlab':
        options.gitlabUrl = argv[++index];
        break;
      case '--upstream':
        options.upstreamUrl = argv[++index];
        break;
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

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: options.captureOutput ? ['inherit', 'pipe', 'pipe'] : 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
    throw new Error(output || `Command failed: ${command} ${args.join(' ')}`);
  }

  return options.captureOutput ? (result.stdout || '').trim() : '';
}

function remoteExists(name) {
  try {
    run('git', ['remote', 'get-url', name], { captureOutput: true });
    return true;
  } catch {
    return false;
  }
}

function getRemoteUrl(name) {
  if (!remoteExists(name)) {
    return null;
  }

  return run('git', ['remote', 'get-url', name], { captureOutput: true });
}

function localBranchExists(name) {
  const output = run('git', ['branch', '--list', name], { captureOutput: true });
  return output.length > 0;
}

function ensureCleanWorkingTree() {
  const output = run('git', ['status', '--porcelain'], { captureOutput: true });

  if (output.trim()) {
    throw new Error('Working tree is not clean. Commit or stash changes before running setup.');
  }
}

function ensureRemote(name, url) {
  if (!url) {
    throw new Error(`Remote URL for ${name} is required`);
  }

  if (remoteExists(name)) {
    run('git', ['remote', 'set-url', name, url]);
    return;
  }

  run('git', ['remote', 'add', name, url]);
}

function configureMergeDefaults() {
  run('git', ['config', 'rerere.enabled', 'true']);
  run('git', ['config', 'merge.ours.driver', 'true']);
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (!options.gitlabUrl) {
    printHelp();
    throw new Error('GitLab repository URL is required');
  }

  ensureCleanWorkingTree();

  const existingOriginUrl = getRemoteUrl('origin');
  const existingUpstreamUrl = getRemoteUrl('upstream');
  const upstreamUrl = options.upstreamUrl || existingUpstreamUrl || existingOriginUrl;

  if (!upstreamUrl) {
    throw new Error('Unable to determine upstream URL. Provide it with --upstream.');
  }

  if (existingOriginUrl && existingOriginUrl !== options.gitlabUrl && !remoteExists('upstream')) {
    run('git', ['remote', 'rename', 'origin', 'upstream']);
  }

  ensureRemote('upstream', upstreamUrl);
  ensureRemote('origin', options.gitlabUrl);
  configureMergeDefaults();

  run('git', ['fetch', 'upstream', '--prune']);
  run('git', ['checkout', '-B', options.mirrorBranch, `upstream/${options.upstreamBranch}`]);

  if (localBranchExists(options.mainBranch)) {
    run('git', ['checkout', options.mainBranch]);
  } else {
    run('git', ['checkout', '-B', options.mainBranch, options.mirrorBranch]);
  }

  if (options.push) {
    run('git', ['push', '-u', 'origin', options.mirrorBranch]);
    run('git', ['push', '-u', 'origin', options.mainBranch]);
  }

  console.log('Custom fork setup complete.');
  console.log(`- upstream: ${upstreamUrl}`);
  console.log(`- origin: ${options.gitlabUrl}`);
  console.log(`- mirror branch: ${options.mirrorBranch}`);
  console.log(`- custom branch: ${options.mainBranch}`);
  console.log('Next step: commit your branding and custom changes on the custom branch only.');
}

try {
  main();
} catch (error) {
  console.error(`[setup-custom-fork] ${error.message}`);
  process.exit(1);
}
