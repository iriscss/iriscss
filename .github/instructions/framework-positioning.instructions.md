---
applyTo: "**"
---

# Framework Positioning

This file defines how Iris CSS positions itself relative to other CSS frameworks and provides context for meaningful comparisons.

## Key Framework Comparisons

When discussing Iris CSS in relation to other frameworks, focus on these most relevant comparisons:

### 1. Tailwind CSS
**What it is:** Utility-first CSS framework with extensive class-based styling  
**Market position:** Dominant leader in modern CSS frameworks  
**Key difference from Iris CSS:**
- Tailwind: Utility-first, requires many classes per element, build step required
- Iris CSS: Semantic-first with sensible defaults, minimal classes, works out of the box

**When to compare:** Build process requirements, development approach, learning curve

### 2. Bootstrap
**What it is:** Component-heavy framework with opinionated design system  
**Market position:** Long-standing industry standard, widely recognized  
**Key difference from Iris CSS:**
- Bootstrap: Heavy, opinionated, component-focused, includes JavaScript
- Iris CSS: Lightweight, flexible, modern CSS only, no JavaScript dependency

**When to compare:** Bundle size, customization, JavaScript requirements

### 3. Pico CSS
**What it is:** Minimal, semantic, classless CSS framework  
**Market position:** Modern lightweight alternative gaining traction  
**Key difference from Iris CSS:**
- Pico: Classless approach, limited customization
- Iris CSS: Balanced approach with both semantic HTML and optional utility classes

**When to compare:** Philosophy, simplicity, modern CSS approaches

### 4. Open Props
**What it is:** CSS custom properties (design tokens) library  
**Market position:** Modern, token-based approach  
**Key difference from Iris CSS:**
- Open Props: Design tokens only, bring your own structure
- Iris CSS: Complete framework with tokens, components, and utilities

**When to compare:** Custom properties strategy, modularity, design token approaches

### 5. Bulma
**What it is:** Pure CSS framework with no JavaScript  
**Market position:** Popular CSS-only framework  
**Key difference from Iris CSS:**
- Bulma: Class-heavy, older CSS techniques
- Iris CSS: Modern CSS features (custom properties, logical properties, etc.)

**When to compare:** CSS-only solutions, modern CSS adoption

## What Makes Iris CSS Different

### Core Differentiators

1. **Modern CSS First**
   - Uses latest CSS features (custom properties, logical properties, container queries)
   - No legacy browser support burden
   - Leverages native CSS capabilities over JavaScript

2. **Simplicity Without Sacrifice**
   - Minimal API surface
   - Sensible defaults that work out of the box
   - Progressive enhancement approach

3. **Performance by Design**
   - Small bundle size
   - No JavaScript runtime
   - Efficient CSS architecture

4. **Accessibility Built In**
   - ARIA support integrated
   - Focus management
   - Screen reader optimizations
   - Contrast and preference utilities

5. **Framework Agnostic**
   - Works with any tech stack
   - No build step required (but supports optimization)
   - Drop in and use

## Positioning Statements

Use these when describing Iris CSS:

**Elevator Pitch:**
"Iris CSS is a modern CSS framework focused on simplicity and performance, using the latest CSS features without JavaScript dependencies."

**vs. Utility-First (Tailwind):**
"While Tailwind requires many utility classes, Iris CSS provides sensible semantic defaults with optional utilities for customization."

**vs. Component Libraries (Bootstrap):**
"Unlike heavy component libraries, Iris CSS is lightweight and focuses on modern CSS capabilities rather than JavaScript-driven components."

**vs. Classless (Pico):**
"Iris CSS balances semantic HTML with optional utility classes, offering more flexibility than purely classless approaches."

**vs. Token Libraries (Open Props):**
"Iris CSS is a complete framework, not just design tokens - it includes structure, components, and utilities built on modern CSS."

## Framework Comparison Matrix

| Feature | Iris CSS | Tailwind | Bootstrap | Pico | Open Props | Bulma |
|---------|----------|----------|-----------|------|------------|-------|
| **Approach** | Semantic + Utilities | Utility-first | Component-heavy | Classless | Tokens only | Class-based |
| **JavaScript** | None | None | Required | None | None | None |
| **Build Required** | Optional | Yes | Optional | No | No | Optional |
| **Bundle Size** | Minimal | Large | Large | Minimal | Minimal | Medium |
| **Modern CSS** | ✓ | Partial | Limited | ✓ | ✓ | Limited |
| **Customization** | High | Very High | Medium | Low | Very High | High |
| **Learning Curve** | Low | Medium | Medium | Very Low | Low | Medium |

## When NOT to Compare

Avoid comparing Iris CSS to:
- **CSS-in-JS libraries** (Styled Components, Emotion) - Different paradigm entirely
- **UI component libraries** (Material UI, Ant Design) - JavaScript-heavy, framework-specific
- **CSS preprocessors** (Sass, Less) - Tools, not frameworks
- **CSS methodologies** (BEM, SMACSS) - Organizational approaches, not frameworks

## Messaging Guidelines

When discussing Iris CSS:
- **Emphasize modern CSS** - This is the core identity
- **Highlight simplicity** - Low barrier to entry
- **Showcase performance** - Small, fast, efficient
- **Demonstrate flexibility** - Works anywhere
- **Never claim Iris CSS is "better"** - Position it as different with specific strengths
- **Be honest about tradeoffs** - Every framework makes different choices

## Target Audience

Iris CSS is ideal for:
- Developers wanting modern CSS without complexity
- Projects prioritizing performance and bundle size
- Teams comfortable with latest CSS features
- Scenarios where JavaScript dependencies should be minimized
- Rapid prototyping with sensible defaults

Iris CSS may not be ideal for:
- Projects requiring IE11 or older browser support
- Teams heavily invested in utility-first workflows
- Applications needing extensive pre-built JavaScript components
- Projects requiring battle-tested, enterprise-proven solutions (yet)

## References

When discussing frameworks, link to official sources:
- Tailwind CSS: https://tailwindcss.com
- Bootstrap: https://getbootstrap.com
- Pico CSS: https://picocss.com
- Open Props: https://open-props.style
- Bulma: https://bulma.io
