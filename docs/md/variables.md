---
title: CSS variables
description: Every custom property Iris CSS defines, with its light and dark values.
---

# CSS variables

Iris CSS is built on CSS custom properties. Every value the framework uses, from spacing to button colors, comes from a variable you can override.

All variables start with `--i-`. Classes have no prefix, but custom properties are global and inherited, so the prefix keeps Iris from clashing with your own variables or with other libraries such as Tailwind.

This page lists all of them. It is generated from the source in `src`, so the values below are the real defaults.

## How to override

Set a variable on `:root` to change it everywhere:

```css
:root {
  --i-color-primary: #7c3aed;
  --i-border-radius: 0.5rem;
}
```

A theme color set on `:root` also reaches nested themes (`data-theme`, `.light`, `.dark`). Browsers without `light-dark()` (Chrome before 123, Firefox before 120, Safari before 17.5) recompute theme colors on each nested theme, so there a `:root` override stops at them. To cover those browsers too, set it on `:root, [data-theme], .light, .dark`.

Set it on any element to change it only inside that element:

```html
<section style="--i-spacing: 2rem">...</section>
```

Iris puts every rule in a cascade layer (`iris.variables`, `iris.base`, `iris.elements`, `iris.forms`, `iris.components`, `iris.layout`, `iris.modifiers`, `iris.utilities`, `iris.accessibility`, `iris.print`). Your own unlayered CSS always wins over Iris, whatever its specificity. To put your styles between Iris layers, use `@layer iris, app;` and write them in `@layer app`.

Colors are derived with `color-mix()` where they are used. Changing `--i-color-primary` updates every primary button, link, hover state, border and focus ring.

## Light and dark themes

Every theme color is one `light-dark()` pair, for example `--i-color-text: light-dark(#373c44, #c2c7d0)`. The browser picks the value from the element's `color-scheme`:

- Without `data-theme`, the page follows the system setting.
- `data-theme="light"` or `data-theme="dark"`, or the `.light` and `.dark` classes, force a scheme on an element and everything inside it, so a nested `<section data-theme="dark">` works with no extra CSS.

To change a color, override it with your own pair:

```css
:root {
  --i-color-primary: light-dark(#7c3aed, #a78bfa);
}
```

A single color, without `light-dark()`, is used in both schemes. The build adds a fallback for browsers without `light-dark()`, so `dist` works back to Chrome 111 and Safari 16.2. The fallback only covers the variables Iris declares; a `light-dark()` you write in your own CSS needs a recent browser. In the tables below, the **Dark** column shows the dark value, and **same** means one value serves both.

## Contents

- [Global tokens](#global-tokens)
- [Theme colors](#theme-colors)
- [Base](#base)
- [Elements](#elements)
- [Forms](#forms)
- [Components](#components)
- [Layout](#layout)
- [Utilities](#utilities)
- [Gradients](#gradients)
- [Icons](#icons)
- [Color palette](#color-palette)
- [Variables set per element](#variables-set-per-element)
- [Notes for maintainers](#notes-for-maintainers)

## Global tokens

Values read across the whole framework.

### Typography

`--i-font-size` is the root font size. It starts at the size the user set in the browser and grows smoothly to 112.5% between a 576px and a 1280px wide viewport. Source: `variables/typography.css`.

| Variable | Value |
|---|---|
| `--i-font-emoji` | `"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "T…` |
| `--i-font-sans` | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Ro…` |
| `--i-font-mono` | `ui-monospace, "Cascadia Mono", SFMono-Regular, Menlo, Consol…` |
| `--i-font-family` | `var(--i-font-sans)` |
| `--i-line-height` | `1.5` |
| `--i-font-weight` | `400` |
| `--i-font-size` | `clamp(100%, 89.75% + 0.285svw, 112.5%)` |
| `--i-text-underline-offset` | `0.125em` |

### Spacing

`--i-spacing` is the base unit, and most other spacing values are derived from it. `block` is top and bottom, `inline` is left and right. Source: `variables/spacing.css`.

| Variable | Value |
|---|---|
| `--i-spacing` | `1rem` |
| `--i-typography-spacing` | `1rem` |
| `--i-section-spacing-block` | `var(--i-spacing)` |
| `--i-section-spacing-inline` | `var(--i-spacing)` |

### Borders and radius

`--i-focus-ring-width` sizes focus outlines and the focus rings drawn with `box-shadow`. Source: `variables/borders.css`.

| Variable | Value |
|---|---|
| `--i-border-radius-small` | `0.125rem` |
| `--i-border-radius` | `0.25rem` |
| `--i-border-radius-medium` | `0.375rem` |
| `--i-border-radius-large` | `0.5rem` |
| `--i-border-radius-xlarge` | `0.75rem` |
| `--i-border-radius-pill` | `9999px` |
| `--i-border-width` | `0.0625rem` |
| `--i-focus-ring-width` | `0.125rem` |

### Motion

Every Iris transition uses `var(--i-duration) var(--i-easing)`. Set `--i-duration: 0s` to turn transitions off. Source: `variables/styles.css`.

| Variable | Value |
|---|---|
| `--i-duration` | `0.2s` |
| `--i-easing` | `ease-in-out` |

### High contrast

Applied when the user asks for more contrast (`prefers-contrast: more`): they replace `--i-border-width` and `--i-focus-ring-width`. Source: `variables/accessibility/contrast.css`.

| Variable | Value |
|---|---|
| `--i-contrast-border-width` | `0.125rem` |
| `--i-contrast-focus-ring-width` | `0.1875rem` |

## Theme colors

Global colors, read by many elements and components. Colors owned by one element or component are listed with it below.

### Page colors

Source: `variables/themes/styles.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-color-text` | `#373c44` | `#c2c7d0` |
| `--i-color-background` | `var(--i-color-white)` | `#13171f` |
| `--i-color-light` | `var(--i-color-white)` | same |
| `--i-color-dark` | `var(--i-color-black)` | same |
| `--i-color-brand` | `#b31fc6` | `#e12afb` |
| `--i-color-brand-dark` | `#a800b7` | same |
| `--i-color-brand-light` | `#f4a8ff` | same |
| `--i-color-brand-name` | `var(--i-color-brand-dark)` | `#e47ef0` |
| `--i-color-brand-accent` | `#b31fc6` | `var(--i-color-brand-light)` |
| `--i-color-subtle` | `#646b79` | `#848d9e` |
| `--i-color-subtle-border` | `#e7eaf0` | `#202632` |
| `--i-color-shadow` | `#8191b5` | `#07090c` |
| `--i-shadow` | layered shadow in `--i-color-shadow` (7 layers) | same |

### Mix targets

Hover colors, borders and colored text are mixed from a color and one of these two targets with `color-mix()`. Ink is the strongest text tone of the theme and paper is the page background, so the same rule darkens in light mode and lightens in dark mode. Source: `variables/themes/styles.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-color-ink` | `var(--i-color-black)` | `var(--i-color-white)` |
| `--i-color-paper` | `var(--i-color-white)` | `#13171f` |

### Color families

Each color class, such as `.primary` or `.danger`, uses one family. A family is only two variables: the color and the text color used on top of it. Everything else (hover, border, focus ring, tints for `.tint` and `.deep`) is computed from these two where it is used. `--i-color-base` is the neutral color of buttons and links without a color class, and `--i-color-focus` is the default focus ring. Source: `variables/themes/styles.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-color-base` | `#8e9fbc` | `#c2c7d0` |
| `--i-color-focus` | `color-mix(in oklab, var(--i-color-base), var(--i-color-ink) 40%)` | same |
| `--i-color-primary` | `#00d5be` | `#05cc47` |
| `--i-color-primary-inverse` | `var(--i-color-slate-900)` | same |
| `--i-color-secondary` | `#5d6b89` | `#525f7a` |
| `--i-color-secondary-inverse` | `var(--i-color-white)` | same |
| `--i-color-contrast` | `#1c2840` | `#eff1f4` |
| `--i-color-contrast-inverse` | `var(--i-color-white)` | `var(--i-color-black)` |
| `--i-color-accent` | `#ffb900` | same |
| `--i-color-accent-inverse` | `var(--i-color-slate-900)` | same |
| `--i-color-info` | `var(--i-color-cyan)` | same |
| `--i-color-info-inverse` | `var(--i-color-slate-900)` | same |
| `--i-color-success` | `var(--i-color-green)` | same |
| `--i-color-success-inverse` | `var(--i-color-slate-900)` | same |
| `--i-color-warning` | `var(--i-color-yellow)` | same |
| `--i-color-warning-inverse` | `var(--i-color-slate-900)` | same |
| `--i-color-danger` | `var(--i-color-red-600)` | same |
| `--i-color-danger-inverse` | `var(--i-color-white)` | same |
| `--i-color-link` | `var(--i-color-blue-600)` | same |
| `--i-color-link-inverse` | `var(--i-color-white)` | same |

## Base

### Document

Source: `variables/base/document.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-selection-color-background` | `#05cc4740` | `#05cc4730` |
| `--i-scrollbar-color-thumb` | `color-mix(in oklab, var(--i-color-subtle) 50%, transparent)` | same |
| `--i-scrollbar-color-track` | `transparent` | same |

## Elements

### Typography

Headings, small text, `mark`, `ins`, `del` and `blockquote`. Source: `variables/elements/typography.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-small-font-size` | `0.875em` | same |
| `--i-heading-font-weight` | `700` | same |
| `--i-h1-font-size` | `2rem` | same |
| `--i-h1-line-height` | `1.125` | same |
| `--i-h1-margin-top` | `3rem` | same |
| `--i-h2-font-size` | `1.7rem` | same |
| `--i-h2-line-height` | `1.15` | same |
| `--i-h2-margin-top` | `2.625rem` | same |
| `--i-h3-font-size` | `1.5rem` | same |
| `--i-h3-line-height` | `1.175` | same |
| `--i-h3-margin-top` | `2.25rem` | same |
| `--i-h4-font-size` | `1.3rem` | same |
| `--i-h4-line-height` | `1.2` | same |
| `--i-h4-margin-top` | `1.875rem` | same |
| `--i-h5-font-size` | `1.2rem` | same |
| `--i-h5-line-height` | `1.225` | same |
| `--i-h5-margin-top` | `1.6875rem` | same |
| `--i-h6-font-size` | `1.1rem` | same |
| `--i-h6-line-height` | `1.25` | same |
| `--i-h6-margin-top` | `1.5rem` | same |
| `--i-h1-color-text` | `#2d3138` | `#f0f1f3` |
| `--i-h2-color-text` | `#373c44` | `#e0e3e7` |
| `--i-h3-color-text` | `#424751` | `#c2c7d0` |
| `--i-h4-color-text` | `#4d535e` | `#b3b9c5` |
| `--i-h5-color-text` | `#5c6370` | `#a4acba` |
| `--i-h6-color-text` | `#646b79` | `#8891a4` |
| `--i-mark-color-text` | `#0f1114` | `var(--i-color-white)` |
| `--i-mark-color-background` | `#feeaca` | `#014063` |
| `--i-ins-color-text` | `#1d6a54` | `#62af9a` |
| `--i-del-color-text` | `#883835` | `#cd7e7b` |
| `--i-blockquote-color-border` | `var(--i-color-subtle-border)` | same |
| `--i-blockquote-footer-color-text` | `var(--i-color-subtle)` | same |

### List

Source: `variables/elements/list.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-list-marker-color-text` | `var(--i-color-subtle)` | same |

### Link

Source: `variables/elements/link.css`.

| Variable | Value |
|---|---|
| `--i-link-text-decoration` | `underline` |

### Button

Source: `variables/elements/button.css`.

| Variable | Value |
|---|---|
| `--i-button-shadow` | `0 0 0 #0000` |
| `--i-button-hover-shadow` | `0 0 0 #0000` |

### Table

Source: `variables/elements/table.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-table-header-border-width` | `var(--i-border-width)` | same |
| `--i-table-header-font-weight` | `600` | same |
| `--i-table-color-border` | `var(--i-color-subtle-border)` | same |
| `--i-table-header-color-background` | `var(--i-color-background)` | same |
| `--i-table-row-striped-color-background` | `#6f78870a` | same |
| `--i-table-row-hover-color-background` | `color-mix(in oklab, var(--i-color-text) 8%, transparent)` | same |

### Video captions

Source: `variables/elements/media.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-cue-color-text` | `var(--i-color-white)` | same |
| `--i-cue-color-background` | `#000c` | same |

### Code and kbd

Source: `variables/elements/code.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-code-font-family` | `var(--i-font-mono)` | same |
| `--i-code-font-size` | `0.85em` | same |
| `--i-code-padding-block` | `0.125rem` | same |
| `--i-code-padding-inline` | `0.35rem` | same |
| `--i-kbd-font-weight` | `bolder` | same |
| `--i-code-color-text` | `var(--i-color-slate-200)` | `#8891a4` |
| `--i-code-color-background` | `var(--i-color-slate-700)` | `#1a1f28` |
| `--i-kbd-color-text` | `var(--i-code-color-text)` | `var(--i-color-background)` |
| `--i-kbd-color-background` | `var(--i-code-color-background)` | `var(--i-color-text)` |
| `--i-code-light-color-text` | `var(--i-color-slate-700)` | same |
| `--i-code-light-color-background` | `var(--i-color-slate-200)` | same |

### Meter

Source: `variables/elements/meter.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-meter-color-optimum` | `var(--i-color-success)` | same |
| `--i-meter-color-suboptimum` | `var(--i-color-warning)` | same |
| `--i-meter-color-poor` | `var(--i-color-danger)` | same |

### Progress

Source: `variables/elements/progress.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-progress-duration` | `1s` | same |
| `--i-progress-color-background` | `#dfe3eb` | `#202632` |
| `--i-progress-color-bar` | `var(--i-color-primary)` | same |

### Popover

Source: `variables/elements/popover.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-popover-max-width` | `20rem` | same |
| `--i-popover-offset` | `calc(var(--i-spacing) * 0.25)` | same |
| `--i-popover-duration` | `var(--i-duration)` | same |
| `--i-popover-color-background` | `var(--i-dropdown-color-background)` | same |
| `--i-popover-color-border` | `var(--i-dropdown-color-border)` | same |
| `--i-popover-shadow` | `var(--i-dropdown-shadow)` | same |
| `--i-popover-color-text` | `var(--i-dropdown-color-text)` | same |

## Forms

### Controls and inputs

`--i-control-*` applies to buttons and inputs. `--i-input-*` applies to text inputs, `select` and `textarea`, including their `:valid` and `:invalid` states. Source: `variables/forms/basics.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-control-padding-block` | `0.4rem` | same |
| `--i-control-padding-inline` | `0.875rem` | same |
| `--i-control-disabled-opacity` | `0.5` | same |
| `--i-label-font-weight` | `var(--i-font-weight)` | same |
| `--i-input-outline-width` | `var(--i-focus-ring-width)` | same |
| `--i-textarea-min-height` | `4lh` | same |
| `--i-textarea-max-height` | `16lh` | same |
| `--i-input-color-text` | `#23262c` | `#e0e3e7` |
| `--i-input-color-background` | `#fbfcfd` | `#1c212c` |
| `--i-input-color-border` | `#878fa2` | `#636c84` |
| `--i-input-color-placeholder` | `var(--i-color-subtle)` | `#8891a4` |
| `--i-input-selected-color-background` | `#dfe3eb` | `#2a3140` |
| `--i-input-active-color-background` | `var(--i-color-white)` | `#1a1f28` |
| `--i-input-active-color-border` | `color-mix(in oklab, var(--i-color-primary), var(--i-color-in…` | same |
| `--i-input-focus-color-outline` | `color-mix(in oklab, var(--i-color-primary), var(--i-color-in…` | same |
| `--i-input-button-focus-color-outline` | `var(--i-input-focus-color-outline)` | same |
| `--i-input-invalid-color-border` | `var(--i-color-danger)` | same |
| `--i-input-invalid-active-color-border` | `color-mix(in oklab, var(--i-color-danger), var(--i-color-ink…` | same |
| `--i-input-invalid-focus-color-outline` | `var(--i-input-invalid-active-color-border)` | same |
| `--i-input-valid-color-border` | `color-mix(in oklab, var(--i-color-success), var(--i-color-in…` | same |
| `--i-input-valid-active-color-border` | `color-mix(in oklab, var(--i-color-success), var(--i-color-in…` | same |
| `--i-input-valid-focus-color-outline` | `var(--i-input-valid-active-color-border)` | same |

### Checkbox, radio and switch

Source: `variables/forms/checkbox-radio-switch.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-checkbox-radio-border-width` | `0.125rem` | same |
| `--i-switch-border-width` | `0.1875rem` | same |
| `--i-switch-thumb-shadow` | `0 0 0 #0000` | same |
| `--i-switch-color-background` | `#8790a3` | `#5f6880` |
| `--i-switch-color-thumb` | `var(--i-color-white)` | same |

### Range

Source: `variables/forms/input-range.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-range-color-track` | `#8790a3` | `#5f6880` |
| `--i-range-active-color-track` | `#6f788c` | `#7b849a` |
| `--i-range-color-thumb` | `var(--i-color-secondary)` | same |
| `--i-range-thumb-color-border` | `var(--i-color-background)` | same |

### Search inputs

Source: `variables/forms/input-search.css`.

| Variable | Value |
|---|---|
| `--i-input-search-border-radius` | `var(--i-border-radius-pill)` |

### Date inputs

Source: `variables/forms/input-date.css`.

| Variable | Value |
|---|---|
| `--i-input-date-icon-size` | `1rem` |

## Components

### Accordion

Source: `variables/components/accordion.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-accordion-summary-color-text` | `var(--i-color-text)` | same |
| `--i-accordion-summary-hover-color-text` | `color-mix(in oklab, var(--i-color-primary), var(--i-color-in…` | same |

### Alert

Source: `variables/components/alert.css`.

| Variable | Value |
|---|---|
| `--i-alert-padding-block` | `calc(var(--i-spacing) * 0.75)` |
| `--i-alert-padding-inline` | `var(--i-spacing)` |
| `--i-alert-accent-width` | `0.25rem` |

### Avatar

Source: `variables/components/avatar.css`.

| Variable | Value |
|---|---|
| `--i-avatar-size` | `2.5rem` |
| `--i-avatar-size-small` | `2rem` |
| `--i-avatar-size-medium` | `3rem` |
| `--i-avatar-size-large` | `4rem` |
| `--i-avatar-group-overlap` | `0.2` |

### Badge

Source: `variables/components/badge.css`.

| Variable | Value |
|---|---|
| `--i-badge-font-size` | `0.75em` |
| `--i-badge-padding-block` | `0.125em` |
| `--i-badge-trimmed-padding-block` | `0.4em` |
| `--i-badge-padding-inline` | `0.5em` |

### Box

The `.box` component: a padded block with a background, radius and shadow. `.rounded`, `.square` and `.outlined` work on it. The hover and active shadows apply when the box is a link. Source: `variables/components/box.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-box-color-text` | `var(--i-color-text)` | same |
| `--i-box-color-background` | `var(--i-color-background)` | same |
| `--i-box-color-border` | `var(--i-color-subtle-border)` | same |
| `--i-box-padding` | `1.25rem` | same |
| `--i-box-border-radius` | `var(--i-border-radius)` | same |
| `--i-box-shadow` | `var(--i-shadow)` | same |
| `--i-box-hover-shadow` | `0 0.5em 1em -0.125em color-mix(in oklab, var(--i-color-text)…` | same |
| `--i-box-active-shadow` | `inset 0 0.0625rem 0.125rem color-mix(in oklab, var(--i-color…` | same |

### Card

The header and footer padding is the card padding times `--i-card-section-padding-scale`, so it follows the `.small`, `.medium` and `.large` sizes. Source: `variables/components/card.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-card-section-padding-scale` | `0.66` | same |
| `--i-card-color-background` | `var(--i-color-background)` | `#181c25` |
| `--i-card-color-border` | `var(--i-color-subtle-border)` | `var(--i-card-color-background)` |
| `--i-card-section-color-background` | `#fbfcfd` | `#1a1f28` |
| `--i-card-shadow` | `var(--i-shadow)` | same |

### Carousel

Source: `variables/components/carousel.css`.

| Variable | Value |
|---|---|
| `--i-carousel-item-width` | `100%` |
| `--i-carousel-gap` | `var(--i-spacing)` |
| `--i-carousel-button-size` | `2.5rem` |
| `--i-carousel-marker-size` | `0.625rem` |

### Drawer

Source: `variables/components/drawer.css`.

| Variable | Value |
|---|---|
| `--i-drawer-width` | `20rem` |
| `--i-drawer-max-height` | `80dvh` |

### Dropdown

Source: `variables/components/dropdown.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-dropdown-offset` | `0.0625rem` | same |
| `--i-dropdown-color-text` | `var(--i-color-text)` | same |
| `--i-dropdown-color-background` | `var(--i-color-white)` | `#181c25` |
| `--i-dropdown-color-border` | `#eff1f4` | `#202632` |
| `--i-dropdown-hover-color-background` | `#eff1f4` | `#202632` |
| `--i-dropdown-shadow` | `var(--i-shadow)` | same |

### Footer

`--i-footer-column-min-width` is how narrow a link column gets before the columns wrap to a new row. Source: `variables/components/footer.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-footer-padding-block` | `2.5rem` | same |
| `--i-footer-font-size` | `0.9375rem` | same |
| `--i-footer-gap` | `2rem` | same |
| `--i-footer-column-min-width` | `8rem` | same |
| `--i-footer-heading-font-size` | `0.8125rem` | same |
| `--i-footer-brand-font-size` | `1.25rem` | same |
| `--i-footer-brand-image-height` | `1.75rem` | same |
| `--i-footer-color-text` | `var(--i-color-subtle)` | same |
| `--i-footer-color-background` | `color-mix(in oklab, var(--i-color-subtle) 7%, var(--i-color-…` | same |
| `--i-footer-color-border` | `var(--i-color-subtle-border)` | same |

### Group

Source: `variables/components/group.css`.

| Variable | Value |
|---|---|
| `--i-group-button-padding-inline` | `2rem` |
| `--i-group-search-border-radius` | `var(--i-border-radius-pill)` |

### Icon

Source: `variables/components/icon.css`.

| Variable | Value |
|---|---|
| `--i-icon-size` | `1.5rem` |
| `--i-icon-size-small` | `1rem` |
| `--i-icon-size-medium` | `2rem` |
| `--i-icon-size-large` | `3rem` |
| `--i-icon-color-text` | `currentcolor` |
| `--i-icon-text-gap` | `0.25em` |

### Loader

Source: `variables/components/loader.css`.

| Variable | Value |
|---|---|
| `--i-loader-duration` | `1.2s` |

### Modal

Source: `variables/components/modal.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-modal-max-width` | `43.75rem` | same |
| `--i-modal-overlay-backdrop-filter` | `blur(0.375rem)` | same |
| `--i-modal-duration` | `0.3s` | same |
| `--i-modal-overlay-color-background` | `#e8eaedbf` | `#08090abf` |

### Nav

Source: `variables/components/nav.css`.

| Variable | Value |
|---|---|
| `--i-nav-item-padding-block` | `1rem` |
| `--i-nav-gap` | `1rem` |
| `--i-nav-link-padding-block` | `0.5rem` |
| `--i-nav-link-padding-inline` | `0.5rem` |
| `--i-nav-breadcrumb-divider` | `">"` |

### Navbar

`--i-navbar-height` is the bar's minimum height. Browsers without anchor positioning also open the mobile menu panel at this distance from the top. Source: `variables/components/navbar.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-navbar-height` | `4rem` | same |
| `--i-navbar-brand-font-size` | `1.25rem` | same |
| `--i-navbar-brand-image-height` | `2rem` | same |
| `--i-navbar-z-index` | `90` | same |
| `--i-navbar-color-background` | `var(--i-color-background)` | same |
| `--i-navbar-color-border` | `var(--i-color-subtle-border)` | same |

### Skeleton

Source: `variables/components/skeleton.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-skeleton-duration` | `1.5s` | same |
| `--i-skeleton-color-background` | `color-mix(in oklab, var(--i-color-text) 10%, var(--i-color-b…` | same |
| `--i-skeleton-color-highlight` | `color-mix(in oklab, var(--i-color-text) 4%, var(--i-color-ba…` | same |

### Skip to content

Source: `variables/components/skip-to-content.css`.

| Variable | Value |
|---|---|
| `--i-skip-to-content-z-index` | `9999` |

### Steps

Source: `variables/components/steps.css`.

| Variable | Value |
|---|---|
| `--i-steps-marker-size` | `2rem` |
| `--i-steps-line-width` | `0.125rem` |

### Tabs

Source: `variables/components/tabs.css`.

| Variable | Value |
|---|---|
| `--i-tabs-indicator-width` | `0.125rem` |

### Toast

Source: `variables/components/toast.css`.

| Variable | Value |
|---|---|
| `--i-toast-max-width` | `24rem` |
| `--i-toast-offset` | `var(--i-spacing)` |
| `--i-toast-gap` | `calc(var(--i-spacing) * 0.5)` |
| `--i-toast-padding-block` | `calc(var(--i-spacing) * 0.75)` |
| `--i-toast-padding-inline` | `var(--i-spacing)` |
| `--i-toast-duration` | `0.3s` |
| `--i-toast-z-index` | `1000` |

### Tooltip

Source: `variables/components/tooltip.css`.

| Variable | Light | Dark |
|---|---|---|
| `--i-tooltip-max-width` | `20rem` | same |
| `--i-tooltip-caret-size` | `0.3rem` | same |
| `--i-tooltip-z-index` | `99` | same |
| `--i-tooltip-color-text` | `var(--i-color-contrast-inverse)` | same |
| `--i-tooltip-color-background` | `var(--i-color-contrast)` | same |

## Layout

### Container

`.container` is as wide as `--i-container-max-width`, which steps up at each breakpoint: 100% on phones, then 576px, 700px, 950px, 1200px and 1450px from viewports 640px, 768px, 1024px, 1280px and 1536px wide. The side padding drops to 0 from 640px. Source: `variables/layout/container.css`.

| Variable | Value |
|---|---|
| `--i-container-max-width` | `100%` |
| `--i-container-padding-inline` | `var(--i-spacing)` |

### Grid

`.grid` columns are at least `--i-grid-column-min-width` wide and wrap onto new rows below that. Source: `variables/layout/grid.css`.

| Variable | Value |
|---|---|
| `--i-grid-column-gap` | `var(--i-spacing)` |
| `--i-grid-row-gap` | `var(--i-spacing)` |
| `--i-grid-column-min-width` | `10rem` |

### Layout primitives

Source: `variables/layout/primitives.css`.

| Variable | Value |
|---|---|
| `--i-stack-gap` | `var(--i-spacing)` |
| `--i-cluster-gap` | `calc(var(--i-spacing) * 0.5)` |
| `--i-sidebar-gap` | `var(--i-spacing)` |
| `--i-sidebar-width` | `16rem` |
| `--i-sidebar-content-min-width` | `50%` |
| `--i-switcher-gap` | `var(--i-spacing)` |
| `--i-switcher-threshold` | `40rem` |

### Hero

Source: `variables/layout/hero.css`.

| Variable | Value |
|---|---|
| `--i-hero-min-height` | `min(60svh, 32rem)` |
| `--i-hero-padding-block` | `calc(var(--i-spacing) * 4)` |
| `--i-hero-font-size` | `clamp(2.25rem, 1.5rem + 3svw, 3.5rem)` |
| `--i-hero-text-font-size` | `1.25rem` |
| `--i-hero-text-max-width` | `40rem` |

## Utilities

### Overflow

Source: `variables/utilities/overflow.css`.

| Variable | Value |
|---|---|
| `--i-line-clamp-lines` | `3` |

## Gradients

Defaults for the `.gradient` classes. Source: `variables/colors/gradients.css`. The gradient classes set these on their element, and you can set them inline:

```html
<div class="gradient" style="--i-gradient-stops: #ff0000, #0000ff">...</div>
```

| Variable | Default | Set by |
|---|---|---|
| `--i-gradient-stops` | `var(--i-color-gray-200), var(--i-color-gray-500), var(--i-co…` | `.gradient` color classes, such as `.blue` |
| `--i-gradient-direction` | `to right` | `.to-top`, `.to-bottom`, `.to-left` |
| `--i-gradient-shape` | `circle` | `.ellipse` |
| `--i-gradient-position` | `center` | `.radial-top`, `.radial-right`, `.radial-bottom`, `.radial-left` |

## Icons

Icons are SVG data URIs from [System UIcons](https://github.com/coreyginnivan/system-uicons) (public domain), with a heavier stroke. Source: `variables/icons.css`. Each one has its color baked into the SVG, so it looks the same in light and dark mode. To replace one, set the variable to your own `url("data:image/svg+xml,...")`. Inputs cannot draw a masked icon, so the valid and invalid icons do not follow `--i-color-success` and `--i-color-danger`. Replace them when you change those colors.

| Variable | Icon | Color |
|---|---|---|
| `--i-svg-checkmark` | Check mark, used in checked checkboxes | `#fff` |
| `--i-svg-chevron-down` | Down arrow, used in selects, dropdowns and accordions | `#8891a4` |
| `--i-svg-close` | Close cross, used in modals | `#8891a4` |
| `--i-svg-dash` | Dash, used in indeterminate checkboxes | `#fff` |
| `--i-svg-date` | Calendar, used in date inputs | `#8891a4` |
| `--i-svg-invalid` | Exclamation mark, shown on invalid inputs | `#e7000b`, the red 600 shade behind `--i-color-danger` |
| `--i-svg-loading` | Spinner, used with `aria-busy="true"` and rotated with CSS | `#8891a4` |
| `--i-svg-menu` | Three lines, used in `.nav-toggle` | `#8891a4` |
| `--i-svg-search` | Magnifier, used in search inputs | `#8891a4` |
| `--i-svg-time` | Clock, used in time inputs | `#8891a4` |
| `--i-svg-valid` | Check mark, shown on valid inputs | `#00a63e`, the green 600 shade near `--i-color-success` |

## Color palette

Source: `variables/colors/palette.css`. 26 color families with 11 shades each, from `50` (lightest) to `950` (darkest). The palette does not change between light and dark mode.

Each shade is a variable named `--i-color-{family}-{shade}`, for example `--i-color-emerald-500`. Each family also has a base variable, `--i-color-{family}`.

| Family | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | Base |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| amber | `#fffbeb` | `#fef3c6` | `#fee685` | `#ffd230` | `#ffb900` | `#fe9a00` | `#e17100` | `#bb4d00` | `#973c00` | `#7b3306` | `#461901` | `#fe9a00` |
| blue | `#eff6ff` | `#dbeafe` | `#bedbff` | `#8ec5ff` | `#51a2ff` | `#2b7fff` | `#155dfc` | `#1447e6` | `#193cb8` | `#1c398e` | `#162456` | `#2b7fff` |
| chartreuse | `#fbfde8` | `#f5fbc6` | `#ecf58f` | `#ddea39` | `#ccd700` | `#b6c000` | `#979600` | `#786e00` | `#635700` | `#54490c` | `#2e2704` | `#b6c000` |
| cyan | `#ecfeff` | `#cefafe` | `#a2f4fd` | `#53eafd` | `#00d3f2` | `#00b8db` | `#0092b8` | `#007595` | `#005f78` | `#104e64` | `#053345` | `#00b8db` |
| emerald | `#ecfdf5` | `#d0fae5` | `#a4f4cf` | `#5ee9b5` | `#00d492` | `#00bc7d` | `#009966` | `#007a55` | `#006045` | `#004f3b` | `#002c22` | `#00bc7d` |
| fuchsia | `#fdf4ff` | `#fae8ff` | `#f6cfff` | `#f4a8ff` | `#ed6aff` | `#e12afb` | `#c800de` | `#a800b7` | `#8a0194` | `#721378` | `#4b004f` | `#e12afb` |
| gray | `#f9fafb` | `#f2f4f7` | `#e4e6ed` | `#d0d4de` | `#97a0b2` | `#687185` | `#485468` | `#344056` | `#1d283b` | `#0f172a` | `#030713` | `#687185` |
| green | `#f0fdf4` | `#dcfce7` | `#b9f8cf` | `#7bf1a8` | `#05df72` | `#00c950` | `#00a63e` | `#008236` | `#016630` | `#0d542b` | `#032e15` | `#00c950` |
| indigo | `#eef2ff` | `#e0e7ff` | `#c6d2ff` | `#a3b3ff` | `#7c86ff` | `#615fff` | `#4f39f6` | `#432dd7` | `#372aac` | `#312c85` | `#1e1a4d` | `#615fff` |
| jade | `#eefdf5` | `#d6fbe6` | `#aff6cf` | `#6dedaf` | `#03da82` | `#00c367` | `#00a052` | `#007e46` | `#01633b` | `#075233` | `#022d1c` | `#00c367` |
| lime | `#f7fee7` | `#ecfcca` | `#d8f999` | `#bbf451` | `#9ae600` | `#7ccf00` | `#5ea500` | `#497d00` | `#3c6300` | `#35530e` | `#192e03` | `#7ccf00` |
| neutral | `#fafafa` | `#f5f5f5` | `#e5e5e5` | `#d4d4d4` | `#a1a1a1` | `#737373` | `#525252` | `#404040` | `#262626` | `#171717` | `#0a0a0a` | `#737373` |
| orange | `#fff7ed` | `#ffedd4` | `#ffd6a7` | `#ffb86a` | `#ff8904` | `#ff6900` | `#f54900` | `#ca3500` | `#9f2d00` | `#7e2a0c` | `#441306` | `#ff6900` |
| pink | `#fdf2f8` | `#fce7f3` | `#fccee8` | `#fda5d5` | `#fb64b6` | `#f6339a` | `#e60076` | `#c6005c` | `#a3004c` | `#861043` | `#510424` | `#f6339a` |
| purple | `#faf5ff` | `#f3e8ff` | `#e9d4ff` | `#dab2ff` | `#c27aff` | `#ad46ff` | `#9810fa` | `#8200db` | `#6e11b0` | `#59168b` | `#3c0366` | `#ad46ff` |
| red | `#fef2f2` | `#ffe2e2` | `#ffc9c9` | `#ffa2a2` | `#ff6467` | `#fb2c36` | `#e7000b` | `#c10007` | `#9f0712` | `#82181a` | `#460809` | `#fb2c36` |
| rose | `#fff1f2` | `#ffe4e6` | `#ffccd3` | `#ffa1ad` | `#ff637e` | `#ff2056` | `#ec003f` | `#c70036` | `#a50036` | `#8b0836` | `#4d0218` | `#ff2056` |
| sky | `#f0f9ff` | `#dff2fe` | `#b8e6fe` | `#74d4ff` | `#00bcff` | `#00a6f4` | `#0084d1` | `#0069a8` | `#00598a` | `#024a70` | `#052f4a` | `#00a6f4` |
| slate | `#f8fafc` | `#f0f4fa` | `#e0e7f2` | `#c8d4e5` | `#8e9fbc` | `#607291` | `#43536f` | `#2f3f5b` | `#1c2840` | `#0e162d` | `#020619` | `#607291` |
| spring | `#f4feee` | `#e4fcd9` | `#c9f9b4` | `#9bf37d` | `#50e339` | `#3ecc28` | `#2fa61f` | `#25801b` | `#1f6518` | `#21541d` | `#0e2e0c` | `#3ecc28` |
| stone | `#fbfaf8` | `#f6f5f3` | `#e9e5e2` | `#d8d3cf` | `#a89f98` | `#7c7068` | `#5a524a` | `#473f38` | `#2b2522` | `#1e1916` | `#0d0a08` | `#7c7068` |
| teal | `#f0fdfa` | `#cbfbf1` | `#96f7e4` | `#46ecd5` | `#00d5be` | `#00bba7` | `#009689` | `#00786f` | `#005f5a` | `#0b4f4a` | `#022f2e` | `#00bba7` |
| vermilion | `#fff5ef` | `#ffe8da` | `#ffd0b6` | `#ffae83` | `#ff7831` | `#fd4e18` | `#ef2805` | `#c61d03` | `#9f1c08` | `#802212` | `#450e07` | `#fd4e18` |
| violet | `#f5f3ff` | `#ede9fe` | `#ddd6ff` | `#c4b4ff` | `#a684ff` | `#8e51ff` | `#7f22fe` | `#7008e7` | `#5d0ec0` | `#4d179a` | `#2f0d68` | `#8e51ff` |
| yellow | `#fefce8` | `#fef9c2` | `#fff085` | `#ffdf20` | `#fdc700` | `#f0b100` | `#d08700` | `#a65f00` | `#894b00` | `#733e0a` | `#432004` | `#f0b100` |
| zinc | `#fafafa` | `#f4f4f6` | `#e4e3e9` | `#d5d3da` | `#a09eab` | `#72707d` | `#53515e` | `#403e48` | `#28262c` | `#18181c` | `#09090b` | `#72707d` |

The palette also defines `--i-color-white` (`#fff`) and `--i-color-black` (`#000`).

## Variables set per element

### Variant colors

Every color class sets two variables on its element. Buttons, links and other elements build all their colors from them:

| Variable | Default | Meaning |
|---|---|---|
| `--i-variant` | `var(--i-color-base)` | same |
| `--i-variant-inverse` | `var(--i-color-paper)` | same |

The defaults live in `variables/themes/styles.css`. Set the two variables to give any button or link a custom color. It works with every mode and state:

```html
<button style="--i-variant: #7c3aed; --i-variant-inverse: #fff">Custom</button>
<button class="outlined" style="--i-variant: #7c3aed">Custom outlined</button>
<a href="#" style="--i-variant: #7c3aed">Custom link</a>
```

### Private variables

Buttons, links, form controls and a few components keep their state colors in variables that start with `--_`, such as `--_background` or `--_border`. They are internal, not part of the API, and can change between versions. Override the `--i-` variables instead.

## Notes for maintainers

These 2 variables are defined but no Iris rule uses them. They complete the radius scale, are safe to override, and have no effect on their own:

`--i-border-radius-medium`, `--i-border-radius-large`
