---
applyTo: "**/*.css"
---

# CSS Property Order

This guide defines the standard order for CSS properties in Iris CSS. Consistent property ordering improves readability and maintainability.

## Property Groups

Group related properties together in this order:

1. **Positioning**
2. **Display & Box Model**
3. **Typography**
4. **Visual**
5. **Animation & Transitions**
6. **Misc**

Within each group, sort properties alphabetically when it does not break shorthand then longhand order or related pairs. Keep related pairs together, for example `border` before `border-color`, and `margin` before `margin-top`.

Custom properties are an exception. Place custom properties at the top of the rule if needed, but keep the existing order and manual grouping within the custom property block. Do not alphabetize custom properties.

Example within a group:

```css
.card {
  border: 0.0625rem solid var(--i-color-subtle-border);
  border-color: var(--i-color-subtle-border);
  border-radius: var(--i-border-radius);
  margin: 1rem;
  margin-top: 2rem;
}
```

## Detailed Order

### 1. Positioning
Properties that affect the element's position in the document flow:
- `position`
- `z-index`
- `top`
- `right`
- `bottom`
- `left`
- `inset`
- `inset-block`
- `inset-inline`

### 2. Display & Box Model
Properties that define the element's display type and box model:
- `display`
- `flex`
- `flex-direction`
- `flex-wrap`
- `flex-flow`
- `justify-content`
- `align-items`
- `align-content`
- `gap`
- `grid`
- `grid-template`
- `grid-template-columns`
- `grid-template-rows`
- `grid-template-areas`
- `grid-auto-columns`
- `grid-auto-rows`
- `grid-auto-flow`
- `overflow`
- `overflow-x`
- `overflow-y`
- `box-sizing`
- `width`
- `min-width`
- `max-width`
- `height`
- `min-height`
- `max-height`
- `inline-size`
- `min-inline-size`
- `max-inline-size`
- `block-size`
- `min-block-size`
- `max-block-size`
- `padding`
- `padding-top`
- `padding-right`
- `padding-bottom`
- `padding-left`
- `padding-block`
- `padding-inline`
- `border`
- `border-width`
- `border-style`
- `border-color`
- `border-top`
- `border-right`
- `border-bottom`
- `border-left`
- `border-radius`
- `margin`
- `margin-top`
- `margin-right`
- `margin-bottom`
- `margin-left`
- `margin-block`
- `margin-inline`

### 3. Typography
Properties that affect text styling:
- `font`
- `font-family`
- `font-size`
- `font-weight`
- `font-style`
- `font-variant`
- `line-height`
- `letter-spacing`
- `word-spacing`
- `color`
- `text-align`
- `text-decoration`
- `text-transform`
- `text-indent`
- `text-overflow`
- `white-space`
- `vertical-align`

### 4. Visual
Properties that affect visual appearance:
- `background`
- `background-color`
- `background-image`
- `background-position`
- `background-size`
- `background-repeat`
- `background-attachment`
- `box-shadow`
- `opacity`
- `filter`
- `backdrop-filter`
- `visibility`
- `outline`
- `outline-width`
- `outline-style`
- `outline-color`
- `outline-offset`

### 5. Animation & Transitions
Properties for motion and state changes:
- `transition`
- `transition-property`
- `transition-duration`
- `transition-timing-function`
- `transition-delay`
- `animation`
- `animation-name`
- `animation-duration`
- `animation-timing-function`
- `animation-delay`
- `animation-iteration-count`
- `animation-direction`
- `animation-fill-mode`
- `animation-play-state`
- `transform`
- `transform-origin`

### 6. Misc
Other properties that don't fit the above categories:
- `cursor`
- `pointer-events`
- `user-select`
- `resize`
- `appearance`
- `content`
- `quotes`
- `counter-reset`
- `counter-increment`

## Example

```css
.example {
  /* Positioning */
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;

  /* Display & Box Model */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  padding: 1rem;
  border: 0.0625rem solid var(--i-color-primary);
  border-radius: var(--i-border-radius);
  margin: 1rem;

  /* Typography */
  font-family: sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--i-color-text);
  text-align: center;

  /* Visual */
  background: var(--i-color-background);
  box-shadow: var(--i-shadow);
  opacity: 1;

  /* Animation */
  transition: background-color 0.2s ease-in-out;
}
```

## Special Cases

### CSS Variables (Custom Properties)
Define CSS custom properties at the top of the declaration block, before any standard properties:

```css
.element {
  /* Custom properties first */
  --local-spacing: 1rem;
  --local-color: #333;

  /* Then standard properties in order */
  display: block;
  padding: var(--local-spacing);
  color: var(--local-color);
}
```

### Media and Container Queries
Inside media and container queries, keep the same property order:

```css
.responsive {
  display: flex;
  padding: 1rem;
}

@media (min-width: 768px) {
  .responsive {
    display: grid;
    padding: 2rem;
  }
}
```

## Tools

Stylelint with `stylelint-order` enforces this order. The config is `stylelint.config.mjs`, and it places properties this guide does not list in the group they belong to. Run it before committing:

```shell
npm run lint      # report
npm run lint:fix  # reorder in place
```

When you add a property the config does not know, add it to the right group there instead of letting it fall to the bottom.
