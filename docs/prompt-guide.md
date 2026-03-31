# Prompt Guide

## Principle

Prompt OSpec with short intent, not with long internal checklists.

OSpec should expand the required init, inspection, and change rules internally.

## Recommended Prompts

### Initialize A Project

```text
Use OSpec to initialize this project.
```

### Initialize The Workflow Framework

```text
Use OSpec to initialize the workflow framework for this project.
```

### Backfill The Knowledge Layer

```text
Use OSpec to backfill the project knowledge layer.
```

### Start A Requirement

```text
Use OSpec to create and advance a change for this requirement.
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
Use $ospec to backfill the project knowledge layer.
Use $ospec to inspect active changes and progress.
Use $ospec-finalize to close a completed change before commit.
```

## Prompt Boundaries

You usually do not need to repeat:

- the internal file checklist for init
- protocol-shell verification steps
- warnings like "do not create a web template" on every prompt

Those are OSpec defaults and should be enforced by the CLI and the installed skills.
