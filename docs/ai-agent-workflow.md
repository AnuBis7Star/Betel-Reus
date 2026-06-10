# AI Agent Workflow

## 1. Purpose

This workflow exists to reduce expensive Codex token usage while preserving implementation quality on this project.

The repository supports two modes:

- Codex-only mode
- Codex + OpenCode middleman mode

OpenCode is optional. It is not required for development, and the Codex-only workflow must remain fully supported at all times.

## 2. Core principle

The repository code and Git diff are the source of truth.

Temporary AI task specs, reports, handoffs, and logs are local-only working files. They must stay inside `.ai-local/` and must not be treated as permanent project documentation.

## 3. Local-only AI files

Local-only AI workflow files live here:

```text
.ai-local/
  tasks/
  reports/
  handoffs/
  logs/
```

What each folder is for:

- `tasks/`: local task specs for either Codex or OpenCode to execute
- `reports/`: local implementation, verification, fix, and discovery reports
- `handoffs/`: temporary reviewer-to-implementer or implementer-to-reviewer notes
- `logs/`: scratch command notes, investigation notes, or short-lived agent work logs

`.ai-local/` must be ignored by Git:

```gitignore
# Local AI agent workflow files
.ai-local/
```

Rules:

- `.ai-local/` files must not be staged or committed
- `.ai-local/` files must not be moved into tracked docs folders
- temporary AI notes must stay local-only

## 4. Mode A: Codex-only workflow

This is the default and fallback workflow.

1. Create or write the task.
2. Codex plans the change.
3. Codex implements the change.
4. Codex runs checks.
5. Codex reviews its own diff.
6. Codex fixes any issues found.
7. Human manually verifies important user-facing flows.

Project-specific verification commands:

```bash
npm run check
git diff --check
git status --short
git diff --stat
```

If browser JS source changes, run:

```bash
npm run minify
npm run check
git diff --check
```

Important note:

- `npm run minify` rewrites tracked frontend artifacts
- only run it when browser JS source changed
- do not use it as a casual read-only check

Codex may write a local report in `.ai-local/reports/` if the task is large enough to justify it.

## 5. Mode B: Codex + OpenCode middleman workflow

This is an optional future workflow.

1. Codex creates a local task spec in `.ai-local/tasks/`.
2. OpenCode reads the task spec.
3. OpenCode makes minimal targeted edits.
4. OpenCode inspects `package.json` before running commands.
5. OpenCode runs relevant checks.
6. OpenCode writes an implementation report in `.ai-local/reports/`.
7. Codex reviews:
   - task spec
   - implementation report
   - `git diff --stat`
   - relevant diffs
   - check output summary
8. OpenCode fixes simple issues.
9. Codex fixes difficult or architecture-sensitive issues.
10. Human manually verifies important user-facing flows.

OpenCode must not become required for development. This mode is only an optional way to shift repetitive implementation and testing work onto a cheaper middleman agent.

## 6. Agent responsibilities

### Codex should do

- architecture
- planning
- task spec creation
- difficult implementation
- review
- difficult fixes
- security-sensitive decisions
- DB, fallback, upload, and admin-sensitive changes when needed

### Codex should avoid

- wasting context on whole-repo rereads
- broad unrelated refactors
- rewriting working implementations without reason
- committing `.ai-local/` files

### OpenCode should do

- scoped implementation
- repetitive edits
- test and check running
- implementation reports
- simple fixes

### OpenCode should avoid

- broad refactors
- changing deployment config unless explicitly instructed
- changing auth, admin, upload, or database fallback logic without explicit scope
- exposing secrets
- committing `.ai-local/` files
- guessing when the task is ambiguous

## 7. Project-specific risk areas

### Admin surfaces and admin code flow

These routes are protected by `x-admin-code`, and the project includes a local/demo fallback path. Agents should be careful not to weaken access control or expose admin assumptions.

### Database vs in-memory fallback behavior

The app can run with PostgreSQL or with in-memory demo data. That fallback is useful for local development and testing, but agents must not confuse it with production configuration. Any change to services or persistence logic must consider both execution paths.

### File uploads and public upload serving

Event poster uploads use configurable public and filesystem paths. Agents should avoid weakening path safety, fallback behavior, or production path handling.

### Tracked minified JavaScript

`frontend/public/js/app.min.js` and `frontend/public/js/volley.min.js` are tracked artifacts. If source JS changes, the matching minified files must be regenerated intentionally.

### Shared frontend application script

`frontend/public/js/app.js` is a large shared script handling multiple site features. Narrow tasks should avoid broad cleanup or unrelated edits in this file.

### Security and rate limiting middleware

Central middleware controls CORS, security headers, request size limits, and rate limiting. Small mistakes here affect the whole app surface.

### Production deployment and environment config

Production behavior depends on env vars, upload paths, and domain settings. Agents should not change deployment assumptions casually.

### Shared utilities and response helpers

Utility modules affect many routes and responses. Unrelated refactors in these files create wide regression risk.

## 8. Task spec template

Real task specs should usually be saved locally in `.ai-local/tasks/` and should not be committed.

~~~~md
# Task Spec

## Task ID
`001-task-name`

## Mode
`Mode A: Codex-only` or `Mode B: Codex + OpenCode`

## Goal
Briefly describe the exact change requested.

## Scope
- Files likely involved:
  - `path/to/file`
- Files not to touch:
  - `path/to/file`

## Repository Rules
- Use the existing ESM / `.mjs` conventions.
- Preserve route/controller/service boundaries.
- Preserve database and in-memory fallback behavior unless explicitly in scope.
- Do not expose secrets.
- Update `frontend/public/i18n/ro.json` and `frontend/public/i18n/es.json` if visible text changes.
- Regenerate minified JS after source JS changes when relevant.
- Do not refactor unrelated code.

## Implementation Requirements
- Make minimal targeted edits only.
- Keep admin, upload, and security-sensitive logic unchanged unless explicitly in scope.
- Preserve existing public and admin flow behavior outside the requested task.

## Acceptance Criteria
- [ ] Requested behavior is implemented
- [ ] No unrelated files changed
- [ ] Relevant checks pass
- [ ] Minified JS updated if source JS changed
- [ ] Translations updated if visible text changed

## Commands To Run
```bash
npm run check
git diff --check
```

Additional command when browser JS source changed:
```bash
npm run minify
```

## Expected Report Path
`.ai-local/reports/001-implementation-report.md`

## Rollback / Safety Notes
- Stop if the task expands into architecture changes.
- Stop if the task unexpectedly touches auth, admin code, upload paths, deployment config, or secrets.
- Do not commit `.ai-local/` files.

## Ambiguity Rule
If the task is ambiguous, stop and report:
- what is unclear
- what files were inspected
- what clarification is needed
~~~~

## 9. Implementation report template

Real implementation reports should usually be saved locally in `.ai-local/reports/` and should not be committed.

~~~~md
# Implementation Report

## Task ID
`001-task-name`

## Mode
`Mode A: Codex-only` or `Mode B: Codex + OpenCode`

## Summary Of Changes
Short summary of what changed.

## Files Changed
- `path/to/file`

## Commands Run
```bash
npm run check
git diff --check
```

## Results
- `npm run check`: pass/fail
- `git diff --check`: pass/fail
- other command results if relevant

## Issues Found
- issue 1
- issue 2

## Uncertainties
- uncertainty 1

## Manual Verification Needed
- page or flow 1
- page or flow 2

## Unrelated Files Touched
- none
or
- `path/to/file` and why

## Secrets Safety
- Confirm no secrets were added, exposed, or copied into tracked files.

## Final Status
- complete
- partial
- blocked
~~~~

## 10. Review checklist

Use this review checklist for either Codex review or human review.

Commands:

```bash
git status --short
git diff --stat
git diff --name-only
git diff --check
git check-ignore -v .ai-local/reports/example.md
```

Checklist:

- no `.ai-local/` files staged
- no secrets changed or exposed
- minified JS updated if source JS changed
- translations updated if visible text changed
- database and in-memory fallback behavior considered
- admin, security, and upload logic not weakened
- no unrelated refactors

Useful extra checks when relevant:

```bash
git diff -- .env.example backend/.env.example
git diff -- path/to/file
```

## 11. How to switch workflows

### To use Codex-only mode

Give Codex the task directly or provide a local task spec and ask Codex to plan, implement, check, review, and report.

### To use Codex + OpenCode mode

Give Codex the planning and review role. Give OpenCode the implementation and testing role using a local task spec and local implementation report.

Switching between these modes does not require project code changes. The codebase stays the same; only the workflow changes.

## 12. What not to commit

Do not commit:

- `.ai-local/`
- task-specific implementation reports
- task-specific verification reports
- temporary handoff notes
- agent logs
- copied AI conversations
- secrets or environment values

## 13. Final note

Use the cheapest capable agent for mechanical edits and the strongest agent for architecture, review, and difficult fixes.
