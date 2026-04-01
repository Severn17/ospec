# [OSpec](https://github.com/clawplays/ospec)

[简体中文](README.zh-CN.md)

<p align="center">
  <a href="https://www.npmjs.com/package/@clawplays/ospec-cli"><img src="https://img.shields.io/npm/v/%40clawplays%2Fospec-cli?style=for-the-badge&logo=npm&label=npm" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@clawplays/ospec-cli"><img src="https://img.shields.io/npm/dm/%40clawplays%2Fospec-cli?style=for-the-badge&logo=npm&label=downloads" alt="npm downloads"></a>
  <a href="https://github.com/clawplays/ospec/stargazers"><img src="https://img.shields.io/github/stars/clawplays/ospec?style=for-the-badge&logo=github" alt="GitHub stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/clawplays/ospec?style=for-the-badge&color=green" alt="License"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/npm-8%2B-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm 8+">
  <img src="https://img.shields.io/badge/language-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/workflow-protocol--shell--first-111827?style=flat-square" alt="Protocol-shell-first workflow">
</p>

OSpec is an AI-first CLI workflow system for initializing repositories to a change-ready state and delivering requirements through auditable change containers.

<p align="center">
  <a href="docs/README.md">Docs</a> |
  <a href="docs/prompt-guide.md">Prompt Guide</a> |
  <a href="docs/usage.md">Usage</a> |
  <a href="docs/project-overview.md">Overview</a> |
  <a href="docs/installation.md">Installation</a> |
  <a href="https://github.com/clawplays/ospec/issues">Issues</a>
</p>

## Prompt Examples

Preferred init prompt:

```text
Use OSpec to initialize this project.
```

Other common prompts:

```text
Use OSpec to refresh or repair the project knowledge layer.

Use OSpec to create and advance a change for this requirement.

Use OSpec to break this TODO into multiple changes, create a queue, and show the queue first.
```

If your AI client supports installed skills, keep init the same short form:

```text
Use $ospec to initialize this project.
```

And for other actions:

```text
Use $ospec-change to create and advance a change for this requirement.
```

## Protocol-Shell-First Workflow

The main idea in OSpec is simple: do not start by guessing the app stack or generating a pile of business templates. Start by creating the collaboration protocol and baseline project knowledge in one init pass, then execute the requirement in a tracked change container.

```text
+--------------------------------------------------------------------------------------+
| OSpec - RECOMMENDED DELIVERY FLOW                                                    |
+--------------------------------------------------------------------------------------+
| 1. INITIALIZE TO CHANGE-READY                                                        |
|    ospec init .                                                                      |
|    - Create the protocol shell                                                       |
|    - Reuse existing project docs when available                                      |
|    - Generate baseline project knowledge docs                                        |
|    - Ask once for missing summary/tech stack in AI-assisted flows                    |
|                                                                                      |
| 2. EXECUTE A REQUIREMENT                                                             |
|    ospec new landing-refresh .                                                       |
|    - Work inside changes/active/<change>/                                            |
|    - Track proposal, tasks, state, verification, and review                          |
|                                                                                      |
| 3. DEPLOY + VALIDATE                                                                 |
|    project deploy / QA / ospec verify                                                |
|    - Run your project-specific validation flow                                       |
|    - Confirm the active change is ready to archive                                   |
|                                                                                      |
| 4. ARCHIVE THE REQUIREMENT                                                           |
|    ospec finalize changes/active/landing-refresh                                     |
|    - Rebuild indexes and archive the validated change                                |
+--------------------------------------------------------------------------------------+
```

## How The OSpec Workflow Works

```text
┌─────────────────────────────────────────────────────────────────┐
│  1. USER REQUEST                                               │
│     "Use OSpec to create and advance a change for this task."  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. INIT TO CHANGE-READY                                       │
│     ospec init                                                 │
│     - .skillrc                                                 │
│     - .ospec/                                                  │
│     - changes/active + changes/archived                        │
│     - root SKILL files and for-ai guidance                     │
│     - docs/project/* baseline knowledge docs                   │
│     - reuse docs or fall back to placeholders                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. EXECUTION                                                  │
│     ospec new <change-name>                                    │
│     ospec progress                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. DEPLOY + VALIDATE                                          │
│     project deploy / test / QA                                 │
│     ospec verify                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. ARCHIVE                                                    │
│     ospec finalize                                             │
│     rebuild index + archive                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Core Concepts

| Concept | What It Means |
|---------|---------------|
| **Protocol Shell** | The minimum collaboration skeleton: `.skillrc`, `.ospec/`, `changes/`, root `SKILL.md`, `SKILL.index.json`, and `for-ai/` guidance. |
| **Project Knowledge Layer** | Explicit project context such as `docs/project/*`, layered skill files, and index state that AI can read consistently. |
| **Active Change** | A dedicated execution container for one requirement, usually with `proposal.md`, `tasks.md`, `state.json`, `verification.md`, and `review.md`. |

## Features

- **Change-ready initialization**: `ospec init` creates the protocol shell and baseline project knowledge docs in one pass.
- **Guided initialization**: AI-assisted init can ask once for missing summary or tech stack; direct CLI init falls back to placeholder docs when context is missing.
- **Docs maintenance**: `ospec docs generate` refreshes or repairs project knowledge docs when you need it later.
- **Tracked requirement execution**: each change can keep proposal, tasks, state, verification, and review files aligned.
- **Queue helpers**: `queue` and `run` support explicit multi-change execution when one active change is not enough.
- **Plugin workflow gates**: built-in plugin commands support Stitch design review and Checkpoint automation.
- **Skill management**: install and inspect OSpec skills for Codex and Claude Code.
- **Standard closeout**: `finalize` verifies, rebuilds indexes, and archives the change before manual Git commit.

## Installation

### Using npm

```bash
npm install -g @clawplays/ospec-cli
ospec --version
ospec --help
```

### Using This Repository

```bash
npm install
npm install -g .
ospec --version
```

### Requirements

- Node.js `>= 18`
- npm `>= 8`

## Quick Start

### Standard Flow

```bash
# 1. Initialize the repository to change-ready state
ospec init .

# 2. Create a change for one requirement
ospec new landing-refresh .

# 3. Deploy and validate the change
# Run your project deploy / test / QA commands here
ospec verify changes/active/landing-refresh

# 4. Archive the validated change
ospec finalize changes/active/landing-refresh
```

### Refresh Knowledge Docs Later

```bash
ospec docs generate .
```

### Queue Flow

```bash
ospec queue add landing-refresh .
ospec queue add billing-cleanup .
ospec queue status .
ospec run start . --profile manual-safe
ospec run step .
```

### Plugin Flow

```bash
ospec plugins status .
ospec plugins enable stitch .
ospec plugins enable checkpoint . --base-url http://127.0.0.1:3000
```

## Skills

If you install OSpec with `npm install -g @clawplays/ospec-cli` or `npm install -g .`, the managed default sync target is `ospec-change`.

```bash
ospec skill status
ospec skill install
ospec skill status-claude
ospec skill install-claude
```

Install another skill explicitly when needed:

```bash
ospec skill install ospec-init
ospec skill install-claude ospec-init
```

## Documentation

### Core Docs

- [Docs Index](docs/README.md)
- [Prompt Guide](docs/prompt-guide.md)
- [Usage](docs/usage.md)
- [Project Overview](docs/project-overview.md)
- [Installation](docs/installation.md)
- [Skills Installation](docs/skills-installation.md)
- [GitLab Custom Fork Sync](docs/custom-fork-sync.md)
- [Upstream Brand Protection](docs/upstream-brand-protection.md)

### Chinese-Only Advanced Specs

- [Stitch Plugin Spec](docs/stitch-plugin-spec.zh-CN.md)
- [Stitch Plugin Roadmap](docs/stitch-plugin-roadmap.zh-CN.md)
- [Checkpoint Plugin Spec](docs/checkpoint-plugin-spec.zh-CN.md)
- [Current Vibe Coding Spec Flow](docs/current-vibe-coding-spec-flow.zh-CN.md)

## Repository Structure

```text
dist/                       Compiled CLI runtime
assets/                     Managed protocol assets, hooks, and skill payloads
docs/                       Public documentation
scripts/                    Release and installation helpers
.ospec/templates/hooks/     Hook templates shipped with the package
```

## License

This project is licensed under the [MIT License](LICENSE).
