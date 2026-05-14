# How we work on the CADASIL Global website

This is a simple guide for everyone who edits this site. You don't need to be a
developer — just follow these habits and changes will go smoothly.

## The one rule that prevents most problems

**Never edit `main` directly.**

- `main` is the live website. Treat it as "look but don't touch."
- No editing files in the GitHub website UI on `main`.
- No "commit straight to `main`."
- Every change goes through a **branch** and a **pull request (PR)**.

`main` only ever changes by merging a reviewed PR.

## Why this matters

If two people change the same file at the same time and both try to update
`main` independently, Git can't tell which version is correct. It stops and
reports a **merge conflict**. Conflicts are normal and fixable — the workflow
below just makes them rare.

## The workflow — every time, for everyone

1. **Say what you're working on.** Before starting, tell the others: e.g.
   "I'm working on the homepage hero today." This avoids two people touching
   the same page at once.
2. **Start a fresh Claude session for each task.** Claude automatically
   creates a new branch from the latest `main`.
3. **Let Claude do the work** on that branch and open a PR.
4. **Review the PR on GitHub.** Read the description, open the "Files changed"
   tab, and check the Cloudflare preview link.
5. **Merge one PR at a time.** Merge it, wait for it to land on `main`, then
   start or merge the next one.
6. **After merging, delete the branch** (there's a button on the PR page).
   Start your next task from a new session, so it branches off the new `main`.

## If you see "This branch has conflicts"

Don't panic and don't force anything. Tell Claude:

> "This PR has conflicts, please resolve them."

Claude will pull in the latest `main` and sort it out.

## Quick don'ts

- Don't reuse an old branch or session from days ago — it's based on a stale `main`.
- Don't merge two PRs at the same moment.
- Don't edit files directly on github.com.
- Don't push to `main` — only *merge* into it via PRs.

## Deployment

The site is hosted on Cloudflare Pages. When a PR is merged into `main`,
Cloudflare automatically rebuilds and deploys the live site at
cadasilglobal.org within a minute or two. Each open PR also gets its own
preview link (posted as a comment on the PR) so you can check changes before
merging.
