---
title: Selectors
description: Every element, class and attribute Iris CSS styles.
---

# Selectors

Iris CSS styles plain HTML first. Most pages need no classes at all: write semantic HTML and it is styled, responsive and ready for light and dark mode.

Classes are optional. Use them when you want a variant, such as a colored or larger button. Class names have no prefix, for example `.outlined` or `.color-amber-50`. Only [CSS variables](variables.md) carry the `--i-` prefix.

Many Iris styles also react to standard HTML and ARIA attributes, such as `aria-busy="true"` for a loading spinner or `aria-invalid="true"` for a field with an error.

## Contents

- [Elements](#elements)
- [Classes](#classes)
  - [Layout](#layout)
  - [Display, alignment and overflow](#display-alignment-and-overflow)
  - [Colors](#colors)
  - [Styles](#styles)
  - [Sizes](#sizes)
  - [States](#states)
  - [Tables](#tables)
  - [Components](#components)
  - [Brand](#brand)
  - [Gradients](#gradients)
  - [Color palette](#color-palette)
  - [Accessibility](#accessibility)
- [Attributes](#attributes)

## Elements

These elements are styled without any class.

| Area | Elements |
|---|---|
| Document | `html`, `body`, with a root font size that grows smoothly with the viewport and light or dark colors. Native controls that Iris does not restyle, such as picker popups, use the primary color. Scrollbars follow the theme |
| Landmarks | `header`, `main`, `footer`, `section` |
| Print | When printed, the page is black on white, the navbar, a `nav` in `body` or in a page `header`, dialogs, popovers, toasts and the skip link are hidden, external links show their address, and tables, figures, code and cards do not break across pages |
| Typography | `h1` to `h6`, `hgroup`, `p`, `small`, `strong`, `b`, `mark`, `ins`, `del`, `sub`, `sup`, `abbr[title]`, `blockquote`, `address`, `hr`, `math` (MathML uses a math font). Headings balance their lines and text blocks avoid a lone word on the last line. In Safari an opening quote mark in a `blockquote` hangs outside the text |
| Lists | `ul`, `ol`, `li`, `dl`, `dt`, `dd`, `menu`. Bullets and numbers use the subtle color. A `menu` is a toolbar, so its items sit in a row |
| Links | `a` |
| Buttons | `button`, `input[type="submit"]`, `input[type="reset"]`, `input[type="button"]`, `input[type="file"]` (its button), `[role="button"]` |
| Forms | `form`, `fieldset`, `legend`, `label`, `input`, `select`, `option`, `optgroup`, `textarea`, `output` (even digit widths). In browsers that support a customizable `select`, its option list uses the dropdown colors |
| Input types | `checkbox`, `radio`, `range`, `color`, `date`, `datetime-local`, `month`, `time`, `week`, `file`, `search` |
| Tables | `table`, `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`. Cells use even digit widths, and a `th` in `tbody` is bold as a row header |
| Code | `pre`, `code`, `kbd`, `samp`. Nest `kbd` for a key combination: `<kbd><kbd>Ctrl</kbd>+<kbd>C</kbd></kbd>`. `var` stays in the text font |
| Media | `img`, `svg`, `picture`, `video`, `audio`, `canvas`, `iframe`, `object`, `embed`. Media scales down to fit its container. An `iframe` without `width` or `height` fills the width at 16:9. `audio` fills the width, the alt text of a broken `img` is italic and `track` captions use the theme font |
| Figures | `figure`, `figcaption` |
| Accordion | `details`, `summary` |
| Popover | any element with `popover`, opened by a button with `popovertarget`. It fades in, centered over the page. `data-placement` anchors it to the button |
| Modal | `dialog`, drawn as a card over a dimmed page. Open it with `showModal()`. `closedby="any"` closes it on a click outside where supported. It animates in and out, and the page stops scrolling while it is open |
| Navigation | `nav`, with `ul` or `ol`, `li` and `a`. Only the nav's own lists form the row, so nested lists keep their layout |
| Progress | `progress`, `meter`. A `meter` is green in its optimum range, yellow below it and red in the worst range, from its `low`, `high` and `optimum` attributes |

## Classes

### Layout

| Class | Applies to | Effect |
|---|---|---|
| `.container` | any block | Centered content with a max width that grows at each breakpoint: 576px from 640px, 700px from 768px, 950px from 1024px, 1200px from 1280px and 1450px from 1536px |
| `.container-fluid` | any block | Full width content with side padding |
| `.grid` | any block | Children sit side by side in equal columns at least `--i-grid-column-min-width` (10rem) wide, and wrap onto new rows when the grid gets narrow, so it adapts to its container as well as the screen |
| `.span-full` | a child of `.grid` | Takes a whole row |
| `.stack` | any block | Stacks its children with an even gap between them |
| `.cluster` | any block | Puts its children in a row that wraps, such as tags or buttons |
| `.with-sidebar` | a wrapper with two children | The first child is a 16rem sidebar and the second takes the rest. They stack when the content would get narrower than half. `.end` puts the sidebar last |
| `.switcher` | any block | Its children sit in one row, or stack in one column once the container is narrower than 40rem. More than four children always stack |
| `.hero` | `section` or any block | Large intro band with centered text. A color class fills it with that color |

### Display, alignment and overflow

Small utilities, one CSS property each.

| Class | Effect |
|---|---|
| `.hidden` | `display: none` |
| `.block` | `display: block` |
| `.inline-block` | `display: inline-block` |
| `.inline` | `display: inline` |
| `.flex` | `display: flex` |
| `.inline-flex` | `display: inline-flex` |
| `.contents` | `display: contents` |
| `.visible` | `visibility: visible` |
| `.invisible` | `visibility: hidden` |
| `.text-center` | `text-align: center` |
| `.justify-center` | `justify-content: center` |
| `.items-center` | `align-items: center` |
| `.mx-auto` | `margin-inline: auto` |
| `.overflow-auto` | `overflow: auto` |
| `.overflow-x-auto` | `overflow-x: auto` |
| `.overflow-y-auto` | `overflow-y: auto` |
| `.overflow-hidden` | `overflow: hidden` |
| `.overflow-clip` | `overflow: clip` |
| `.truncate` | One line, cut short with an ellipsis |
| `.line-clamp` | Keeps the first 3 lines (`--i-line-clamp-lines`), with an ellipsis |

### Colors

A color class sets two variables on its element, `--i-variant` and `--i-variant-inverse`. Buttons and links build all their colors from them, so every color works with every [style](#styles) and [state](#states). On any other element, a color class sets the background and a matching text color.

| Class | Meaning |
|---|---|
| `.primary` | Main action |
| `.secondary` | Less important action. Also the default look of `input[type="reset"]` |
| `.contrast` | Highest contrast with the page: dark in light mode, light in dark mode |
| `.accent` | Highlight color |
| `.info` | Information |
| `.success` | Success |
| `.warning` | Warning |
| `.danger` | Error or destructive action |
| `.link` | Link color |

Each class uses its color family from [Color families](variables.md#color-families). On links, it changes the text and underline colors, with no background. On buttons, it changes the background, border, text and focus ring. On checkboxes, radios, switches, `progress`, tabs, steps and pagination, it changes the checked, filled or current color, which is primary by default. On alerts and badges, it sets their color.

```html
<button class="primary">Save</button>
<button class="danger outlined">Delete</button>
<button class="success light">Approved</button>
<a href="#" class="accent">Read more</a>
<input type="checkbox" class="danger" checked>
<progress class="success" value="70" max="100"></progress>
<p class="warning">Your trial ends tomorrow.</p>
```

For a color that is not in the list, set the two variables yourself:

```html
<button style="--i-variant: #7c3aed; --i-variant-inverse: #fff">Custom</button>
```

### Styles

| Class | Applies to | Effect |
|---|---|---|
| `.outlined` | buttons | Transparent background with a colored border and text. Works with every color class, for example `.primary.outlined` |
| `.outlined` | `.card`, `.box` | Transparent background with a border instead of a shadow |
| `.outlined` | inputs, selects, `.select` | Transparent background |
| `.rounded` | buttons, inputs, selects, `progress`, `meter`, `.group` | Pill shaped corners |
| `.rounded` | `.card`, `.box`, `pre`, `code`, `kbd`, `samp` | Larger rounded corners |
| `.square` | the same elements as `.rounded` | No rounded corners |
| `.tint` | buttons | Pale tint of the button color with dark text, in both themes. Works with every color class, for example `.danger.tint` |
| `.deep` | buttons | Deep shade of the button color with white text, in both themes. Works with every color class |
| `.light` | any element | Forces the light theme on the element and everything inside it, like `data-theme="light"`. On `pre`, `code`, `kbd` and `samp` it also switches to light code colors |
| `.dark` | any element | Forces the dark theme on the element and everything inside it, like `data-theme="dark"` |

### Sizes

The default size needs no class.

| Class | Applies to |
|---|---|
| `.small` | buttons, inputs, selects, textareas, `table`, `.card`, `progress`, `meter`, `.group`, `.icon`, `.avatar` |
| `.medium` | the same elements |
| `.large` | the same elements |

On buttons and form controls the classes scale the padding and font size. On a `.group` they scale every control inside. On tables they change the cell padding and text size. On cards they change the padding. On `progress` and `meter` they change the bar height.

`.medium` is larger than the default.

### States

These classes show a state without user interaction, for example in documentation or design previews. On buttons and links they work with every color and style.

| Class | Applies to | Effect |
|---|---|---|
| `.hover` | buttons, links | Hover look. Form fields have no hover look |
| `.active` | buttons, links, inputs, selects, textareas | Active look. On buttons and links it is the same as hover |
| `.focus` | the same elements | Focus look, including the focus ring |
| `.disabled` | the same elements | Disabled look, and pointer events are turned off |

### Tables

| Class | Applies to | Effect |
|---|---|---|
| `.striped` | `table` | Shades every other body row |
| `.hover` | `table` | Highlights the body row under the pointer |
| `.sticky` | `table` | Keeps the header row in view while the page scrolls. Inside `.table-responsive`, give the wrapper a `max-height` and the header sticks to it |
| `.table-responsive` | a wrapper around a table | Scrolls the table horizontally when it is too wide. Give it `tabindex="0"` and an `aria-label` so keyboard users can scroll it |

### Components

| Class | Applies to | Effect |
|---|---|---|
| `.avatar` | `img` or `span` | Round picture or initials. `.small`, `.medium` and `.large` resize it, `.square` rounds the corners only, and a color class colors the initials |
| `.avatar-group` | a wrapper around avatars | Overlaps them in a row |
| `.alert` | any block element | Tinted message box with a colored bar on the start edge. Add a color class and `role="alert"` or `role="status"`. Links inside take the alert color. A `.close` button as the first child sits at the end and dismisses it |
| `.badge` | `span` or `a` | Small pill for counts, tags and labels. Sized from the surrounding text. Secondary by default. `.outlined` gives a border instead of a fill |
| `.box` | any block element, or `a` | Padded block with a background, rounded corners and a shadow. As a link, the whole box is clickable and lifts on hover |
| `.card` | any block element, usually `article` | Padded block with a background and a shadow. A direct `header` or `footer` becomes a tinted band, and a color class fills it. A `dialog` is always a card |
| `.carousel` | any block | A row of slides that scrolls sideways and snaps to each one. Browsers with CSS scroll buttons add previous and next buttons and a dot per slide. Give it `tabindex="0"` and an `aria-label` so keyboard users can reach it |
| `.divider` | `p` or `div` | A rule with text in the middle, such as "or". For a rule without text, use `hr` |
| `.drawer` | `dialog` | A modal that slides in from the end edge. `.start` uses the start edge and `.bottom` makes a bottom sheet. Open it with `showModal()` |
| `.dropdown` | a `ul` with `popover` | A menu of links or choices, opened by the button whose `popovertarget` points at it. It closes on Esc and on a click outside, opens below the button where anchor positioning works and flips near the edge of the screen. Put it right after the button, which gets a chevron. Items hold links, labels or command buttons, which fill the item like a link. `<li><hr></li>` separates groups. In a `nav`, a button without a class looks like a link |
| `.select` | a `button` that opens a `.dropdown` | Draws the button as a select, for a menu of choices. Takes sizes, styles and `aria-invalid` like a select |
| `.group` | any element holding inputs, selects and buttons, usually with `role="group"` | Joins them into one row. In or on `<search>` or `[role="search"]` the row gets pill ends. When `<search>` holds a `form`, put the class on the form |
| `.close` | a button inside a `dialog`, a `.toast` or an `.alert` | Close button with a cross icon. In a dialog, `rel="prev"` on a link does the same |
| `.pagination` | `nav` | Page links in an `ol` or `ul`. Mark the current page with `aria-current="page"` and unavailable links with `aria-disabled="true"`. Use a `span` for gaps |
| `.navbar` | `header` around a `nav` | Top bar with a background and a bottom border. The first list is the brand: a link with an optional logo. A list with `popover` and a `.nav-toggle` button collapse into a full width panel under the bar below a 48rem wide nav. A list after the popover list stays in the bar, next to the button. `.sticky` keeps the bar at the top of the screen. A color class fills it. `aria-current="page"` marks the current link, and a button with `aria-label` and no class is drawn as a plain icon button |
| `.footer` | `footer`, usually a direct child of `body` | Page footer band with a background and a top border. The element holding the `nav` elements becomes a column grid, its first child is the brand when it is not a `nav`, and the element after the grid is the bottom row. Below a 48rem wide footer the brand spans the row and the bottom row stacks. `.sticky` keeps it at the bottom of short pages. A color class fills it |
| `.sidenav` | `nav` | Vertical menu for docs and settings pages. A `details` is a collapsible group and its `summary` the label, a heading followed by a `ul` is a group that stays open. A list or `details` in an `li` is one level deeper, with a guide line. `aria-current` marks the current link with a bar, and a closed group holding it gets a stronger label. Add `open` to the group holding the current page. Wrapped in `<details><summary>Menu</summary>`, the menu folds behind the summary on screens under 48rem or in an aside wider than 24rem, and shows with the summary hidden otherwise. Browsers without `::details-content` keep it folded. `.sticky` keeps it in view, below a sticky navbar |
| `.nav-toggle` | a `button` inside `nav` | Menu button for a link list with `popover`. Below a 48rem wide nav the list collapses behind it, and above that the list sits in the nav and the button hides |
| `.skeleton` | any element | Shimmering placeholder while content loads, one line tall by default. Set a width or height, and `aria-hidden="true"`. `.rounded` makes a circle or pill |
| `.steps` | `ol` | Numbered progress tracker. Mark the current step with `aria-current="step"`; earlier steps show as done |
| `.toast` | any block | Short message in the bottom end corner. Make it `popover="manual"` and open it with `showPopover()`, or put several in a `.toasts` region. Color classes set the color, and a `.close` button inside dismisses it |
| `.toasts` | a wrapper, with `aria-live="polite"` | Fixed region in the bottom end corner that stacks the toasts inside it |
| `.tabs` | a wrapper around `details` elements that share a `name` | The summaries become tabs and the open panel shows below. Browsers without `::details-content` show an accordion |
| `.breadcrumb` | `nav` | Breadcrumb navigation with a divider between items. Put an `ol` or `ul` inside |
| `.icon` | `span` or any inline element | Square box for an icon font or inline SVG, 1.5rem by default. Use `.small`, `.medium` or `.large` to resize |
| `.icon-text` | `span` or `div` | Puts an `.icon` and its text side by side. A `div.icon-text` spans the full width |

```html
<div class="box">Any content</div>
<a class="box rounded" href="/pricing">The whole box is a link</a>

<article class="card">
  <header><h3>Plan</h3></header>
  <p>Card body</p>
  <footer><button>Choose</button></footer>
</article>

<header class="navbar sticky">
  <nav class="container" aria-label="Main">
    <ul>
      <li><a href="/"><img src="logo.svg" alt=""> Brand</a></li>
    </ul>
    <button class="nav-toggle" popovertarget="menu" aria-label="Menu"></button>
    <ul id="menu" popover>
      <li><a href="/docs/" aria-current="page">Docs</a></li>
      <li><a href="/about/">About</a></li>
      <li><button class="primary">Sign in</button></li>
    </ul>
  </nav>
</header>

<footer class="footer sticky">
  <div class="container">
    <div>
      <div>
        <a href="/"><img src="logo.svg" alt=""> Brand</a>
        <p>Short tagline</p>
      </div>
      <nav aria-label="Product">
        <h2>Product</h2>
        <ul>
          <li><a href="/docs/">Docs</a></li>
          <li><a href="/pricing/">Pricing</a></li>
        </ul>
      </nav>
    </div>
    <div>
      <p>&copy; 2026 Brand</p>
    </div>
  </div>
</footer>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li>Docs</li>
  </ol>
</nav>

<div class="alert warning" role="alert">Your trial ends tomorrow.</div>
<h3>Inbox <span class="badge danger">4</span></h3>
<p class="divider">or</p>

<nav class="pagination" aria-label="Pagination">
  <ol>
    <li><a href="?page=1">1</a></li>
    <li><a href="?page=2" aria-current="page">2</a></li>
    <li><span>…</span></li>
    <li><a href="?page=9">9</a></li>
  </ol>
</nav>

<ol class="steps">
  <li>Cart</li>
  <li aria-current="step">Payment</li>
  <li>Review</li>
</ol>

<div class="tabs">
  <details name="billing" open><summary>Monthly</summary>...</details>
  <details name="billing"><summary>Yearly</summary>...</details>
</div>

<div class="skeleton" aria-hidden="true" style="width: 60%"></div>

<button popovertarget="account">Account</button>
<ul id="account" popover class="dropdown">
  <li><a href="#">Profile</a></li>
  <li><a href="#">Sign out</a></li>
</ul>

<span class="icon-text">
  <span class="icon"><svg>...</svg></span>
  <span>Home</span>
</span>
```

### Brand

For the brand name and logo text. They work on headings, `span`, `div` and `a`.

| Class | Color variable |
|---|---|
| `.brand` | `--i-color-brand` |
| `.brand-name` | `--i-color-brand-name` |
| `.brand-accent` | `--i-color-brand-accent` |

### Gradients

`.gradient` paints a gradient background. Add a palette family to pick the colors, and optionally a direction or a radial shape.

| Class | Effect |
|---|---|
| `.gradient` | Linear gradient from left to right |
| `.to-top`, `.to-bottom`, `.to-left` | Change the direction |
| `.radial` | Radial gradient from the center, as a circle |
| `.ellipse` | Ellipse shape for `.radial` |
| `.radial-top`, `.radial-right`, `.radial-bottom`, `.radial-left` | Move the center of `.radial` |
| a family class | Colors: shades 200, 500 and 800 of that family. Without one, the gradient is gray |

Family classes: `.amber`, `.blue`, `.chartreuse`, `.cyan`, `.emerald`, `.fuchsia`, `.gray`, `.green`, `.indigo`, `.jade`, `.lime`, `.neutral`, `.orange`, `.pink`, `.purple`, `.red`, `.rose`, `.sky`, `.slate`, `.spring`, `.stone`, `.teal`, `.vermilion`, `.violet`, `.yellow`, `.zinc`.

Family classes only work together with `.gradient`.

```html
<div class="gradient emerald">Linear</div>
<div class="gradient radial ellipse radial-top violet">Radial</div>
```

### Color palette

Two classes for every shade of the [color palette](variables.md#color-palette): 26 families with 11 shades each, so 572 classes in total.

| Pattern | Effect | Example |
|---|---|---|
| `.color-{family}-{shade}` | Text color | `.color-emerald-500` |
| `.background-{family}-{shade}` | Background color | `.background-rose-100` |

Families are the same 26 as in [Gradients](#gradients). Shades are `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900` and `950`.

### Accessibility

| Class | Effect |
|---|---|
| `.sr-only` | Hides content visually but keeps it for screen readers |
| `.sr-only-focusable` | Like `.sr-only` until it or something inside it receives focus, then it shows |
| `.skip-to-content` | A "skip to content" link that stays off screen until it receives keyboard focus |

## Attributes

### ARIA

| Attribute | On | Effect |
|---|---|---|
| `aria-busy="true"` | any element except form controls, `form` and `html` | Shows a spinning loading icon before the content, in the element's text color. It does not block clicks or keys, so give a busy button `aria-disabled="true"` too |
| `aria-invalid="true"` | inputs, selects, textareas | Error style with a red border and icon |
| `aria-invalid="false"` | inputs, selects, textareas | Valid style with a green border and check icon |
| `aria-current` | links, buttons, nav links | Active look. `aria-current="false"` is ignored |
| `aria-pressed="true"` | buttons | On look for a toggle button, the same as `aria-current`. `"false"` and `"mixed"` keep the rest look |
| `aria-disabled="true"` | any element | `not-allowed` cursor. Buttons fade like disabled ones but stay focusable, so the script that sets it must also ignore their clicks |
| `aria-controls` | any element except text fields | Pointer cursor |

A field without `aria-invalid` that fails native validation (`required`, `pattern`, `type="email"` and so on) gets the error style once the user has edited it. Set `aria-invalid` to take over.

### Roles

| Attribute | On | Effect |
|---|---|---|
| `role="button"` | `a`, `summary`, any element | Looks like a button |
| `role="link"` | any element | Looks like a link |
| `role="search"` | an element holding a `.group` | The group gets pill corners, the same as inside `<search>` |
| `role="switch"` | `input[type="checkbox"]` | Toggle switch |

### Data attributes

| Attribute | On | Effect |
|---|---|---|
| `data-theme="light"` or `"dark"` | `html` or any element | Forces a color scheme for the element and everything inside it. Without it, Iris follows the system setting |
| `data-tooltip` | any element except busy buttons, buttons that open a `.dropdown`, `.close`, `.nav-toggle`, `summary` and breadcrumb and step items, which draw their own pseudo elements | Shows the attribute's text as a tooltip on hover and focus |
| `data-placement` | an element with `data-tooltip` | Tooltip position: `top` (default), `right`, `bottom` or `left` |
| `popover="hint"` | an element opened by a button with `interestfor` | A tooltip that the browser shows on hover and focus and closes with Esc, anchored to the button and flipped away from the screen edge. `data-placement` works the same. Browsers without `interestfor` do not show it |
| `data-placement` | an element with `popover` | Anchors the popover to the button that opens it: `bottom`, `top`, `left` or `right`. Without it, or where anchor positioning is not supported, the popover is centered |

```html
<html data-theme="dark">
<section data-theme="light">...</section>
<button data-tooltip="Saves your changes" data-placement="bottom">Save</button>
<button popovertarget="help">Help</button>
<div id="help" popover data-placement="bottom">...</div>
```

### Other attributes

| Attribute | On | Effect |
|---|---|---|
| `disabled` | buttons and form controls | Disabled look and `not-allowed` cursor |
| `readonly` | inputs, textareas | No active or focus border |
| `rows` | `textarea` | Fixed height. Without it, a textarea grows with its text from 4 to 16 lines in browsers that support `field-sizing` |
| `open` | `details` | Open accordion |
| `multiple`, `size` | `select` | List box instead of a dropdown, without the arrow icon |
| `rel="prev"` | a link inside a `dialog` | Close button, the same as `.close` |
| `title` | `abbr` | Dotted underline and help cursor |
| `value` | `progress` | Without `value`, `progress` shows an animated indeterminate bar |
| `fill` | `svg` | An `svg` without `fill` uses the current text color |
| `tabindex` | any element | Faster tap response on touch screens |
| `dir="rtl"` | any element | Right to left layout |
