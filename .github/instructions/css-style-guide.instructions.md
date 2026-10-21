---
applyTo: "**/*.css"
---

# CSS Style Guide

When formatting or generating CSS for this project, follow the
**Principles of writing consistent, idiomatic CSS**
(based on [necolas/idiomatic-css](https://github.com/necolas/idiomatic-css)).

## General Principles

- All code should look like a single person typed it.
- Strictly enforce the agreed-upon style.
- If in doubt, use existing patterns found in the codebase.

## Whitespace

- Use **2 spaces** for indentation (match the existing codebase convention).
- Never mix spaces and tabs.
- Remove end-of-line whitespace.

## Comments

- Place comments on a new line above their subject.
- Keep line-length to a sensible maximum (~80 columns).
- Use comments to break CSS into discrete sections.
- Use sentence case for comment text.

**Section comment block:**

```css
/* ==================================================
   Section comment block
   ================================================== */
```

**Sub-section comment block:**

```css
/* Sub-section comment block
   -------------------------------------------------- */
```

**Descriptive comment (Doxygen-style):**

```css
/**
 * Short description using Doxygen-style comment format
 *
 * Long description with more detail. Can include example HTML,
 * URLs, or any other useful information.
 */
```

## Format

- Use one discrete selector per line in multi-selector rulesets.
- Include a single space before the opening brace of a ruleset.
- Include one declaration per line in a declaration block.
- Use one level of indentation for each declaration.
- Include a single space after the colon of a declaration.
- Use lowercase and shorthand hex values, e.g., `#aaa`.
- Prefer hex color values over rgba, hsl, or named colors for consistency and simplicity.
- Use double quotes consistently, e.g., `content: ""`.
- Quote attribute values in selectors, e.g., `input[type="checkbox"]`.
- Avoid specifying units for zero-values, e.g., `margin: 0`.
- Include a space after each comma in comma-separated property or function values.
- Include a semicolon at the end of the last declaration in a declaration block.
- Place the closing brace in the same column as the first character of the ruleset.
- Separate each ruleset by a blank line.

**Example:**

```css
.selector-1,
.selector-2,
.selector-3[type="text"] {
  display: block;
  font-family: helvetica, arial, sans-serif;
  color: #333;
  background: #fff;
  background: linear-gradient(#fff, #ccc);
}

.selector-a,
.selector-b {
  padding: 10px;
}
```

## Declaration Order

Follow `css-property-order.instructions.md`. Stylelint enforces it.

## Long Values

Long comma-separated values should be arranged across multiple lines:

```css
.selector {
  background-image:
    linear-gradient(#fff, #ccc),
    linear-gradient(#f3c, #4ec);
  box-shadow:
    1px 1px 1px #000,
    2px 2px 1px 1px #ccc inset;
}
```

## Custom Property Naming: Color Variables

A variable that holds a color uses `color-{role}` as its property, after the owner, part and state. Global theme colors and the palette put the `color` category first instead.

**Owned colors:** `--i-{owner}[-{part}][-{state}]-color-{role}`

- Roles: `text`, `background`, `border`, `outline`. When a color paints a part rather than a CSS property, the part is the role: `thumb`, `track`, `placeholder`, `highlight`.
- A plain text color is `color-text`. Never end a name in `-color` or use a bare `--i-color-{owner}`.

**Global colors:** `--i-color-{semantic-name}`, for colors read by many owners.

**Correct:**

```css
--i-color-background: #fff;
--i-color-subtle: #646b79;
--i-color-subtle-border: #e7eaf0;
--i-selection-color-background: #d0ebf9;
--i-input-color-border: #ccc;
--i-h1-color-text: #1a1a1a;
--i-dropdown-hover-color-background: #202632;
--i-range-active-color-track: #6f788c;
```

**Incorrect:**

```css
--i-background-color: #fff;              /* color at the end */
--i-input-border-color: ...;             /* color at the end */
--i-color-drawer-background: ...;        /* owned color, owner must come first */
--i-drawer-color: ...;                   /* say which color: --i-drawer-color-text */
--i-dropdown-color-hover-background: ... /* state goes before color */
```

**Exceptions:**

- Color palette variables use `--i-color-{palette}-{shade}`, e.g.,
  `--i-color-blue-500`, `--i-color-amber-200`.
- Non-color variables like `--i-duration` and `--i-border-width` follow the
  general naming rules in `framework-architecture.instructions.md`.

## Iris CSS-Specific Conventions

- Use `var()` references to Iris design tokens rather than hardcoded values.
- Use semantic HTML elements and ARIA attributes over utility classes.
- When creating new components, follow the existing pattern of using CSS custom
  properties for theming (colors, spacing, borders, etc.).
- Use `:is()`, `:where()`, and `:not()` for selector grouping where appropriate,
  matching existing patterns in the codebase.
