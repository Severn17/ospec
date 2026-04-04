# Installation

Install the official OSpec CLI package `@clawplays/ospec-cli` and run the `ospec` command.

## Requirements

- Node.js `>= 18`
- npm `>= 8`

## Install From npm

```bash
npm install -g @clawplays/ospec-cli
```

OSpec supports spec-driven development (SDD) and document-driven development for AI coding agents and CLI workflows.

## Verify

```bash
ospec --version
ospec --help
```

## Managed Skills

- `ospec init [path]` and `ospec update [path]` sync the managed `ospec` and `ospec-change` skills for Codex
- Claude Code sync also runs when `CLAUDE_HOME` or an existing `~/.claude` home is present
- If a matching managed skill is already installed locally, the packaged version overwrites it

If you want another OSpec skill, install it explicitly, for example:

```bash
ospec skill install ospec-init
```
