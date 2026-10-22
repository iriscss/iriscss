# Iris CSS: rules for AI assistants

Read this before you write HTML or CSS for a page that uses Iris CSS. Full docs: https://iriscss.com/llms.txt

## How Iris CSS works

- Plain semantic HTML is styled with no classes. Write the right element first: `button`, `form`, `label`, `table`, `dialog`, `details`, `nav`, `article`, `header`, `footer`.
- Classes are optional modifiers with no prefix: `.primary`, `.outlined`, `.large`. Add one only for a variant or a component that HTML has no element for.
- Custom properties carry the `--i-` prefix, such as `--i-color-primary` or `--i-spacing`. Change the look by overriding them, on `:root` for the whole page or on one element.
- Light and dark mode are automatic. `data-theme="light"` or `data-theme="dark"` (or the `.light` and `.dark` classes) forces a theme on any element and everything inside it.
- Every Iris rule is in a cascade layer, so plain CSS you write wins without `!important` or extra specificity.
- Interactive components use native HTML: `popover`, `dialog` with invoker commands, `details`. They need no JavaScript.

## Do not

- Do not use classes from other frameworks. `.btn`, `.btn-primary`, `.row`, `.col-md-6`, `.d-flex`, `.mt-3`, `.p-4`, `.text-gray-500`, `.navbar-nav`, `.form-control`, `.modal-dialog` and Tailwind utilities do nothing in Iris CSS.
- Do not invent classes. If a class is not listed below, it does not exist. Use plain CSS for anything else.
- Do not add classes to elements that are already styled. `<button>`, `<input>` and `<table>` need none.
- Do not write JavaScript to open modals, menus, popovers, tooltips, tabs or accordions. Use the native patterns below.
- Do not hand roll dark mode with `prefers-color-scheme` or a `.dark` stylesheet. Every Iris color already switches.
- Do not hardcode colors. Use a color class or a `--i-color-*` variable, so the color follows the theme.
- Do not wrap form controls in extra divs for spacing. Put the control inside its `label`.

## Starter page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <link rel="stylesheet" href="css/iris.min.css">
    <title>Page title</title>
  </head>
  <body>
    <main class="container">
      <h1>Page title</h1>
    </main>
  </body>
</html>
```

## Classes

These are all the Iris CSS classes.

| Group | Classes |
|---|---|
| Layout | `.container` (centered, max width), `.container-fluid`, `.grid` (equal columns that wrap), `.span-full` (child of `.grid`), `.stack` (vertical gap), `.cluster` (wrapping row), `.with-sidebar` (two children, `.end` puts the sidebar last), `.switcher` (row that stacks when narrow), `.hero` |
| Colors | `.primary`, `.secondary`, `.contrast`, `.accent`, `.info`, `.success`, `.warning`, `.danger`, `.link`. On buttons and links they color the control, on other elements they set the background and text |
| Styles | `.outlined`, `.rounded`, `.square`, `.tint` and `.deep` (buttons), `.light`, `.dark` |
| Sizes | `.small`, `.medium`, `.large`. No class is the default size, and `.medium` is larger than the default |
| States | `.hover`, `.active`, `.focus`, `.disabled`, for previews only. Use the real `disabled` attribute in forms |
| Tables | `.striped`, `.hover`, `.sticky` on `table`, `.table-responsive` on a wrapper |
| Components | `.alert`, `.avatar`, `.avatar-group`, `.badge`, `.box`, `.breadcrumb`, `.card`, `.carousel`, `.close` (in `dialog`, `.toast`, `.alert`), `.divider`, `.drawer` (`.start`, `.bottom`), `.dropdown`, `.select`, `.footer`, `.group`, `.icon`, `.icon-text`, `.navbar`, `.nav-toggle`, `.pagination`, `.skeleton`, `.steps`, `.tabs`, `.toast`, `.toasts`, `.sticky` |
| Brand | `.brand`, `.brand-name`, `.brand-accent` |
| Gradients | `.gradient` with a family class (`.blue`, `.emerald`...), `.to-top`, `.to-bottom`, `.to-left`, `.radial`, `.ellipse`, `.radial-top`, `.radial-right`, `.radial-bottom`, `.radial-left` |
| Palette | `.color-{family}-{shade}`, `.background-{family}-{shade}`. Families: amber, blue, chartreuse, cyan, emerald, fuchsia, gray, green, indigo, jade, lime, neutral, orange, pink, purple, red, rose, sky, slate, spring, stone, teal, vermilion, violet, yellow, zinc. Shades: 50, 100 to 900 by 100, 950 |
| Utilities | `.hidden`, `.block`, `.inline-block`, `.inline`, `.flex`, `.inline-flex`, `.contents`, `.visible`, `.invisible`, `.text-center`, `.justify-center`, `.items-center`, `.mx-auto`, `.overflow-auto`, `.overflow-x-auto`, `.overflow-y-auto`, `.overflow-hidden`, `.overflow-clip`, `.truncate`, `.line-clamp` |
| Accessibility | `.sr-only`, `.sr-only-focusable`, `.skip-to-content` |

There are no spacing, margin, padding, width or font size utilities. Use `.stack`, `.cluster` and `.grid` for spacing, or plain CSS with `var(--i-spacing)`.

## Attributes that change the look

| Attribute | Effect |
|---|---|
| `aria-busy="true"` | Loading spinner. On a button, add `aria-disabled="true"` too |
| `aria-invalid="true"` / `"false"` | Error or valid style on a field. Native validation (`required`, `type="email"`) shows errors with no attribute |
| `aria-current="page"` | Current link in a nav, navbar, pagination or breadcrumb. `aria-current="step"` in `.steps` |
| `aria-pressed="true"` | On a button: a toggle that is on. Use it instead of a color class for the selected filter or view |
| `aria-disabled="true"` | Disabled look on any element |
| `role="switch"` | On `input type="checkbox"`: a toggle switch |
| `role="button"` | On a link: looks like a button |
| `data-tooltip="Text"` | Tooltip on hover and focus. `data-placement="top|right|bottom|left"` sets the side |
| `popover` + `data-placement` | Popover anchored to the button that opens it |
| `data-theme="light|dark"` | Forces a theme on the element and everything inside it |

## Patterns

Forms: a control inside its `label`, helper text in a `small` right after the control, columns with `.grid`.

```html
<form>
  <div class="grid">
    <label>First name <input type="text" name="first" autocomplete="given-name"></label>
    <label>Last name <input type="text" name="last" autocomplete="family-name"></label>
  </div>
  <label>Email <input type="email" name="email" required aria-describedby="email-help"></label>
  <small id="email-help">We never share your email.</small>
  <label><input type="checkbox" role="switch" name="news" checked> Newsletter</label>
  <button type="submit" class="primary">Sign up</button>
</form>
```

Navbar: a `header.navbar` around a `nav`. The first list is the brand. The links list collapses behind the `.nav-toggle` on narrow screens.

```html
<header class="navbar sticky">
  <nav class="container" aria-label="Main">
    <ul>
      <li><a href="/"><img src="logo.svg" alt=""> Brand</a></li>
    </ul>
    <button class="nav-toggle" popovertarget="menu" aria-label="Menu"></button>
    <ul id="menu" popover>
      <li><a href="/docs/" aria-current="page">Docs</a></li>
      <li><a href="/pricing/">Pricing</a></li>
      <li><button class="primary">Sign in</button></li>
    </ul>
  </nav>
</header>
```

Footer: a wrapper whose first child holds the brand and the `nav` columns, then a bottom row.

```html
<footer class="footer">
  <div class="container">
    <div>
      <div><a href="/">Brand</a><p>Short tagline</p></div>
      <nav aria-label="Product">
        <h2>Product</h2>
        <ul><li><a href="/docs/">Docs</a></li><li><a href="/pricing/">Pricing</a></li></ul>
      </nav>
    </div>
    <div><p>&copy; 2026 Brand</p></div>
  </div>
</footer>
```

Card: a direct `header` and `footer` become tinted bands.

```html
<article class="card">
  <header><h3>Pro</h3></header>
  <p>Everything in Free, plus teams.</p>
  <footer><button class="primary">Choose</button></footer>
</article>
```

Modal and drawer: a `dialog` opened by invoker commands, no script. Add `class="drawer"` for a panel from the side.

```html
<button commandfor="confirm" command="show-modal">Delete</button>
<dialog id="confirm" closedby="any" aria-labelledby="confirm-title">
  <header>
    <button class="close" commandfor="confirm" command="close" aria-label="Close"></button>
    <h3 id="confirm-title">Delete project?</h3>
  </header>
  <p>This cannot be undone.</p>
  <footer>
    <button class="secondary" commandfor="confirm" command="close">Cancel</button>
    <button class="danger" commandfor="confirm" command="close">Delete</button>
  </footer>
</dialog>
```

Dropdown and popover: a `popover` element right after the button that opens it.

```html
<button popovertarget="account">Account</button>
<ul id="account" popover class="dropdown">
  <li><a href="/profile/">Profile</a></li>
  <li><a href="/logout/">Sign out</a></li>
</ul>

<button popovertarget="file">File</button>
<ul id="file" popover class="dropdown">
  <li><button type="button">Save</button></li>
  <li><button type="button">Save as...</button></li>
  <li><hr></li>
  <li><button type="button">Close</button></li>
</ul>

<button popovertarget="help">Help</button>
<div id="help" popover data-placement="bottom">Short help text.</div>
```

Accordion and tabs: `details` elements. A shared `name` keeps one open. Wrap them in `.tabs` for tabs.

```html
<div class="tabs">
  <details name="billing" open><summary>Monthly</summary><p>$9 a month.</p></details>
  <details name="billing"><summary>Yearly</summary><p>$90 a year.</p></details>
</div>
```

Toast: `popover="manual"`, opened with `popovertargetaction="show"` or `showPopover()`.

```html
<button popovertarget="saved" popovertargetaction="show">Save</button>
<div id="saved" class="toast success" popover="manual" role="status">
  <p>Your changes were saved.</p>
  <button class="close" popovertarget="saved" popovertargetaction="hide" aria-label="Close"></button>
</div>
```

Hero, alert, badge, joined controls, steps:

```html
<section class="hero">
  <h1>Build with plain HTML</h1>
  <p>Styled markup, no classes needed.</p>
  <div class="cluster justify-center">
    <a href="/start/" role="button" class="primary">Get started</a>
    <a href="/docs/" role="button" class="outlined">Docs</a>
  </div>
</section>

<div class="alert warning" role="alert">Your trial ends tomorrow.</div>
<div class="alert info" role="status">
  <button class="close" aria-label="Dismiss"></button>
  <p>New features are available.</p>
</div>
<h3>Inbox <span class="badge danger">4</span></h3>

<search>
  <form class="group" role="group">
    <input type="search" name="q" aria-label="Search">
    <button class="primary">Search</button>
  </form>
</search>

<ol class="steps">
  <li>Cart</li>
  <li aria-current="step">Payment</li>
  <li>Review</li>
</ol>
```

## Custom styles

Override variables instead of writing new rules where you can. A `light-dark()` pair gives each theme its own value.

```css
:root {
  --i-color-primary: light-dark(#6d28d9, #a78bfa);
  --i-color-primary-inverse: light-dark(#fff, #1e1b4b);
}

.pricing-card {
  --i-card-color-background: light-dark(#f5f3ff, #1e1b4b);
}
```

For a one off color on a button or link, set `--i-variant` and `--i-variant-inverse` on it. Every variable is listed in https://iriscss.com/reference/variables.md.
