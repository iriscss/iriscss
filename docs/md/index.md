---
title: Iris CSS documentation
description: Documentation for Iris CSS, a modern CSS framework for semantic HTML.
---

# Iris CSS documentation

Iris CSS is a CSS framework for semantic HTML. Write plain HTML and every element is styled, responsive and ready for light and dark mode. Classes are optional, use them when you want a variant.

## Reference

- [Selectors](selectors.md): every element, class and attribute Iris CSS styles.
- [CSS variables](variables.md): every custom property, with its light and dark values.

## Quick start

Link the stylesheet in the `<head>` of your page:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <link rel="stylesheet" href="css/iris.min.css">
    <title>Hello Iris!</title>
  </head>
  <body>
    <main class="container">
      <h1>Hello Iris!</h1>
    </main>
  </body>
</html>
```

Get `iris.min.css` from npm (`npm install iriscss`), from the jsDelivr CDN or by building it from source, as the [README](../../README.md#quick-start) describes.

## Key ideas

- **Classless first.** Forms, buttons, tables, cards, modals and navigation are styled from plain HTML. See [Elements](selectors.md#elements).
- **Optional classes with no prefix.** Short modifiers like `.primary`, `.outlined` or `.large` that work on most elements. See [Classes](selectors.md#classes).
- **HTML and ARIA attributes.** `aria-busy="true"` shows a spinner, `aria-invalid="true"` marks a field with an error, `data-tooltip` adds a tooltip. See [Attributes](selectors.md#attributes).
- **Light and dark mode.** Every color is a `light-dark()` pair. Iris follows the system setting, and `data-theme="light"` or `data-theme="dark"` forces a scheme on the page or on any element.
- **Your CSS wins.** Every Iris rule sits in a cascade layer, so your own styles override Iris without specificity tricks or `!important`. See [How to override](variables.md#how-to-override).
- **Customize with variables.** Every value comes from a `--i-` custom property. Override it on `:root` to change it everywhere, or on one element to change it locally. See [How to override](variables.md#how-to-override).

## About these docs

These Markdown files live in `docs/md`, next to the framework source, so a change to the CSS and its documentation can land in the same commit. They read as plain Markdown on GitHub. The website publishes `selectors.md` and `variables.md` as they are under `/reference/`, and adds them to `llms-full.txt`.

The tables in [CSS variables](variables.md) were generated from the source in `src`. Update them when you add, rename or change a variable.
