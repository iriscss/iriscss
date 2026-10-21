---
applyTo: "**/*.css"
---

# Framework Architecture

This guide defines the organizational structure and architectural patterns for Iris CSS. Follow these guidelines when adding new features, refactoring code, or making structural decisions.

## Directory Structure

The Iris CSS framework is organized into logical modules under `src/`:

```
src/
├── accessibility/    # User preferences, high contrast and ARIA cursors
├── base/             # Document defaults, themes, focus ring, color class fills, print
├── components/       # Reusable UI components
├── elements/         # HTML element styling
├── forms/            # Form element styling
├── layout/           # Containers, grid, layout primitives and the hero
├── modifiers/        # Cross-cutting style modifiers
├── utilities/        # Single purpose classes: display, alignment, overflow, colors
└── variables/        # Design tokens and custom properties
```

Each directory maps to one cascade layer (see Cascade Layers), so where a file lives tells you what it wins over. The one exception is `base/print.css`, which has the `iris.print` layer to itself.

## Module Categories

### Elements (`elements/`)
**Purpose:** Style native HTML elements with semantic defaults.

**When to use:**
- Styling standard HTML elements (`<button>`, `<a>`, `<table>`, etc.)
- Providing sensible defaults that work without classes
- Element-specific behavior that applies globally

**Naming pattern:** Use descriptive names matching the element type (e.g., `button.css`, `typography.css`, `table.css`)

**Example:**
```css
/* elements/button.css */
button,
[type="submit"],
[type="reset"],
[type="button"],
[role="button"] {
  /* Default button styles */
}
```

### Components (`components/`)
**Purpose:** Reusable UI patterns that combine multiple elements or require specific structure.

**When to use:**
- Multi-element patterns (cards, modals, navigation)
- Requires specific HTML structure
- Not a single native HTML element
- Benefits from encapsulation

**Naming pattern:** Use component name (e.g., `card.css`, `modal.css`, `accordion.css`)

**Example:**
```css
/* components/card.css */
.card {
  /* Card container */
}

.card > header {
  /* Card header */
}

.card > footer {
  /* Card footer */
}
```

### Modifiers (`modifiers/`)
**Purpose:** Cross-cutting variations that apply to multiple elements or components.

**When to use:**
- Style variations that work across different elements
- Size variations (`.small`, `.medium`, `.large`)
- Color classes (`.primary`, `.danger`)
- Visual styles (`.rounded`, `.outlined`, `.tint`, `.deep`)
- Forced interaction states for demos (`.hover`, `.focus`)

**Naming pattern:** Use modifier category name (e.g., `size.css`, `states.css`, `styles.css`)

**Modifier types:**
- **Size** (`size.css`) - Dimensional variations (`.small`, `.medium`, `.large`). On buttons and fields they set the private multipliers `--_size-block`, `--_size-inline` and `--_size-font`. On a `.group` they reach every control inside
- **States** (`states.css`) - Forced interaction states (`.hover`, `.active`, `.focus`, `.disabled`)
- **Styles** (`styles.css`) - Visual variants (`.rounded`, `.square`, `.outlined`). The button modes `.tint` and `.deep` live in `elements/button.css`
- **Contextual** (`contextual.css`) - Status colors (`.info`, `.success`, `.warning`, `.danger`, `.link`)
- **Hierarchy** (`hierarchy.css`) - Importance colors (`.primary`, `.secondary`, `.contrast`, `.accent`)

The color classes only set `--i-variant` and `--i-variant-inverse`. The zero specificity rule that paints a plain element with its color lives in `base/variants.css`, so components that use the color their own way still win over it.

**Example:**
```css
/* modifiers/styles.css */
:is(button, [type="submit"], [role="button"]).rounded {
  border-radius: var(--i-border-radius-pill);
}

:is(.card, .box).rounded {
  border-radius: var(--i-border-radius-xlarge);
}
```

### Variables (`variables/`)
**Purpose:** CSS custom properties (design tokens) that define the framework's design system.

**When to use:**
- Global design tokens (preferred for all reusable values)
- Reusable values across the framework
- Theming and customization points
- Component-specific variables that might be customized

**Important:** Iris CSS favors global variables. Most custom properties should be defined here in `:root` rather than scoped to individual components.

**Naming pattern:** Use token category (e.g., `spacing.css`, `typography.css`, `borders.css`)

**Example:**
```css
/* variables/spacing.css */
:root,
:host {
  --i-spacing: 1rem;
  --i-section-spacing-block: var(--i-spacing);
}
```

### Base (`base/`)
**Purpose:** Defaults that everything else builds on: `color-scheme` for the page, `data-theme`, `.light` and `.dark` (`themes.css`), box sizing, root typography and page colors (`document.css`), the fill for elements with a color class (`variants.css`), body, landmark and section spacing (`landmarks.css`), touch defaults (`interaction.css`), the fallback focus ring (`focus.css`) and print styles (`print.css`).

**Note:** Color variables, including the dark theme, live in `variables/`. `themes.css` only sets `color-scheme`.

**Naming pattern:** Use the scope it styles (e.g., `document.css`)

### Layout (`layout/`)
**Purpose:** Page structure that must win over element and component spacing.

**When to use:**
- Container and grid systems
- Layout primitives (`.stack`, `.cluster`, `.with-sidebar`, `.switcher`) and the hero band

**Naming pattern:** Use layout concept (e.g., `grid.css`, `container.css`, `primitives.css`)

### Forms (`forms/`)
**Purpose:** Form element styling and form-specific patterns.

**When to use:**
- Input, select, textarea styling
- Form-specific controls (checkboxes, radios, ranges)
- Form layouts and validation states

**Naming pattern:** Use form element or pattern (e.g., `controls.css`, `checkbox-radio-switch.css`)

### Utilities (`utilities/`)
**Purpose:** Single purpose classes that win over any element, component or modifier style.

**When to use:**
- Display, alignment and overflow helpers (`.hidden`, `.text-center`, `.truncate`)
- Palette classes (`.color-*`, `.background-*`) and gradient classes
- Screen reader helpers (`.sr-only`, `.sr-only-focusable`)

**Naming pattern:** Use the utility family (e.g., `display.css`, `palette.css`, `screen-reader.css`)

### Accessibility (`accessibility/`)
**Purpose:** Rules that must win over everything else: user preferences and assistive technology support.

**When to use:**
- Preference based features (reduced motion, reduced transparency, more contrast, forced colors)
- ARIA attribute cursors

A default that must lose to elements and components, such as the focus ring, goes in `base/` instead.

**Naming pattern:** Use accessibility feature (e.g., `aria.css`, `contrast.css`, `preferences.css`)

## Cascade Layers

Every rule sits in a layer, declared once at the top of `iris.css`:

```css
@layer iris.variables, iris.base, iris.elements, iris.forms, iris.components,
  iris.layout, iris.modifiers, iris.utilities, iris.accessibility, iris.print;
```

Each `@import` in `iris.css` names its layer, for example `@import "./elements/table.css" layer(iris.elements);`. The `@layer` statement must stay above every `@import`.

- **A later layer always wins**, whatever the specificity. Modifiers beat components, utilities beat modifiers, and user preferences in `iris.accessibility` beat everything.
- **Layout comes after components.** A primitive's gap must replace the margins of the elements and components it holds, and the hero type must beat the plain heading sizes.
- **Defaults that must lose go early.** A zero specificity rule that should give way to elements and components (the focus ring in `base/focus.css`, the color class fill in `base/variants.css`) belongs in `iris.base`, not in a later layer.
- **Utilities** (everything in `utilities/`) go in `iris.utilities`, so a utility class wins over any component style.
- **No specificity hacks.** Inside a layer, use plain specificity and source order. Write base state rules with `:where()` so a state or modifier wins with one class or pseudo class.
- **No `!important`.** A layered `!important` beats every user style, even an unlayered `!important`. Only user preferences, forced colors and `[hidden]` use it, and Stylelint (`declaration-no-important`) enforces this.

## Browser Support

The floor is Chrome and Edge 111, Firefox 113, Safari 16.2 and Opera 97, set by `color-mix()`. The `browserslist` in `package.json` matches it, so Autoprefixer adds the prefixes these versions need.

A feature newer than the floor must degrade cleanly:

- Wrap it in `@supports`, as the popover, anchoring, customizable `select` and carousel buttons do.
- Or write a fallback declaration first, for example `float: right` before `float: inline-end`, or a `calc(... * 1em)` value before a `1lh` one.
- `:has()` and other new selectors are safe inside `:is()` or `:where()`, which skip what they do not understand. On their own, they drop the whole rule.
- `light-dark()` needs nothing extra. The build adds the fallback.
- Never mix `::-webkit-` and `::-moz-` pseudo elements in one selector list. Chromium drops the whole rule. Stylelint rejects it.
- Use logical properties (`margin-inline-start`, `padding-inline`, `border-start-start-radius`) so right to left text mirrors. Stylelint rejects physical margin, padding and corner properties.
- Use `dvh`, `svh` or `svw` instead of `vh` and `vw`, so mobile browser bars do not cut content off.

## Tests

`npm run test` runs Playwright regression tests from `tests/` against `dist/iris.css`. They check computed styles, layer order and contrast in both themes. Build first, and add a test when you fix a bug.

The website repo, `iriscss/iriscss.website`, holds the visual tests. Its `npm run test:visual` compares screenshots of every docs example with the baselines in `visual/snapshots`, in light, dark, right to left and print. When a framework change is meant to look different, run `npm run test:visual:update` there and commit the new baselines in the website repo.

## Decision Framework

When adding new CSS, ask these questions:

### 1. Is it a native HTML element style?
→ **Add to or create file in `elements/`**

### 2. Is it a multi-element pattern with specific structure?
→ **Add to or create file in `components/`**

### 3. Does it apply across multiple elements/components?
→ **Add to appropriate file in `modifiers/`**

### 4. Is it a reusable design token or custom property?
→ **Add to appropriate file in `variables/` as a global variable (preferred)**

### 5. Is it layout or structure related?
→ **Add to appropriate file in `layout/`**

### 6. Is it form-specific?
→ **Add to appropriate file in `forms/`**

### 7. Is it a single purpose utility class?
→ **Add to appropriate file in `utilities/`**

### 8. Is it accessibility-related?
→ **Add to appropriate file in `accessibility/`**

## File Organization Guidelines

### When to Create a New File

Create a new file when:
- Adding a distinctly new component (new pattern, not a variation)
- Introducing a new category that doesn't fit existing files
- A file exceeds ~400 lines and can be logically split
- Grouping related styles improves maintainability

**Don't create new files for:**
- Minor variations of existing components
- Small additions to existing categories
- One-off styles that belong in existing files

### File Naming Conventions

- Use lowercase with hyphens: `checkbox-radio-switch.css`
- Be descriptive but concise: `input-range.css` not `custom-range-input-styling.css`
- Use plural for categories: `controls.css`, `styles.css`
- Match component name: `accordion.css`, `modal.css`

### File Structure Template

```css
/**
 * [File/Component Name]
 * [Brief description of purpose]
 *
 * [Optional: List of key features or classes]
 */

/* ==================================================
   [Section Name]
   ================================================== */

/* [Subsection or specific element] */
selector {
  /* Properties in standard order (see css-property-order.instructions.md) */
}

/* ==================================================
   [Another Section]
   ================================================== */
```

## Selector Patterns

### Prefer Semantic Selectors

**Good:**
```css
button,
[type="submit"],
[role="button"] {
  /* Styles */
}
```

**Avoid excessive class usage:**
```css
/* Too class-heavy - don't do this */
.button,
.button-submit,
.button-reset {
  /* Styles */
}
```

### Use `:is()`, `:where()`, and `:not()` for Grouping

**Good:**
```css
:is(button, [type="submit"], [role="button"]) {
  /* Shared styles */
}

input:not([type="checkbox"], [type="radio"]) {
  /* Text input styles */
}
```

**Avoid long selector lists:**
```css
/* Less maintainable */
button,
[type="submit"],
[type="reset"],
[type="button"],
[role="button"] {
  /* ... */
}
```

### Specificity Management

- Keep specificity low for base styles
- Use classes for modifiers and variations
- Avoid `!important` unless absolutely necessary
- Use logical combinators (`:is()`, `:where()`) to manage specificity

**Specificity hierarchy:**
1. `:where()` (zero)
2. Element selectors
3. Class, attribute and pseudo class selectors, which weigh the same
4. ID selectors (avoid in framework CSS)

### Modifier Patterns

Apply modifiers to the root element:

```css
/* Modifier on component root */
.card.rounded {
  border-radius: var(--i-border-radius-xlarge);
}

/* Children follow the root, so the modifier needs no child rules */
.card > header {
  border-start-start-radius: inherit;
  border-start-end-radius: inherit;
}
```

## Custom Property Patterns

### Naming Convention

**Owner first:** `--i-{owner}[-{part}][-{state}]-{property}`.

```css
--i-navbar-brand-font-size: 1.25rem;
--i-navbar-z-index: 90;
--i-table-row-hover-color-background: ...;
--i-input-invalid-focus-color-outline: ...;
```

- **Owner** is the element, form control, component or layout primitive the variable belongs to: `navbar`, `dropdown`, `table`, `input`, `range`, `grid`. It matches the file the variable lives in (see Variable File Organization). Text inputs, `select` and `textarea` share the `input` owner.
- **Global tokens**, read by many owners, use a category instead: `color`, `font`, `line-height`, `spacing`, `border`, `shadow`, `duration`, `easing`, `focus-ring`, `control` (buttons and inputs), `variant`, `gradient`, `svg`.
- **Property** is the CSS property the variable feeds, in full: `font-size`, `border-radius`, `max-width`, `padding-inline`, `z-index`, `outline-width`. Four short forms are allowed: `size` (width and height), `shadow` (box-shadow), `duration` and `easing`.
- **State** goes after the part and before the property: `hover`, `active`, `focus`, `open`, `selected`, `striped`, `invalid`, `valid`, `disabled`.
- **Sizes** use full words, like the classes: `small`, `medium`, `large`, `xlarge`.
- **Directions** are logical: `block` and `inline`, not `vertical` and `horizontal`.

```css
/* Avoid */
--primary-color: #0066cc;          /* Missing prefix */
--i-z-drawer: 95;                  /* Owner must come first */
--i-drawer-z: 95;                  /* Abbreviated property */
--i-drawer-radius: 0.25rem;        /* Use the full property, border-radius */
--i-spacing-sm: 0.5rem;            /* Use small */
--i-drawer-spacing-vertical: 0;    /* Use padding-block */
```

### Color Variable Naming

Colors use `color-{role}` as the property, always last: `color-text`, `color-background`, `color-border`, `color-outline`. When a color paints a part rather than a property, the part is the role: `color-thumb`, `color-track`, `color-placeholder`.

```css
/* Correct */
--i-navbar-color-background: var(--i-color-background);
--i-dropdown-hover-color-background: #202632;
--i-range-color-thumb: var(--i-color-secondary);

/* Global theme colors and the palette keep the color category first */
--i-color-primary: #0066cc;
--i-color-subtle-border: #e7eaf0;
--i-color-blue-500: #2b7fff;

/* Incorrect */
--i-color-drawer-background: ...;  /* owned color, owner must come first */
--i-navbar-background-color: ...;  /* color at the end */
--i-color-drawer: ...;             /* say which color: --i-drawer-color-text */
```

See `css-style-guide.instructions.md` for complete color naming rules.

### Global vs. Local Variables

**Every `--i-` variable is defined in `variables/` and only read everywhere else.** Files outside `variables/` use `var(--i-...)` but never assign an `--i-` variable.

- Define variables on `:root, :host` in the matching file in `variables/`.
- Theme colors are `light-dark(light, dark)` pairs. Global ones live in `variables/themes/styles.css`, owned ones in their owner's file. The element's `color-scheme` picks the value, so the system preference and `data-theme` (set in `base/themes.css`) switch every color, nested themes included. A color that is the same in both schemes is a single value. `light-dark()` only takes colors, so build other theme values, such as shadows, from a color variable.
- Declare theme colors, and variables derived from them, on `:root, :host, :where([data-theme], .light, .dark)`. An owner file has one `:root, :host` block for its other values and, when it owns colors, a second block on these selectors. The theme root selector is for the build fallback only. `postcss.config.js` keeps the variables on `:root` for browsers with `light-dark()`, so a user's `:root` override reaches nested themes, and moves the theme root copy into `@supports not (color: light-dark(...))` for browsers without it, since their fallback only recomputes a variable where it is declared. It also drops the fallback plugin's copy on every descendant, which would hide `:root` overrides.
- Media query overrides of a variable, such as `prefers-contrast: more`, go in the variable's own file in `variables/`. User preference overrides that must beat a page's own value are the exception, see below.

**Exceptions: per element APIs.** Two sets of variables are meant to be set on elements. Their defaults still live in `variables/`:

- `--i-variant` and `--i-variant-inverse`: set by the color classes (`.primary`, `.danger`, ...) and by the neutral button and link rules.
- `--i-gradient-*`: set by the `.gradient` modifier classes.

**Exception: user preferences.** `accessibility/preferences.css` sets `--i-duration`, `--i-modal-duration`, `--i-toast-duration` and `--i-modal-overlay-backdrop-filter` with `!important` for reduced motion and reduced transparency, so a page's own value cannot bring the motion or the blur back.

**Private variables.** When an element needs to switch a value by state or mode, use a private `--_` variable instead of reassigning a global one:

```css
input {
  --_border: var(--i-input-color-border);
  border: var(--i-border-width) solid var(--_border);
}

input:focus {
  --_border: var(--i-input-active-color-border);
}
```

- Private variables are never defined on `:root` and are not part of the API.
- Modifiers and components that style the same element may set its private variables, for example `.outlined` sets `--_background` on inputs.
- Use the same names for the same role: `--_background`, `--_border`, `--_text`, `--_shadow` for the painted colors, `--_outline` for a form focus ring and `--_focus` for a button or link focus ring.

### Variable File Organization

**Global variables must be maintained in dedicated files organized by element type, form element, component name, or layout type.**

When creating or moving variables to global scope, follow this organization structure:

**For element-specific variables:**
- Create or use files in `variables/elements/`
- File name matches the file in `elements/`: `table.css`, `code.css`
- Variables use element-specific prefix: `--i-button-*`, `--i-table-*`, `--i-link-*`

**For form element-specific variables:**
- Create or use files in `variables/forms/`
- File name matches the file in `forms/`: `input-range.css`, `checkbox-radio-switch.css`. Shared input and control values live in `basics.css`
- Variables use form-specific prefix: `--i-input-*`, `--i-range-*`, `--i-switch-*`

**For component-specific variables:**
- Create or use files in `variables/components/`
- File name matches component: `modal.css`, `box.css`, `card.css`
- Variables use component-specific prefix: `--i-modal-*`, `--i-box-*`, `--i-card-*`

**For layout-specific variables:**
- Create or use files in `variables/layout/`
- File name matches layout concept: `grid.css`, `container.css`, `primitives.css`
- Variables use layout-specific prefix: `--i-grid-*`, `--i-container-*`, `--i-stack-*`

**For utility variables:**
- Create or use files in `variables/utilities/`
- File name matches the file in `utilities/`: `overflow.css`
- Palette and gradient variables are global color tokens and stay in `variables/colors/`

**For base and accessibility variables:**
- Use `variables/base/` and `variables/accessibility/`, with the file name of the rules they feed: `document.css`, `contrast.css`

**For cross-cutting variables:**
- Use existing category files: `typography.css`, `spacing.css`, `borders.css`, `styles.css`, `icons.css`, `themes/styles.css`, `colors/`
- Only use these when variables don't belong to a specific element, form, component, or layout

**Example structure:**
```css
/* variables/elements/table.css */
:root,
:host {
  /* Table-specific variables */
  --i-table-header-border-width: var(--i-border-width);
}

/* variables/components/modal.css */
:root,
:host {
  /* Modal-specific variables */
  --i-modal-overlay-backdrop-filter: blur(0.375rem);
  --i-modal-duration: 0.3s;
}

:root,
:host,
:where([data-theme], .light, .dark) {
  /* Modal-specific theme colors */
  --i-modal-overlay-color-background: light-dark(#e8eaedbf, #08090abf);
}

/* variables/typography.css */
:root,
:host {
  /* Cross-cutting typography variables */
  --i-font-family: var(--i-font-sans);
  --i-line-height: 1.5;
}
```

**Exception:** Only place variables in cross-cutting category files (`typography.css`, `spacing.css`, etc.) when there is no appropriate element, form, component, or layout category. If a variable is specific to an element, component, or layout, it must live in a dedicated file for that element, component, or layout.

**When refactoring:**
- Extract local variables from `elements/`, `forms/`, `components/`, and `layout/` directories
- Move them to corresponding files in `variables/` subdirectories
- Maintain element/component/layout-specific prefixes
- Replace all references to use the new global variables
- Remove fallback values once variables are globally defined

## Class Naming Conventions

### General Pattern

Use lowercase with hyphens:

```css
.box { }
.nav-toggle { }
.sr-only { }
```

### Modifier Classes

Use single-word modifiers when possible:

```css
.rounded { }
.outlined { }
.square { }
.primary { }
.secondary { }
```

### Size Modifiers

Use full size names:

```css
.small { }
.medium { }
.large { }
```

### Color Classes

Name the role, not the hue:

```css
.primary { }
.secondary { }
.success { }
.warning { }
.danger { }
```

### State Classes

Name the state they force:

```css
.hover { }
.active { }
.focus { }
.disabled { }
```

### Utility Classes

Keep utilities minimal and semantic:

```css
.truncate { }
.text-center { }
.sr-only { }
```

## Adding New Features

### Process Checklist

When adding a new component or feature:

1. **Research existing patterns**
   - Check if similar functionality exists
   - Look for existing modifiers that could apply
   - Review related components for consistency

2. **Determine correct location**
   - Use the decision framework above
   - Choose appropriate directory and file
   - Consider creating new file if warranted

3. **Define custom properties as global variables**
   - Identify what should be customizable
   - Use consistent naming patterns
   - Add to appropriate variables file in `variables/` directory (see Variable File Organization)
   - Create dedicated files for element/component-specific variables (e.g., `variables/elements/table.css`)
   - Use cross-cutting category files only when no specific element/component category applies
   - Prefer global variables over component-scoped variables

4. **Write semantic selectors**
   - Prefer element selectors for base styles
   - Use classes for variations
   - Keep specificity manageable

5. **Apply modifiers**
   - Ensure existing modifiers work (`.rounded`, `.outlined`, etc.)
   - Add new modifier support where appropriate
   - Test combinations

6. **Document with comments**
   - Add file header with description
   - Use section comments for organization
   - Document non-obvious patterns

7. **Test thoroughly**
   - Test in light and dark modes
   - Verify accessibility features work
   - Check responsive behavior
   - Test modifier combinations

## Examples

These examples demonstrate proper framework patterns, including the use of global variables.

### Adding a New Component

A hypothetical `.tag` component:

```css
/**
 * Tag
 *
 * A small label for a category: <span class="tag">CSS</span>.
 */

/* ==================================================
   Base tag styles
   ================================================== */

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem 0.5rem;
  border-radius: var(--i-border-radius);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--i-color-text);
  background-color: var(--i-color-subtle-border);
}

/* Modifiers live in modifiers/. To support .rounded, add .tag to the
   rounded rule in modifiers/styles.css, and to modifiers/size.css for sizes. */
```

**Note:** This component uses existing global variables (`--i-border-radius`, `--i-color-text`, `--i-color-subtle-border`). If you need new custom properties, define them globally in the appropriate `variables/` file rather than scoping them to the component.

### Extending an Existing Component

When adding to an existing component file:

```css
/* components/card.css */

/* Existing styles... */

/* ==================================================
   Card actions
   ================================================== */

/* New feature: card actions section */
.card > .actions {
  display: flex;
  gap: calc(var(--i-spacing) * 0.5);
  padding: var(--i-spacing);
  border-top: var(--i-border-width) solid var(--i-color-subtle-border);
}
```

## Maintenance Guidelines

### Code Review Checklist

When reviewing CSS changes:
- [ ] Follows directory structure guidelines
- [ ] Uses appropriate selectors and specificity
- [ ] Follows naming conventions
- [ ] Includes proper documentation comments
- [ ] Works with existing modifiers
- [ ] Maintains accessibility features
- [ ] Follows property order guidelines
- [ ] Defines `--i-` variables only in `variables/`, and never assigns them elsewhere (except the variant and gradient variables)
- [ ] Uses private `--_` variables for state changes inside an element
- [ ] Tested in light/dark modes

## Anti-Patterns to Avoid

### Don't Create Overly Specific Selectors

```css
/* Bad - too specific */
article.card > header.card-header > h2.card-title {
  /* ... */
}

/* Good - use semantic structure */
.card > header > :is(h1, h2, h3, h4, h5, h6) {
  /* ... */
}
```

### Don't Hardcode Values

```css
/* Bad - hardcoded values */
.box {
  padding: 16px;
  border-radius: 4px;
  background: #f5f5f5;
}

/* Good - use design tokens */
.box {
  padding: var(--i-spacing);
  border-radius: var(--i-border-radius);
  background: var(--i-color-subtle-border);
}
```

### Don't Create Single-Use Classes

```css
/* Bad - too specific, single use */
.blue-rounded-button-large {
  /* ... */
}

/* Good - compose with modifiers */
<button class="primary large rounded">
```

### Don't Duplicate Modifier Logic

```css
/* Bad - duplicating modifier logic */
.card.rounded {
  border-radius: var(--i-border-radius-xlarge);
}

.box.rounded {
  border-radius: var(--i-border-radius-xlarge);
}

/* Good - centralize in modifiers/ */
/* modifiers/styles.css */
:is(.card, .box).rounded {
  border-radius: var(--i-border-radius-xlarge);
}
```

### Don't Use Local Variables When Global Ones Would Work

```css
/* Bad - unnecessarily scoped variables */
.card {
  --card-padding: var(--i-spacing);
  --card-background: var(--i-color-subtle-border);
  padding: var(--card-padding);
  background: var(--card-background);
}

.box {
  --box-padding: var(--i-spacing);
  --box-background: var(--i-color-subtle-border);
  padding: var(--box-padding);
  background: var(--box-background);
}

/* Good - global variables in variables/components/box.css */
:root,
:host {
  --i-box-padding: 1.25rem;
}

:root,
:host,
:where([data-theme], .light, .dark) {
  --i-box-color-background: var(--i-color-background);
}

/* components/box.css */
.box {
  padding: var(--i-box-padding);
  background-color: var(--i-box-color-background);
}
```

## Questions to Ask

Before making structural changes:

1. **Does this fit the framework philosophy?** (See `project-identity.instructions.md`)
2. **Is this the right abstraction level?** (Element, component, modifier, or utility?)
3. **Will this work with existing modifiers?**
4. **Is this maintainable and documented?**
5. **Does this increase or decrease complexity?**
6. **Is there a simpler way to achieve this?**
7. **Should this use global variables instead of local scoped variables?**

When in doubt, look for similar patterns in the existing codebase and maintain consistency.
