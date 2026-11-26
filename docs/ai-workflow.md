# How fore! was built with an AI agent

Most of fore! was written by an AI coding agent (Claude Code), steered by a person. This page explains the files that steer the agent, the loop the work followed, and which checks the agent ran itself versus which were left to a person.

## The files that steer the agent

The agent reads these at the start of every session. Each one exists because it keeps a session short and predictable.

- [`CLAUDE.md`](../CLAUDE.md): the house rules and the session routine. Docs change with the code, significant decisions get an ADR, `src/core` stays free of React and Expo, `npm run check` runs before work is called done, and tests stay minimal.
- [`AGENTS.md`](../AGENTS.md): what the project is and where code goes (screens in `app/`, network calls in `src/services`, rules in `src/core`). It also says not to code Expo APIs from memory: read the installed types first, then the docs page for the installed SDK version.
- [The `fore-dev` skill](../.claude/skills/fore-dev/SKILL.md): how to run, check and preview the app, plus the gotchas that cost time once (the React Compiler lint rule, the transparent navigator background, the localStorage key that holds settings).
- [`.claude/launch.json`](../.claude/launch.json): the `fore-web` preview server, so the agent can open the dashboard in its own browser pane (port 8082, or the next free one).
- [Architecture decision records](adr/): eleven short ADRs, from tooling to the weather-driven course. A later session reads the decision instead of re-deciding it.
- [The backlog](backlog/README.md): the roadmap as session-sized steps, and a "State" section that records what has been verified and what has not. This is the project's memory between sessions.
- [The pre-commit hook](../.husky/pre-commit) runs `npm run check` (types, lint, formatting, unit tests and [`docs-check.mjs`](../scripts/docs-check.mjs)), and the [commit-msg hook](../.husky/commit-msg) enforces Conventional Commits. A commit that fails the checks does not land. `docs:check` is deliberately small: it fails when [`dependencies.md`](dependencies.md) and `package.json` disagree.
- [CI](../.github/workflows/check.yml) runs the same `check` job, plus an `e2e` job, on every push to `main` and every pull request.

## The loop: build, review, choose a batch, implement

1. **Build.** The first commit was a working v0.1 dashboard.
2. **Self-review.** The agent used the live dashboard for two real places and wrote a dated review: [Review and explorations, 2026-11-25](reviews/2026-11-25.md). It records what works, what doesn't make sense yet (an absolute golf score is "over par" all winter, rain shown as a percentage with no timing), sixteen feature ideas with effort estimates, and a suggested next batch.
3. **Choose a batch.** The review ends with a suggested batch and questions for the person. That batch (seasonal par, rain timing, cache-first loading, home-screen install, and the small fixes) became one commit, and the review's status line says so.
4. **Implement, then plan the next round.** The rest became the [roadmap](backlog/README.md#roadmap): trim scope, publish, TanStack Query, SVG icons, resilience and accessibility, tests, the weather-driven course, and this page. Ideas that weren't chosen sit under "Ideas (not planned)" rather than creeping into the current step.

## One step per session

Each roadmap section is a file of checkboxes, and each checkbox is one session. The routine in `CLAUDE.md`:

1. Read the backlog index, then only the file for the task at hand.
2. Load the `fore-dev` skill before running anything.
3. Do one step, touching only the files it lists.
4. Run `npm run check`, commit, tick the step, update the count and "Next step" in the index, and stop.

The roadmap steps were run as separate agent sessions: a coordinating session started a fresh session for each step with a short brief, and that session reported back when it had committed and pushed. Each session therefore starts cold and relies on the files above, not on a long chat history. You can see the rhythm in `git log`: from the TanStack Query step onward there is roughly one `feat:`, `test:` or `ci:` commit per step, and the backlog tick lands with it or right after. Many steps also carry a "Prove:" line, the evidence the session must produce before it may tick the box.

## What the agent verified

- **Checks.** `npm run check` before every commit, through the hook.
- **Tests.** Unit tests for the rules in `src/core`; service tests against recorded API fixtures; a Playwright smoke test ([`e2e/smoke.spec.ts`](../e2e/smoke.spec.ts)) that runs the web export in headless Chromium with every network request outside the fixtures blocked.
- **CI.** Both jobs green on GitHub after each push, not only locally.
- **The browser preview.** The agent opened the dashboard in its own browser pane, at desktop and 375 px widths, against the live APIs: searching and saving a place, alert banners, the offline and error states, a keyboard-only walk with the focus ring.
- **The accessibility tree.** Read from the preview to confirm each hour and scorecard day is one sentence ([`speech.ts`](../src/core/weather/speech.ts)), and that headings and button roles are right ([ADR 10](adr/0010-accessibility.md)).
- **Contrast.** A small WCAG luminance script, run during the session rather than kept in the repo, checked every text and background pair. The numbers are recorded in [ADR 10](adr/0010-accessibility.md) and [ADR 11](adr/0011-course-variants.md) and in the commit messages.
- **Screenshots.** Day, night and frost course variants, captured from the preview with the `?course=` parameter, in [`docs/images/`](images/).

The backlog's [State](backlog/README.md#state) section lists all of this step by step, with a "Not verified" line next to it.

## What was left to a person

Some things a browser pane can't judge. They are collected in [Manual checks](backlog/manual.md), which is deliberately the last section and never blocks other work:

- allowing "Use my location" in a real browser and seeing the dashboard move;
- looking the app over on a real phone;
- a real screen reader pass with VoiceOver on macOS and iOS;
- reading the README cold, as a reviewer would.

The iOS and Android builds are untested, and the nowcast line and AQI peak warning have only been seen in unit tests, not in real weather. The backlog says so rather than claiming otherwise.
