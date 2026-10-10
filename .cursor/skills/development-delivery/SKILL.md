---
name: development-delivery
description: >-
  Ships work in this repository through the development branch. Each plan gets
  a new branch from development, stays uncommitted until approval, then becomes
  one commit per related change set and is squash-merged into development.
  Use when implementing a plan, starting feature work, committing, merging,
  or shipping changes in this repository.
---

# Development delivery

The integration branch is `development`. Leave `main` untouched unless the user asks for it.

When continuing this repository's roadmap, read `ROADMAP.md` and implement only the first task whose status is `Open`.

## Workflow

1. From current `development`, create a new branch for the task. Name it from the work, such as `fix/<topic>` or `chore/<topic>`. Use the branch name in `ROADMAP.md` when that task names one.
2. Do the work only on that branch. Do not commit to `development`. Do not commit on the feature branch before approval.
3. When the work is ready, show what changed and stop. Wait for an explicit approval. Do not commit or merge yet.
4. After approval, make one commit for that related change set. Related edits share the commit. A different task gets its own branch. Do not leave intermediate commits.
5. Squash-merge that branch into `development` so `development` receives one commit for that set. Do not fold unrelated sets into the same commit.
6. In that squash commit, set the task status to `Done` in `ROADMAP.md`. Once `/docs/roadmap` exists, update that page in the same commit.

Approval means the user accepted the finished change, for example "approved", "commit it", or "merge it". Starting implementation is not approval to commit.

Do not start the next task until the previous branch is on `development`.

## Squash into development

On the feature branch, after the approved commit:

```bash
git checkout development
git merge --squash <feature-branch>
git commit -m "$(cat <<'EOF'
<the approved commit message>

EOF
)"
```

Use the same message for the feature-branch commit and the squash. Do not use `--no-verify`, force-push, or change `git config`. Do not delete the feature branch unless the user asks.
