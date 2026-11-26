# 5. Resilience and accessibility

Goal: the app fails gracefully and is usable with a keyboard and a screen reader.

- [ ] **5.1 Errors and empty states.** Export an `ErrorBoundary` from `app/_layout.tsx` (Expo Router's route-level boundary) with an "Out of bounds" card and a retry. Review loading, offline and no-data states for each card so none can render blank.
      Prove: force a render error and a failed forecast in the preview; both show a friendly card with retry.
- [ ] **5.2 Accessibility pass.** Accessible labels for icons, hour cells and scorecard columns (one label per day: "Saturday, high 52, low 44, rain 17 percent, one under par"). Roles for buttons and headers. Visible focus on web. Check text contrast against the tokens and fix any below WCAG AA.
      Prove: keyboard-only walk-through in the preview; the accessibility tree (`read_page`) reads sensibly; contrast ratios noted in the commit.
