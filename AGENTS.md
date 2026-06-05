# Agent Workflow

Guidance for work in this repository. Keep changes small, predictable, and easy for church volunteers to maintain.

## Workflow

- Do not work directly on `main` for feature work.
- Start from updated `main`: `git checkout main`, then `git pull --ff-only origin main`.
- Create a short-lived branch per task.
- Keep commits focused and relevant to the request.
- Commit only unless explicitly asked to push.
- Use pull requests for important or high-risk work.
- Do not change unrelated app code.

## Coding Rules

- Romanian is the base and fallback language.
- Spanish translations live in `frontend/public/i18n/*.json`.
- When adding visible text, update both `frontend/public/i18n/ro.json` and `frontend/public/i18n/es.json`.
- When editing source JavaScript, update the corresponding minified JavaScript file.
- Never put secrets in frontend files.
- Admin panels should be simple, fast, clear, and responsive.
- Public pages may use subtle, tasteful motion.

## Verification

- Run `npm run check`.
- Run `git diff --check`.
- Manually mention what was checked.
- For UI changes, verify the relevant desktop and mobile flows when practical.

## Commits And PRs

- Use professional, human-readable commit messages.
- Describe the change, not the tool.
- Do not mention Codex, ChatGPT, AI, or generated code in commit messages, branch names, or PR titles unless explicitly asked.
- Avoid noisy messages like `fix stuff`, `updates`, or `misc changes`.
