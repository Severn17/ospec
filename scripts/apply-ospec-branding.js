#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const ignoredNames = new Set(['.git', 'node_modules']);
const legacyBrandLower = ['d', 'o', 'r', 'a', 'd', 'o'].join('');
const legacyBrandTitle = `D${legacyBrandLower.slice(1)}`;
const legacyProtocolDirName = `.${legacyBrandLower}`;

const replacements = [
  [legacyProtocolDirName, '.ospec'],
  [`${legacyBrandLower}-cli`, 'ospec-cli'],
  [`$${legacyBrandLower}-cli`, '$ospec-cli'],
  [`$${legacyBrandLower}`, '$ospec'],
  [`${legacyBrandTitle}Error`, 'OSpecError'],
  [`execute${legacyBrandTitle}`, 'executeOSpec'],
  [legacyBrandTitle, 'OSpec'],
  [legacyBrandLower.toUpperCase(), 'OSPEC'],
  [legacyBrandLower, 'ospec'],
];

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });

  if (result.status !== 0) {
    return '';
  }

  return (result.stdout || '').trim();
}

function getProtectedRemoteUrls() {
  return ['upstream', 'origin']
    .map((name) => runGit(['remote', 'get-url', name]))
    .filter(Boolean);
}

function walk(dirPath, files = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (ignoredNames.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function isTextFile(filePath) {
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    return false;
  }

  const buffer = fs.readFileSync(filePath);
  const sample = buffer.subarray(0, Math.min(buffer.length, 2048));
  return !sample.includes(0);
}

function replaceAll(content, protectedUrls) {
  let next = content;

  const placeholders = protectedUrls.map((url, index) => ({
    url,
    placeholder: `__OSPEC_REMOTE_URL_${index}__`,
  }));

  for (const { url, placeholder } of placeholders) {
    next = next.replaceAll(url, placeholder);
  }

  for (const [from, to] of replacements) {
    next = next.replaceAll(from, to);
  }

  for (const { url, placeholder } of placeholders) {
    next = next.replaceAll(placeholder, url);
  }

  return next;
}

function maybeRenameProtocolDir() {
  const oldPath = path.join(rootDir, legacyProtocolDirName);
  const nextPath = path.join(rootDir, '.ospec');

  if (!fs.existsSync(oldPath)) {
    return;
  }

  if (!fs.existsSync(nextPath)) {
    fs.renameSync(oldPath, nextPath);
    return;
  }

  fs.rmSync(oldPath, { recursive: true, force: true });
}

function main() {
  maybeRenameProtocolDir();

  const files = walk(rootDir);
  const protectedUrls = getProtectedRemoteUrls();
  let updatedCount = 0;

  for (const filePath of files) {
    if (!isTextFile(filePath)) {
      continue;
    }

    const original = fs.readFileSync(filePath, 'utf8');
    const updated = replaceAll(original, protectedUrls);

    if (updated === original) {
      continue;
    }

    fs.writeFileSync(filePath, updated, 'utf8');
    updatedCount += 1;
  }

  console.log(`[apply-ospec-branding] updated ${updatedCount} files`);
}

try {
  main();
} catch (error) {
  console.error(`[apply-ospec-branding] ${error.message}`);
  process.exit(1);
}
