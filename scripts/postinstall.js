#!/usr/bin/env node

const { SkillCommand } = require('../dist/commands/SkillCommand');

function isGlobalInstall() {
  const globalFlag = String(process.env.npm_config_global || '').toLowerCase();
  const location = String(process.env.npm_config_location || '').toLowerCase();
  return globalFlag === 'true' || location === 'global';
}

function shouldSkip() {
  if (process.env.CI === 'true' || process.env.CI === '1') {
    return true;
  }

  if (!isGlobalInstall()) {
    return true;
  }

  return false;
}

async function installManagedSkill(provider) {
  const skillCommand = new SkillCommand();
  const result = await skillCommand.installSkill(provider, 'ospec-change');
  console.log(`[ospec] installed ${provider} skill: ${result.targetDir}`);
}

async function main() {
  try {
    if (shouldSkip()) {
      return;
    }

    await installManagedSkill('codex');
    await installManagedSkill('claude');
  } catch (error) {
    console.log(`[ospec] ospec-change skill sync skipped: ${error.message}`);
    console.log('Tip: rerun `npm install -g .` to retry the automatic ospec-change skill sync.');
  }
}

main();
