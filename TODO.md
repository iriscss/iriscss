# Iris CSS: open work

No open items. Fixed items are removed, git history has them.

`npm run check` passes: lint, Prettier, the build and the framework tests in Chromium and Firefox. WebKit runs in CI, or locally with `IRIS_WEBKIT=1` after `sudo npx playwright install-deps webkit`. The website repo runs the WCAG 2.2 AA axe scan and the visual tests.

## Decisions kept on purpose

These came up in the review and stay as they are:

- **Default `margin-bottom` on buttons and fields.** Classless forms rely on it, and components remove it where they need to.
- **`--i-border-radius-medium` and `--i-border-radius-large`.** No rule uses them, but they complete the radius scale for users, as `variables.md` explains.
- **`.small` fields zoom on iPhone.** Safari zooms into text under 16px. Documented on the sizes page.
- **Keyboard users can close the open tab.** Enter or Space on the open summary closes it. Only a script can stop that, and Iris has none, so the tabs page documents it.
- **`data-tooltip` skips elements that draw their own pseudo elements.** Busy buttons, dropdown buttons, `.close`, `.nav-toggle`, `summary` and breadcrumb and step items keep their icon. A `popover="hint"` tooltip covers them, and also clipping and Esc, where `interestfor` is supported.
- **In browsers without `light-dark()`, a `:root` theme override stops at nested themes.** Those browsers recompute theme colors on each `data-theme`, `.light` and `.dark` element. The docs say to set the override on `:root, [data-theme], .light, .dark` to cover them.
- **Validation icons keep baked colors.** Inputs cannot draw a masked icon. The docs say to replace `--i-svg-valid` and `--i-svg-invalid` along with the success and danger colors.
