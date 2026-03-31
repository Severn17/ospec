---
name: ospec
tags: [cli, workflow, automation, typescript, ospec, bootstrap]
---

# OSpec CLI

Protocol-shell-first OSpec workflow for initialization, project knowledge backfill, and change execution.

## Default Entry

When the user says something short like:

- `使用 ospec 初始化项目`
- `使用 ospec 初始化这个目录`
- `use ospec to initialize this directory`
- `use ospec to inspect and initialize this repo`

expand it internally as:

1. inspect the target directory
2. initialize the OSpec protocol shell if needed
3. explicitly backfill the project knowledge layer only when needed
4. create the first change only when explicitly requested

Do not force the user to repeat those steps manually when the request is already clear.

Treat plain project-init intent as enough to trigger this flow. Do not require the user to restate the guardrails in a longer prompt.

## Mandatory Init Execution

When the user asks to initialize a directory, do not freehand the initialization flow.

If the user intent is simply to initialize the project or current directory, treat that as a request for this mandatory flow.

Use this exact behavior:

1. run `ospec status [path]`
2. if the directory is uninitialized or missing protocol-shell assets, run `ospec init [path]`
3. verify the actual filesystem result before claiming initialization is complete

Never replace `ospec init` with manual directory creation or a hand-written approximation.

Do not say initialization is complete unless the protocol-shell assets actually exist on disk.

Required protocol-shell checks after `ospec init`:

- `.skillrc`
- `.ospec/`
- `changes/active/`
- `changes/archived/`
- `SKILL.md`
- `SKILL.index.json`
- `build-index-auto.cjs`
- `for-ai/ai-guide.md`
- `for-ai/execution-protocol.md`
- `for-ai/naming-conventions.md`
- `for-ai/skill-conventions.md`
- `for-ai/workflow-conventions.md`
- `for-ai/development-guide.md`

During plain init, do not report `docs/SKILL.md`, `src/SKILL.md`, `tests/SKILL.md`, or business scaffold as if they were part of protocol-shell completion.

## Prompt Profiles

Use these prompt styles as the preferred mental model.

### 1. Minimal Prompt

Use when the user already trusts OSpec defaults.

```text
Use ospec to initialize this directory.
```

### 2. Standard Prompt

Use when you want short prompts but still want anti-drift guardrails.

```text
Use ospec to inspect and initialize this directory according to current OSpec rules.
```

### 3. Guardrail Prompt

Use when the model is likely to over-assume frameworks or over-create assets.

```text
Use ospec for this directory. Default to protocol-shell init first, do not assume a web template, do not apply business scaffold during init, and do not create the first change unless explicitly requested.
```

### 4. Knowledge-Backfill Prompt

Use when the protocol shell already exists and the project knowledge layer is still incomplete.

```text
Use ospec to backfill the project knowledge layer for this directory. Focus on docs, layered skills, and index state. Do not create a change yet.
```

### 5. Change-Creation Prompt

Use when the user is explicitly ready to move into execution.

```text
Use ospec to create and advance a change for this requirement. Respect the current project state and do not treat bootstrap as auto-change creation.
```

## Anti-Drift Rules

Always keep these rules:

- `ospec init` creates the protocol shell only
- `ospec docs generate` backfills project knowledge only
- when the user asks to initialize, execute the CLI init command and verify the protocol-shell files on disk before declaring success
- do not assume the project is a web or Next.js project unless the repository or user makes that explicit
- do not apply business scaffold during plain init
- do not generate `docs/project/bootstrap-summary.md` during plain init or docs generate
- do not create the first change automatically unless the user explicitly asks to create a change
- treat presets as planning defaults, not as init-time templates
- use the CLI commands for inspection and progress review, not ad-hoc filesystem edits

## What The CLI Manages

This CLI now covers:

- protocol-shell initialization
- project knowledge backfill
- layered skill files
- execution-layer change workflow
- CLI inspection
- preset-based planning defaults
- explicit business scaffold generation for supported presets
- Codex and Claude Code skill install and sync checks

## Canonical Execution Files

Treat these as the source of truth for active delivery work:

- `.skillrc`
- `changes/active/<change>/proposal.md`
- `changes/active/<change>/tasks.md`
- `changes/active/<change>/state.json`
- `changes/active/<change>/verification.md`

## Plugin Gates

Before advancing an active change:

- read `.skillrc.plugins` to detect enabled blocking plugins
- if the current change activates `stitch_design_review`, inspect `changes/active/<change>/artifacts/stitch/approval.json`
- when Stitch approval is missing or `status != approved`, treat the change as blocked and do not claim it is ready to continue or archive

Do not fall back to the old `features/...` layout unless the target repository really still uses it.

## Commands To Prefer

```bash
ospec status [path]
ospec init [path]
ospec docs generate [path]
ospec new <change-name> [path]
ospec docs status [path]
ospec skills status [path]
ospec changes status [path]
ospec plugins status [path]
ospec plugins approve stitch [changes/active/<change>]
ospec plugins reject stitch [changes/active/<change>]
ospec index check [path]
ospec index build [path]
ospec workflow show
ospec workflow list-flags
ospec progress [changes/active/<change>]
ospec verify [changes/active/<change>]
ospec archive [changes/active/<change>]
ospec archive [changes/active/<change>] --check
ospec finalize [changes/active/<change>]
ospec skill status
ospec skill install
ospec skill status-claude
ospec skill install-claude
```

The default `ospec skill install` and `ospec skill install-claude` commands now install a OSpec skill suite:

- `ospec`
- `ospec-init`
- `ospec-inspect`
- `ospec-backfill`
- `ospec-change`
- `ospec-verify`
- `ospec-archive`
- `ospec-finalize`

Preferred execution order for a new directory:

```bash
ospec status [path]
ospec init [path]
ospec docs generate [path]
ospec new <change-name> [path]
```

For plain init, stop after `ospec init [path]` and verify the protocol-shell assets. Do not silently continue into docs generation unless the user explicitly wants knowledge backfill.

For completed changes, archive before commit. Use `ospec archive [changes/active/<change>]` to execute the archive and `--check` only when you want a readiness preview without moving files.

For the normal closeout path, prefer `ospec finalize [changes/active/<change>]`. It should verify completeness, rebuild the index, archive the change, and leave Git commit as a separate manual step.

## Project-Type Rules

If the repository type is unclear:

- inspect the real directory first
- keep initialization minimal
- allow the project to stay empty except for OSpec protocol assets
- let later skills or explicit project-knowledge steps shape the actual stack

This is important because valid OSpec projects include:

- web applications
- CLI tools
- Unity projects
- Godot projects
- desktop apps
- service backends
- protocol-only repositories

## Verification Discipline

Before saying work is complete:

1. verify the relevant active change
2. confirm docs, skills, and index state if project knowledge changed
3. keep `SKILL.index.json` current after meaningful skill updates
4. treat `SKILL.index.json` section offsets as LF-normalized so Windows CRLF and Linux LF checkouts do not drift

For this repository itself, also treat these as standard regression checks when behavior changes:

1. `npm run build`
2. `npm run test:run`
3. `npm run release:smoke`

## Supported First-Party Presets

If the request matches a supported preset, prefer that preset instead of inventing a new layout in free text.

- `official-site`: official website, docs center, blog/changelog, admin CMS, auth
- `nextjs-web`: standard Next.js web product with account/auth/API boundaries

Remember: preset choice only supplies planning defaults. It does not turn plain init into template landing.

## Skill Installation

To sync the latest ospec skill into local AI clients, prefer:

1. `ospec skill status`
2. `ospec skill install` when the Codex package is missing or out of sync
3. `ospec skill status-claude`
4. `ospec skill install-claude` when the Claude Code package is missing or out of sync

The default install targets are:

- `~/.codex/skills/ospec`
- `~/.claude/skills/ospec`

Use `$ospec` as the preferred skill name in prompts.

`$ospec-cli` should only be treated as a legacy compatibility alias.
