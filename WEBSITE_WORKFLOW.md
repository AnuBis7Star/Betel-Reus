# Safe Website Workflow

This project treats `main` as the production branch.

Do not make normal website changes directly on `main`. Use a short-lived branch, open a pull request, test it, then merge when ready.

## Normal Change Flow

1. Start from the latest production branch:

```bash
git switch main
git pull origin main
```

2. Create a short-lived branch:

```bash
git switch -c codex/short-change-name
```

3. Make the change locally.

4. Check that the app still starts:

```bash
npm run check
npm start
```

5. Test the important pages:

```text
/
/library.html
/admin.html
/volley.html
/api/books
/api/verse
/api/youtube
```

6. Commit and push the branch:

```bash
git add .
git commit -m "Short clear message"
git push origin codex/short-change-name
```

7. Open a pull request into `main`.

8. Review and test the PR.

9. Merge into `main` only when it is ready for production.

10. Delete the feature branch after merge.

## Preview Deploys

If Hostinger or another hosting provider supports preview deploys for pull requests, use the PR preview for testing.

If there is no PR preview, test locally before merging.

## When We Need A Staging Branch

We do not need a `staging` branch for small text, style, or content updates if local testing is enough.

We should add a `staging` branch later if:

- Hostinger cannot provide pull request previews.
- Several people are changing the site at the same time.
- A change affects database structure, login, admin permissions, payments, or forms.
- Volunteers need to test changes on a public URL before production.

Recommended future flow if staging is needed:

```text
feature branch -> pull request -> staging -> test -> main
```

## Simple Rule For Volunteers

If the change affects only text, images, or small visual details, make a short branch and open a PR.

If the change affects database, admin, library orders, login, or forms, test it locally first and ask for review before merging.
