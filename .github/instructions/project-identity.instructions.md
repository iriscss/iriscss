---
applyTo: "**"
---

# Project Identity and Naming

This file contains all project-specific naming conventions and identity information. When renaming the project, only this file needs to be updated.

## Project Information

**Framework Name (capitalized):** Iris CSS  
**Package Namespace (lowercase):** iriscss

### Website and Repositories

- **Website:** https://iriscss.com. Use this domain in every absolute URL, docs link and generated file.
- **Framework repo:** `iriscss/iriscss`, cloned into a directory named `iriscss`
- **Website repo:** `iriscss/iriscss.website`, cloned into `iriscss.website` next to the framework repo. It is private for now and will become public later, for others to contribute to. Until then, do not tell readers to clone it or open issues there.

### Package Names

- **Main package:** `iriscss`, published to npm
- **Website package:** `iris.website`, the `name` in the website `package.json`. It is private and never published. It is not the domain and not the repo name.

## Naming Rules

### Framework Name Casing

**Framework Name**: Always write `Iris CSS` (capital I and C) when referring to the framework name in:
- Documentation text (e.g., "Iris CSS is a modern CSS framework focused on simplicity and performance.")
- README files
- Comments describing the framework
- Marketing materials

**Package Names**: Always use lowercase in:
- npm package names (`iriscss`, `iris.website`)
- File paths and directory names

**Class Names**: Do not prefix CSS class names, e.g., `.outlined`, `.color-amber-50`, `.background-rose-100`.

**Custom Properties**: Prefix all custom properties with `--i-`, e.g., `--i-color-primary`, `--i-navbar-height`.

**Keyframes**: Prefix `@keyframes` names with `i-`, e.g., `i-spin`, `i-skeleton-shimmer`. Names are global, so a page's own keyframes with the same name would replace them.

**Examples:**
```typescript
// Correct - framework reference
// Iris CSS framework is focused on simplicity and performance.
```

If you find inconsistent casing, correct it according to these rules.

## Framework Philosophy

Iris CSS is a modern CSS framework focused on:

- **Modern-first**: Latest features and CSS best practices

### Core Principles

**Iris CSS Philosophy:**
- Modern CSS first - Embrace latest features and best practices
- Simplicity - Minimal API and intuitive usage
- Performance - Fast and efficient by design
- Accessibility - Built with accessibility in mind
- Flexibility - Works with any tech stack or framework

## Framework Architecture Preferences

When inspired by existing libraries or frameworks:
- **Adapt, don't clone** - Make it fit Iris CSS's context
- **Prefer classes over functions** when the pattern makes sense
- **Maintain Iris CSS's identity** - Don't blindly copy any framework
- **Learn from others' approaches** but justify differences

While Iris CSS shares similarities with frameworks:
- **Adapt, don't clone** - Make it fit Iris CSS's context
- **Improve where possible** - Learn from others' mistakes
- **Maintain identity** - Iris CSS has its own philosophy
- **Justify differences** - Explain why Iris CSS diverges

## Quick Project Reference

When in doubt:
- Look at similar existing patterns in Iris CSS
- Maintain consistency within the codebase
- Follow the framework's philosophy and principles
