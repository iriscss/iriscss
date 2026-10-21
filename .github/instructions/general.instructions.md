---
applyTo: "**"
---

# General Instructions

- Avoid compound-modifier overuse in all documentation, comments, commit messages, PR titles, and issue titles. Use simpler terms when possible.
- Do not use `—` (em dash) in code comments or documentation. Use a simple hyphen (-) or colon (:) instead.
- Avoid hyphenated compound words in code comments and documentation. Prefer single words or simpler phrasing instead.
- Use American English spelling throughout the codebase and documentation (e.g., "color" not "colour").
- Prefer active voice in documentation and comments for clarity.

## CSS Development

### Autoprefixer

Iris CSS uses [Autoprefixer](https://www.npmjs.com/package/autoprefixer), a PostCSS plugin that parses CSS and adds vendor prefixes to CSS rules using values from Can I Use.

**Important: Do not add vendor prefixes manually** (e.g., `-webkit-`, `-moz-`, `-ms-`). Autoprefixer handles this automatically during the build process based on the browserslist configuration.

Write your CSS rules without vendor prefixes (forget about them entirely):

```css
::placeholder {
  color: gray;
}

.image {
  width: stretch;
}
```

Autoprefixer will use data based on current browser popularity and property support to apply prefixes automatically.

## References

- Refer to [project-identity.instructions.md](./project-identity.instructions.md) for project-specific naming and conventions
- Refer to [css-style-guide.instructions.md](./css-style-guide.instructions.md) for CSS formatting and style guidelines
