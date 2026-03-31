# Skills Installation

## Codex

If you install this release with `npm install -g .`, only `ospec-change` is synced automatically for Codex.

Check status:

```bash
ospec skill status
```

Install or sync:

```bash
ospec skill install
```

Default location:

```text
~/.codex/skills/
```

- `ospec-change`

Install another skill explicitly:

```bash
ospec skill install ospec-init
```

## Claude Code

If you install this release with `npm install -g .`, only `ospec-change` is synced automatically for Claude Code.

Check status:

```bash
ospec skill status-claude
```

Install or sync:

```bash
ospec skill install-claude
```

Default location:

```text
~/.claude/skills/
```

Default installed skill:

- `ospec-change`

Install another skill explicitly:

```bash
ospec skill install-claude ospec-init
```

## Prompt Naming

Prefer `$ospec` in new prompts.

Use `$ospec-cli` only when older automation or habits still reference the legacy name.
