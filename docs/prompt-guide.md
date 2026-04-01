# Prompt Guide

## Principle

Prompt OSpec with short intent, not with long internal checklists.

OSpec should expand the inspection, initialization, docs-maintenance, and change rules internally.

## Recommended Prompts

### Initialize A Project

Preferred default:

```text
Use OSpec to initialize this project.
```

What this should imply:

- run `ospec init` so the repo ends in change-ready state
- the user does not need to ask for `ospec status` first
- ask one concise follow-up for project summary or tech stack only when AI assistance is available and project context is missing
- if the user skips that context, continue with placeholder docs instead of blocking init

### Optional: Include Known Context In The Same Prompt

```text
Use OSpec to initialize this project. It is an internal admin portal built with Node.js, React, and PostgreSQL.
```

### Refresh The Knowledge Layer Later

```text
Use OSpec to refresh or repair the project knowledge layer.
```

### Start A Requirement

```text
Use OSpec to create and advance a change for this requirement.
```

### Build A Queue First

```text
Use OSpec to break this TODO into multiple changes, create a queue, and show the queue first. Do not run it yet.
```

The default meaning here is:

- present an ordered list of change names first
- keep each change name in kebab-case
- make each change one clear execution unit instead of a mixed bundle

### Execute A Queue Explicitly

```text
Use OSpec to create a change queue and execute it explicitly with ospec run manual-safe.
```

### Close A Completed Change

```text
Use OSpec to finalize this completed change before commit.
```

### Inspect Progress

```text
Use OSpec to inspect the current active changes and overall project progress.
```

## Skill-Based Prompts

When your AI client supports OSpec skills, prefer the skill name directly:

```text
Use $ospec to initialize this project.
Use $ospec to refresh or repair the project knowledge layer.
Use $ospec to inspect active changes and progress.
Use $ospec to break this TODO into multiple changes, create a queue, and show the queue first.
Use $ospec to create a change queue and execute it explicitly with ospec run manual-safe.
Use $ospec-finalize to close a completed change before commit.
```

## Prompt Boundaries

You usually do not need to repeat:

- the internal file checklist for init
- protocol-shell verification steps
- warnings like "do not create a web template" on every prompt
- warnings like "do not start queue mode" on every prompt

Those are OSpec defaults and should be enforced by the CLI and the installed skills.
