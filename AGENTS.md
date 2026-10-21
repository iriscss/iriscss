# AGENTS.md

Instructions for any AI tool or agent working on Iris CSS. The full rules live in `.github/instructions/`. Read the ones listed below before you act.

## Always read

- `.github/instructions/development-policy.instructions.md`: semantic versioning, the `{major}.x` release branches, and the rules for each: best design on the next major, compatibility on released ones.
- `.github/instructions/general.instructions.md`: writing style, spelling and CSS basics such as no manual vendor prefixes.
- `.github/instructions/project-identity.instructions.md`: framework name, package names, class and custom property naming.
- `.github/instructions/framework-positioning.instructions.md`: what Iris CSS is and how it compares to other frameworks.

## Read when editing CSS

- `.github/instructions/framework-architecture.instructions.md`: directory structure and where new code goes.
- `.github/instructions/css-style-guide.instructions.md`: CSS formatting and style.
- `.github/instructions/css-property-order.instructions.md`: the order of properties inside a rule.

## Layout

- `src/`: the framework source. `npm run build` writes `dist/`.
- `docs/md/`: Markdown docs, next to the source they describe.
- `ai/iris-usage.md`: rules for AI assistants that build pages with Iris CSS. A change to a class, attribute or markup pattern needs a matching change here, and in `docs/md/selectors.md`.
- The website lives in a separate repo, `iriscss/iriscss.website`, checked out next to this one in `../iriscss.website`. A framework change that affects the docs or the visual baselines needs a matching change there.
