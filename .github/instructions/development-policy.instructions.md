---
applyTo: "**"
---

# Development Policy

Iris CSS follows [semantic versioning](https://semver.org). Every major has its own branch, and the rules for a change depend on the branch it targets: the next major favors the best design, a released major favors compatibility.

## Versions

The public API is every class, `--i-` custom property, styled attribute and markup pattern the docs describe, and the file layout under `src/`. Private `--_` variables, comments and tests are not part of it.

- **Patch** (`1.0.1`): bug fixes that keep the API. A fix may change a look when the old look was the bug.
- **Minor** (`1.1.0`): new classes, variables, attributes and patterns. Nothing existing is renamed, removed or changes meaning.
- **Major** (`2.0.0`): anything that breaks the API, such as a renamed class, a removed variable or a changed markup pattern.

## Branches

- **One branch per major, named `{major}.x`**: `1.x`, `2.x` and so on, for every past, current and future major.
- **`main` holds the latest released major.** It only moves forward by merging from that major's branch.
- **Work lands on the major branch first.** A minor or patch is merged into `{major}.x`. Once it is decided to release it, `{major}.x` is merged into `main` and the release is tagged there.
- **The next major gets its branch when work on it starts**, at the latest when its first tag is created. That branch keeps living after the release, for the minors and patches of that major.
- **A new major cuts `main` off from older majors.** Once `2.x` is merged into `main` and `2.0.0` is tagged, nothing from `1.x` reaches `main` again.
- **Older majors release from their own branch.** A minor or patch that keeps an older major supported, such as `1.4.2` after `2.0.0`, is tagged on `1.x`, never on `main`.

Tags are the plain version, such as `1.0.0`, with no `v` prefix. Each release gets release notes on GitHub: what was added, what was fixed and, for a major, what broke.

A fix needed in several majors is made on each branch on its own terms. Do not merge an older major branch into a newer one, or the other way around.

## Next major branch: the best design wins

The branch of a major that has no release yet. Its rules favor big improvements.

- **Breaking changes are allowed.** Rename, move, merge or delete classes, custom properties, selectors, files and docs when it gives a better design.
- **Size of the change does not matter.** If the right fix touches 40 files, touch 40 files. Do not settle for a local patch when the real problem is the structure around it.
- **Fix the cause, not the symptom.** When you find a design flaw while working on something else, say so and propose the proper fix.
- **No aliases or shims.** Rename or remove cleanly. The release notes list every break.
- **Remove dead code.** Do not comment it out or leave it "just in case".

## Released major branches: compatibility wins

The branch of the current major and of every older major still supported. Its rules favor stability for the sites already using that version.

- **Never break the API.** A minor only adds, a patch only fixes. If the right fix needs a break, say so and propose it for the next major branch instead.
- **Keep the change as small as the fix allows.** Prefer a local fix that leaves everything else as it is over a restructure. A restructure waits for the next major.
- **Existing pages must look and behave the same,** except for the bug being fixed. A visual baseline change needs a reason in the commit.
- **Fix the cause where it is safe.** When the proper fix would break something, ship the safe fix here and propose the proper one for the next major.
- **Remove dead code only when it is not part of the API.** Unused public classes and variables stay until the next major.
- **New features are additive and marked.** A feature added in a minor release gets an "Added in" badge in the website docs.

## On every branch

- Update everything the change affects. Source, docs, the site, examples and AI instruction files must match the new state in the same change.
- Follow the rules in the other instruction files (naming, style, property order, architecture).
- Keep `npm run check` passing.
- If two good options trade off against each other, explain the tradeoff briefly and recommend one instead of picking silently.
- When it is not clear which branch a change targets, ask before you start.
