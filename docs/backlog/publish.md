# 2. Publish on GitHub

Goal: a public repo with CI running on every push.

Approved by the user on 2026-11-25. Do it only after task 1, so nothing personal is published.

- [ ] **2.1 Create and push.** `gh repo create fore --public --source . --push` from `main`, with the description from `package.json`. Confirm the commit author is the GitHub no-reply address. Watch the first `check` workflow run until it passes; fix and push if it fails. Add the CI badge to the README.
      Prove: the repo page shows the code and a green check on the latest commit.
