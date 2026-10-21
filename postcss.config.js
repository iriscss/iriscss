const lightDark = require("@csstools/postcss-light-dark-function");
const nesting = require("postcss-nesting");
const autoprefixer = require("autoprefixer");

const THEME_ROOTS = ":where([data-theme], .light, .dark)";
const LIGHT_DARK = "(color: light-dark(";

const variablesOnly = (rule) =>
  rule.nodes.every((node) => node.type !== "decl" || node.prop.startsWith("--"));

// Browsers with light-dark() resolve it where a color is used, so theme
// variables only need :root, and a user's :root override reaches nested
// themes. Browsers without it need the variables again on each theme root.
// This splits that copy off. finishThemeRoots keeps it from modern browsers.
const splitThemeRoots = {
  postcssPlugin: "iris-split-theme-roots",
  Once(root) {
    const rules = [];
    root.walkRules((rule) => {
      if (variablesOnly(rule) && rule.selectors.includes(THEME_ROOTS)) {
        rules.push(rule);
      }
    });
    for (const rule of rules) {
      rule.after(rule.clone({ selectors: [THEME_ROOTS] }));
      rule.selectors = rule.selectors.filter((s) => s !== THEME_ROOTS);
    }
  },
};

// Runs after nesting. The fallback plugin redeclares every variable on all
// descendants (`:is(...) *`), which hides a user's :root override, and copies
// theme root variables for browsers with light-dark(). Both go. The theme
// root copies that are left only apply where light-dark() is missing.
const finishThemeRoots = {
  postcssPlugin: "iris-finish-theme-roots",
  OnceExit(root, { AtRule }) {
    const inSupports = (node, test) => {
      for (let p = node.parent; p; p = p.parent) {
        if (p.type === "atrule" && p.name === "supports" && test(p.params)) {
          return true;
        }
      }
      return false;
    };
    const hasLightDark = (params) => params.includes(LIGHT_DARK);
    const wrap = [];
    root.walkRules((rule) => {
      const fallbackOnly = inSupports(rule, (p) => /^not\b/.test(p) && hasLightDark(p));
      const modernOnly = inSupports(rule, (p) => !/^not\b/.test(p) && hasLightDark(p));
      if (fallbackOnly && /(^|\s)\*$/.test(rule.selector.trim())) {
        rule.remove();
      } else if (rule.selector === THEME_ROOTS && variablesOnly(rule)) {
        if (modernOnly) rule.remove();
        else if (!fallbackOnly) wrap.push(rule);
      }
    });
    for (const rule of wrap) {
      const supports = new AtRule({
        name: "supports",
        params: "not (color: light-dark(tan, tan))",
      });
      rule.replaceWith(supports);
      supports.append(rule);
    }
    root.walkAtRules("supports", (atRule) => {
      if (!atRule.nodes?.length) atRule.remove();
    });
  },
};

module.exports = {
  map: false,
  plugins: [
    splitThemeRoots,
    // A color-scheme toggle fallback for browsers without light-dark()
    lightDark(),
    // The fallback above uses nesting, which older browsers lack
    nesting(),
    finishThemeRoots,
    autoprefixer({ cascade: false }),
  ],
};
