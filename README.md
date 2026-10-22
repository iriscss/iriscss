# Iris CSS

## Modern Responsive CSS Framework

No JavaScript, no SCSS and no classes required. Write plain semantic HTML and every element is styled, responsive and ready for light and dark mode. Classes are optional, use them when you want a variant.

```html
<!-- This just works. No classes needed. -->
<form>
  <label>Email <input type="email" /></label>
  <label>Password <input type="password" /></label>
  <button type="submit">Sign in</button>
</form>
```

## Why Iris CSS?

- **CSS only.** Plain CSS with custom properties. No preprocessor, no JavaScript, works with any stack.
- **Classless first.** Forms, buttons, tables, modals and navigation look right without a single class. Add `.card` or `.box` when you want a framed block.
- **Classes you can remember.** Short, readable modifiers like `.primary`, `.outlined` or `.large` that work on most elements.
- **Light and dark mode.** Every color is a `light-dark()` pair. Follows the system preference, and can be forced per page or per section.
- **Your CSS wins.** Every Iris rule sits in a cascade layer, so your own styles override it without specificity tricks.
- **A real color palette.** 26 color families with 11 shades each, including pink, emerald, jade and vermilion.
- **Accessible.** Focus rings, ARIA driven states, high contrast and forced colors support, reduced motion and reduced transparency. A few extra KB so no one gets left behind.
- **AI friendly.** Ships with [rules for AI assistants](ai/iris-usage.md) that list every class and pattern and the mistakes to avoid. The website publishes `llms.txt`, `llms-full.txt` and a Markdown copy of every docs page.

## Quick start

### Build from source

You need Node.js 24 and npm. The exact version is pinned in `.tool-versions`, see [Local setup](#local-setup).

```shell
git clone https://github.com/iriscss/iriscss.git
cd iriscss
npm install
npm run build
```

The build writes these files to `dist/`:

| File | Contents |
|---|---|
| `iris.css` | The full framework, readable |
| `iris.min.css` | The full framework, minified |

Copy `iris.min.css` into your project and link it in the `<head>`:

```html
<link rel="stylesheet" href="css/iris.min.css">
```

### Install with npm

```shell
npm install iriscss
```

### Usage from CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/iriscss@1/dist/iris.min.css">
```

`iriscss@1` serves the newest 1.x release. Minor releases only add and patches only fix, so an update never breaks your page, and it never jumps to 2.0. Keep the major in the URL: without it the CDN serves the newest release, whatever its major.

To pin one release, use its full version, such as `iriscss@1.0.1`. Only a pinned URL can take an SRI hash: jsDelivr lists it for each file, add it as an `integrity` attribute with `crossorigin="anonymous"`.

### Starter HTML template

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
      <h1>Hello Iris, you are my world!</h1>
    </main>
  </body>
</html>
```

## Color schemes

Iris CSS follows the user's system preference by default. Force a scheme with the `data-theme` attribute on the root element:

```html
<html data-theme="dark">
```

`data-theme` also works on any element, so you can mix schemes on the same page:

```html
<main data-theme="light">
  <section data-theme="dark">This section is dark.</section>
</main>
```

## What's included

- Base reset and typography
- Color system with light and dark schemes and a 26 family palette
- Layout: container, intrinsic grid, stack, cluster, sidebar and switcher primitives, hero and landmarks
- Utilities: alignment, display, overflow, text truncation, palette colors and gradients
- Elements: typography, lists, links, buttons, tables, media, code, progress, meter and popover
- Form elements: inputs, selects, checkboxes, radios, switches, range, color, date and file inputs, validation states
- Components: accordion, alert, avatar, badge, box, breadcrumb, card, carousel, divider, drawer, dropdown, footer, group, icon, loader, modal, nav with a collapsing menu, navbar, pagination, sidenav, skeleton, skip to content link, steps, tabs, toast, tooltip
- Accessibility: focus styles, screen reader utilities, high contrast, forced colors, reduced motion and transparency
- Print styles

## Documentation

Read the docs and browse the examples at [iriscss.com](https://iriscss.com/documentation).

## Development

The website at [iriscss.com](https://iriscss.com) and its documentation live in a separate repo, `iriscss/iriscss.website`. It is private for now and will be opened for contributions later. It expects this repo checked out next to it, in a directory named `iriscss`.

### Local setup

The Node.js version is pinned in `.tool-versions` at the repo root. Install it with [asdf](https://asdf-vm.com):

```shell
asdf plugin add nodejs
asdf install
node --version
npm install
```

[mise](https://mise.jdx.dev) reads the same file, so `mise install` works too. Without a version manager, install Node.js 24 from [nodejs.org](https://nodejs.org).

### Scripts

```shell
npm run dev         # rebuild the framework on every change in src/
npm run build       # build the framework into dist/
npm run check       # Stylelint, Prettier, the build and the regression tests, as CI runs them
npm run lint:fix    # fix the property order
npm run format      # format the source with Prettier
```

Stylelint enforces the property order from the AI instructions.

### AI instructions

There are two sets, for two audiences:

- `ai/iris-usage.md` is for assistants that build pages with Iris CSS. It ships in the npm package, and the website serves it at `/ai/iris-usage.md` and puts it at the top of `llms-full.txt`. Update it when a class, attribute or markup pattern changes.
- `.github/instructions/`, indexed by `AGENTS.md`, is for assistants that work on Iris CSS itself: naming, CSS style guide, property order and framework architecture.

## Browser support

Iris CSS uses modern CSS features like `color-mix()`, `:has()`, `:is()`, `:where()`, `:focus-visible`, `accent-color`, `aspect-ratio`, `backdrop-filter`, `dialog`, cascade layers, `light-dark()` and logical properties. The minimum versions come from `color-mix()`. The build adds a fallback for `light-dark()`, so older browsers get the same colors, nested themes included.

| Browser | Minimum version | Released |
|---|---|---|
| Chrome | 111+ | Mar 2023 |
| Edge | 111+ | Mar 2023 |
| Firefox | 113+ | May 2023 |
| Safari | 16.2+ | Dec 2022 |
| Opera | 97+ | Mar 2023 |
| Samsung Internet | 22+ | Jul 2023 |
| IE | Not supported | |

Newer features are progressive. Where a browser lacks them, the page still works with a simpler look:

- Popover API (Chrome 114, Safari 17, Firefox 125): popovers, dropdown menus and toasts show in place as normal content, and the collapsing nav menu stays inline.
- Custom properties in `::backdrop` (Chrome 122, Safari 17.4, Firefox 120): the modal opens without the dimmed overlay.
- `:has()` (Firefox 121): checkbox label layout, footer columns, the sticky footer, the modal scroll lock, finished steps, nested `kbd` key combinations and helper text after a `label` are skipped.
- Entry and exit animations, popover anchoring, the customizable `select`, carousel scroll buttons, `text-box` trimming, `field-sizing` and `line-clamp` apply only where supported.

The `browserslist` in `package.json` matches this table, so Autoprefixer adds the prefixes these versions need.

## Copyright and license

Licensed under the [MIT License](https://github.com/iriscss/iriscss/blob/main/LICENSE.md).
