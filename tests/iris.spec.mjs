// Regression tests for the built framework. Each test renders a small page
// with dist/iris.css inlined, so the CSSOM is readable, and checks computed
// styles. Run `npm run build` first.
import { test, expect, chromium, firefox, webkit } from "@playwright/test";
import { readFileSync } from "node:fs";
import postcss from "postcss";

const css = readFileSync(new URL("../dist/iris.css", import.meta.url), "utf8");

async function render(page, body, { dir = "ltr", head = "" } = {}) {
  await page.setContent(
    `<!doctype html><html lang="en" dir="${dir}"><head><meta charset="utf-8">` +
      `<style>${css}</style>${head}</head><body>${body}</body></html>`,
  );
}

function style(page, selector, property, pseudo = null) {
  return page
    .locator(selector)
    .first()
    .evaluate(
      (el, [prop, ps]) => getComputedStyle(el, ps)[prop],
      [property, pseudo],
    );
}

const px = (value) => parseFloat(value);

// WCAG contrast of a color property against what is painted behind the
// element, with transparent layers composited, or against white paper.
async function contrast(page, selector, property, against = "background") {
  return page
    .locator(selector)
    .first()
    .evaluate(
      (el, [prop, mode]) => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const rgba = (value) => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = "#000";
          ctx.fillStyle = value;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2], d[3] / 255];
        };
        const over = (fg, bg) =>
          fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]));
        const behind = (start) => {
          const layers = [];
          for (let e = start; e; e = e.parentElement) {
            const c = rgba(getComputedStyle(e).backgroundColor);
            if (c[3] > 0) layers.push(c);
            if (c[3] === 1) break;
          }
          let result = [255, 255, 255];
          for (const layer of layers.reverse()) result = over(layer, result);
          return result;
        };
        const lum = (c) => {
          const f = (v) => {
            v /= 255;
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
        };
        const bg =
          mode === "paper"
            ? [255, 255, 255]
            : mode === "parent"
              ? behind(el.parentElement)
              : behind(el);
        const fg = over(rgba(getComputedStyle(el)[prop]), bg);
        const [a, b] = [lum(fg), lum(bg)];
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      },
      [property, against],
    );
}

test.describe("cascade layers", () => {
  test("hero type and margins win over element rules", async ({ page }) => {
    await render(
      page,
      `<section class="hero"><h1>Hero</h1><p>Last</p></section><h1 id="plain">Plain</h1>`,
    );
    expect(px(await style(page, ".hero h1", "fontSize"))).toBeGreaterThan(
      px(await style(page, "#plain", "fontSize")),
    );
    expect(await style(page, ".hero p", "marginBottom")).toBe("0px");
  });

  test("layout primitives and menus remove child margins", async ({ page }) => {
    await render(
      page,
      `<div class="stack"><p>a</p><p>b</p></div>
       <menu><li><input id="m"></li><li><button>Go</button></li></menu>`,
    );
    expect(await style(page, ".stack p", "marginBottom")).toBe("0px");
    expect(await style(page, "#m", "marginBottom")).toBe("0px");
    expect(await style(page, "menu button", "marginBottom")).toBe("0px");
  });

  test("user CSS overrides form padding, even on invalid fields", async ({
    page,
  }) => {
    await render(page, `<input id="i" aria-invalid="true" class="mine">`, {
      head: `<style>.mine { padding: 0; }</style>`,
    });
    expect(await style(page, "#i", "paddingRight")).toBe("0px");
  });
});

test.describe("elements", () => {
  test("hidden until-found stays findable", async ({ page }) => {
    await render(
      page,
      `<div hidden="until-found">Find me</div><div hidden>x</div>`,
    );
    expect(await style(page, "[hidden='until-found']", "display")).not.toBe(
      "none",
    );
    expect(await style(page, "[hidden='']", "display")).toBe("none");
  });

  test("lists in an aside keep their markers", async ({ page }) => {
    await render(
      page,
      `<aside><ul><li>item</li></ul><nav><ul><li>x</li></ul></nav></aside>`,
    );
    expect(await style(page, "aside > ul li", "display")).toBe("list-item");
    expect(await style(page, "aside nav li", "display")).toBe("block");
  });

  test("pre.light reaches the code inside", async ({ page }) => {
    await render(page, `<pre class="light"><code>x</code></pre>`);
    expect(await style(page, "pre code", "backgroundColor")).toBe(
      "rgba(0, 0, 0, 0)",
    );
  });

  test("a label after a checkbox does not restyle later labels", async ({
    page,
  }) => {
    await render(
      page,
      `<form><input type="checkbox" id="c"><label for="c">Check</label>
       <label id="later" for="e">Email</label><input id="e"></form>`,
    );
    expect(await style(page, "#later", "display")).toBe("block");
  });

  test("radios in a group with no choice stay empty", async ({ page }) => {
    await render(
      page,
      `<input type="radio" name="a"><input type="radio" name="a">
       <input type="checkbox" id="mixed">`,
    );
    const empty = await style(page, "#mixed", "backgroundColor");
    expect(await style(page, "[type='radio']", "backgroundColor")).toBe(empty);
    // A mixed checkbox still fills
    await page.evaluate(() => {
      document.getElementById("mixed").indeterminate = true;
    });
    await expect
      .poll(() => style(page, "#mixed", "backgroundColor"))
      .not.toBe(empty);
  });

  test("an empty busy element centers its spinner, not its text", async ({
    page,
  }) => {
    await render(page, `<div aria-busy="true" role="status"></div>`);
    expect(await style(page, "div", "textAlign")).toBe("start");
    expect(await style(page, "div", "display", "::before")).toBe("block");
    const [before, box] = await page
      .locator("div")
      .evaluate((el) => [
        getComputedStyle(el, "::before").marginInlineStart,
        el.getBoundingClientRect().width,
      ]);
    expect(px(before)).toBeGreaterThan(box / 2 - 20);
  });

  test("a fieldset with wide content stays inside a narrow parent", async ({
    page,
  }) => {
    await render(
      page,
      `<div id="box" style="width: 300px"><fieldset><pre>${"x".repeat(120)}</pre></fieldset></div>`,
    );
    const [grid, fieldset] = await page.evaluate(() => [
      document.getElementById("box").getBoundingClientRect().right,
      document.querySelector("fieldset").getBoundingClientRect().right,
    ]);
    expect(fieldset).toBeLessThanOrEqual(grid);
  });

  test("controls in a disabled label fade once", async ({ page }) => {
    await render(
      page,
      `<label aria-disabled="true">Size <select disabled><option>S</option></select></label>`,
    );
    expect(await style(page, "label", "opacity")).toBe("0.5");
    expect(await style(page, "select", "opacity")).toBe("1");
  });

  test("an indeterminate progress bar hides its value part", async ({
    page,
  }) => {
    await render(
      page,
      `<progress id="p"></progress><progress value="30" max="100"></progress>`,
    );
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.getElementById("p")).getPropertyValue(
          "--_value",
        ),
      ),
    ).toBe("transparent");
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.querySelector("[value]")).getPropertyValue(
          "--_value",
        ),
      ),
    ).not.toBe("transparent");
  });

  test("a combobox keeps the text cursor", async ({ page }) => {
    await render(page, `<input role="combobox" aria-controls="list">`);
    expect(await style(page, "input", "cursor")).not.toBe("pointer");
  });

  test("a busy container still wraps its text", async ({ page }) => {
    await render(
      page,
      `<article aria-busy="true"><p>Text</p></article><button aria-busy="true">Save</button>`,
    );
    expect(await style(page, "article", "whiteSpace")).toBe("normal");
    expect(await style(page, "button", "whiteSpace")).toBe("nowrap");
  });

  test("a busy button takes aria-disabled for its blocked look", async ({
    page,
  }) => {
    await render(
      page,
      `<button id="busy" aria-busy="true">Save</button>
       <button id="blocked" aria-busy="true" aria-disabled="true">Save</button>`,
    );
    // aria-busy alone blocks nothing, so it must not pretend to
    expect(await style(page, "#busy", "pointerEvents")).toBe("auto");
    expect(await style(page, "#blocked", "opacity")).toBe("0.5");
    expect(await style(page, "#blocked", "cursor")).toBe("not-allowed");
    expect(await style(page, "#blocked", "maskImage", "::before")).toContain(
      "url(",
    );
  });

  test(".line-clamp clamps with an ellipsis", async ({ page }) => {
    await render(page, `<p class="line-clamp">text</p>`);
    expect(await style(page, "p", "webkitLineClamp")).toBe("3");
  });

  test("progress and meter .rounded rules survive parsing", async ({
    page,
  }) => {
    await render(page, "");
    const selectors = await page.evaluate(() => {
      const found = [];
      const walk = (rules) => {
        for (const rule of rules) {
          if (rule.cssRules) walk(rule.cssRules);
          if (rule.selectorText) found.push(rule.selectorText);
        }
      };
      for (const sheet of document.styleSheets) walk(sheet.cssRules);
      return found.join("\n");
    });
    // Progress bar parts inherit the corners, so only meter needs these
    expect(selectors).toContain("meter.rounded::-webkit-meter-bar");
    expect(selectors).toContain("meter.square::-webkit-meter-bar");
  });
});

test.describe("buttons and forms", () => {
  test("button type inputs look like buttons", async ({ page }) => {
    await render(
      page,
      `<input type="submit" class="primary" value="Go"><button class="primary">Go</button>`,
    );
    expect(await style(page, "input", "backgroundColor")).toBe(
      await style(page, "button", "backgroundColor"),
    );
  });

  test("fields keep their spacing and helper text sits below", async ({
    page,
  }) => {
    await render(
      page,
      `<input id="a"><small id="h">Help</small>
       <label id="l">Email <input type="email"></label><small id="lh">Help</small>`,
    );
    expect(px(await style(page, "#a", "marginBottom"))).toBeGreaterThan(0);
    const [field, help] = await page.evaluate(() =>
      ["a", "h"].map((id) =>
        document.getElementById(id).getBoundingClientRect(),
      ),
    );
    expect(help.top).toBeGreaterThanOrEqual(field.bottom);
    expect(await style(page, "#lh", "display")).toBe("block");
  });

  test("submit buttons are not full width by default", async ({ page }) => {
    await render(
      page,
      `<form><button>One</button><button type="submit">Two</button></form>`,
    );
    const widths = await page
      .locator("button")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
    expect(widths[1]).toBeLessThan(400);
    expect(Math.abs(widths[0] - widths[1])).toBeLessThan(20);
  });

  test("aria-disabled buttons look disabled", async ({ page }) => {
    await render(page, `<button aria-disabled="true">Off</button>`);
    expect(await style(page, "button", "opacity")).toBe("0.5");
  });

  test("a pressed toggle keeps the current look, an unpressed one rests", async ({
    page,
  }) => {
    for (const color of ["", "primary"]) {
      await render(
        page,
        `<button class="${color}" id="rest">A</button>
         <button class="${color}" id="current" aria-current="true">B</button>
         <button class="${color}" id="on" aria-pressed="true">C</button>
         <button class="${color}" id="off" aria-pressed="false">D</button>`,
      );
      const background = (id) => style(page, `#${id}`, "backgroundColor");
      expect(await background("on")).toBe(await background("current"));
      expect(await background("on")).not.toBe(await background("rest"));
      expect(await background("off")).toBe(await background("rest"));
    }
  });

  test("readonly fields show keyboard focus", async ({ page }) => {
    await render(page, `<button>Before</button><input readonly value="x">`);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    expect(await style(page, "input", "outlineStyle")).toBe("solid");
  });

  test("summaries show keyboard focus, mouse focus does not", async ({
    page,
  }) => {
    await render(
      page,
      `<button>Before</button>
       <details><summary role="button">Button</summary><p>a</p></details>
       <details><summary>Plain</summary><p>b</p></details>`,
    );
    for (const summary of ["summary[role]", "summary:not([role])"]) {
      await page.focus("button");
      while (
        !(await page
          .locator(summary)
          .evaluate((el) => el === document.activeElement))
      ) {
        await page.keyboard.press("Tab");
      }
      expect(await style(page, summary, "outlineStyle")).toBe("solid");
      // A click keeps :focus-visible on an element that already has it
      await page.evaluate(() => document.activeElement.blur());
      await page.click(summary);
      expect(await style(page, summary, "outlineStyle")).toBe("none");
    }
  });

  test("size classes shrink invalid fields and sized groups", async ({
    page,
  }) => {
    await render(
      page,
      `<input id="n" aria-invalid="true"><input id="s" class="small" aria-invalid="true">
       <div class="group small"><input id="g"><button>Go</button></div>`,
    );
    const normal = px(await style(page, "#n", "paddingLeft"));
    expect(px(await style(page, "#s", "paddingLeft"))).toBeLessThan(normal);
    expect(px(await style(page, "#g", "paddingLeft"))).toBeLessThan(normal);
  });

  test("right to left fields mirror their padding", async ({ page }) => {
    await render(
      page,
      `<select class="small"><option>a</option></select><input type="file">`,
      { dir: "rtl" },
    );
    expect(px(await style(page, "select", "paddingLeft"))).toBeGreaterThan(
      px(await style(page, "select", "paddingRight")),
    );
    expect(await style(page, "[type='file']", "marginLeft")).toBe("0px");
  });
});

test.describe("components", () => {
  test("a color class fills a card band and its heading stays readable", async ({
    page,
  }) => {
    for (const scheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme: scheme });
      for (const color of ["primary", "warning", "danger"]) {
        await render(
          page,
          `<article class="card">
             <header id="plain"><h3>Plain</h3></header>
             <p>Body</p>
             <footer class="${color}" id="band"><h3>Title</h3><a href="#">Link</a></footer>
           </article>
           <dialog open><header class="${color}" id="dialog-band"><h3>Dialog</h3></header></dialog>`,
        );
        const [plain, band, dialogBand, variant] = await page.evaluate(() =>
          ["#plain", "#band", "#dialog-band"]
            .map(
              (sel) =>
                getComputedStyle(document.querySelector(sel)).backgroundColor,
            )
            .concat(
              getComputedStyle(
                document.querySelector("#band"),
              ).getPropertyValue("--i-variant"),
            ),
        );
        expect(band).not.toBe(plain);
        expect(dialogBand).toBe(band);
        expect(variant.trim()).not.toBe("");
        expect(
          await contrast(page, "#band h3", "color"),
        ).toBeGreaterThanOrEqual(4.5);
        expect(await contrast(page, "#band a", "color")).toBeGreaterThanOrEqual(
          4.5,
        );
        expect(
          await contrast(page, "#dialog-band h3", "color"),
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  test("an alert close button sits at the end with its icon", async ({
    page,
  }) => {
    for (const dir of ["ltr", "rtl"]) {
      await render(
        page,
        `<div class="alert danger" role="alert" style="width: 20rem">
           <button class="close" aria-label="Close"></button>
           <p>A message long enough to wrap onto a second line of the alert.</p>
         </div>`,
        { dir },
      );
      const [alert, close, text] = await Promise.all(
        [".alert", ".close", ".alert p"].map((sel) =>
          page
            .locator(sel)
            .evaluate((el) => el.getBoundingClientRect().toJSON()),
        ),
      );
      expect(await style(page, ".close", "maskImage", "::before")).toContain(
        "url(",
      );
      expect(await style(page, ".close", "backgroundColor")).toBe(
        "rgba(0, 0, 0, 0)",
      );
      if (dir === "ltr") {
        expect(alert.right - close.right).toBeLessThan(24);
        expect(close.left).toBeGreaterThan(text.left + 200);
      } else {
        expect(close.left - alert.left).toBeLessThan(24);
        expect(close.right).toBeLessThan(text.right - 200);
      }
      expect(close.top).toBeLessThan(text.top + 8);
    }
  });

  test("a narrow navbar keeps its toggle next to a list after the menu", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 400, height: 600 });
    await render(
      page,
      `<header class="navbar"><nav aria-label="Main">
         <ul><li><a href="#">Brand</a></li></ul>
         <button class="nav-toggle" popovertarget="m" aria-label="Menu"></button>
         <ul id="m" popover><li><a href="#">Docs</a></li></ul>
         <ul id="icons"><li><a href="#">GH</a></li></ul>
       </nav></header>`,
    );
    const [toggle, icons] = await Promise.all(
      [".nav-toggle", "#icons"].map((sel) =>
        page.locator(sel).evaluate((el) => el.getBoundingClientRect().toJSON()),
      ),
    );
    expect(icons.left - toggle.right).toBeLessThan(40);
  });

  test("a nav with a toggle keeps its width in a flex row", async ({
    page,
  }) => {
    await render(
      page,
      `<header style="display: flex"><a href="#">Logo</a>
       <nav><button class="nav-toggle" popovertarget="m" aria-label="Menu"></button>
       <ul id="m" popover><li><a href="#">One</a></li></ul></nav></header>`,
    );
    const width = await page
      .locator("nav")
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(100);
  });

  test("a heading with a color class is readable", async ({ page }) => {
    for (const scheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme: scheme });
      await render(
        page,
        `<h2 class="danger">Danger</h2><h2 class="success">Success</h2>`,
      );
      expect(await contrast(page, "h2.danger", "color")).toBeGreaterThanOrEqual(
        4.5,
      );
      expect(
        await contrast(page, "h2.success", "color"),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("carousel buttons sit on opposite edges", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 400 });
    for (const dir of ["ltr", "rtl"]) {
      await render(
        page,
        `<div class="carousel"><p>One</p><p>Two</p><p>Three</p></div>`,
        { dir },
      );
      test.skip(
        !(await page.evaluate(() =>
          CSS.supports("selector(::scroll-button(*))"),
        )),
        "scroll buttons are not supported in this browser",
      );
      const [start, end] = await page
        .locator(".carousel")
        .evaluate((el) =>
          ["inline-start", "inline-end"].map((side) =>
            parseFloat(getComputedStyle(el, `::scroll-button(${side})`).left),
          ),
        );
      if (dir === "ltr") expect(start).toBeLessThan(end - 400);
      else expect(end).toBeLessThan(start - 400);
    }
  });
});

test.describe("accordion", () => {
  const chevron = (page) =>
    page.evaluate(() => {
      const summary = document.querySelector("summary");
      const s = getComputedStyle(summary, "::after");
      return {
        rotate: s.rotate,
        end: s.insetInlineEnd,
        side: s.right === s.insetInlineEnd ? "right" : "left",
      };
    });

  test("the chevron sits at the end and turns while open", async ({ page }) => {
    for (const dir of ["ltr", "rtl"]) {
      await render(
        page,
        `<details><summary>Question</summary><p>Answer</p></details>`,
        { dir },
      );
      const closed = await chevron(page);
      expect(closed.rotate).toBe("none");
      expect(closed.side).toBe(dir === "ltr" ? "right" : "left");
      await page.click("summary");
      await expect
        .poll(async () => (await chevron(page)).rotate)
        .toBe("180deg");
    }
  });

  test("the gap under an open summary slides with the content", async ({
    page,
  }) => {
    await render(
      page,
      `<details open><summary>Question</summary><p>Answer</p></details>`,
    );
    expect(await style(page, "summary", "transitionProperty")).toContain(
      "margin-block-end",
    );
    expect(px(await style(page, "summary", "marginBlockEnd"))).toBeGreaterThan(
      0,
    );
  });

  test("a button summary keeps its chevron inside the padding", async ({
    page,
  }) => {
    await render(
      page,
      `<details><summary role="button">Options</summary><p>a</p></details>`,
    );
    const [end, padding] = await page.evaluate(() => {
      const summary = document.querySelector("summary");
      return [
        getComputedStyle(summary, "::after").insetInlineEnd,
        getComputedStyle(summary).paddingInlineEnd,
      ];
    });
    expect(px(end)).toBeGreaterThan(0);
    expect(px(padding)).toBeGreaterThan(px(end));
  });
});

test.describe("user preferences", () => {
  test("reduced motion makes transitions 1ms, spinners keep turning", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(page, `<button>Save</button><span aria-busy="true"></span>`);
    expect(await style(page, "button", "transitionDuration")).toContain(
      "0.001s",
    );
    expect(await style(page, "span", "animationDuration", "::before")).not.toBe(
      "0.001s",
    );
    expect(await style(page, "html", "scrollBehavior")).toBe("auto");
  });

  test("reduced transparency drops the modal blur", () => {
    let blur = null;
    postcss.parse(css).walkAtRules("media", (rule) => {
      if (!rule.params.includes("prefers-reduced-transparency: reduce")) return;
      rule.walkDecls("--i-modal-overlay-backdrop-filter", (decl) => {
        blur = decl.value;
      });
    });
    expect(blur).toBe("none");
  });
});

test.describe("dropdown", () => {
  const menu = (id) =>
    `<ul id="${id}" popover class="dropdown">
       <li><a href="#">Profile</a></li><li><a href="#">Sign out</a></li></ul>`;
  const box = (page, selector) =>
    page
      .locator(selector)
      .evaluate((el) => el.getBoundingClientRect().toJSON());

  test("opens below its button, at least as wide", async ({ page }) => {
    await render(
      page,
      `<main><button popovertarget="m" style="width: 14rem">Account</button>${menu("m")}</main>`,
    );
    await page.click("button");
    await expect(page.locator("#m")).toBeVisible();
    const [button, list] = [await box(page, "button"), await box(page, "#m")];
    expect(list.top).toBeGreaterThanOrEqual(button.bottom);
    expect(list.top - button.bottom).toBeLessThan(4);
    expect(Math.round(list.left)).toBe(Math.round(button.left));
    expect(list.width).toBeGreaterThanOrEqual(button.width);
  });

  test("flips above its button near the bottom of the screen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 400 });
    await render(
      page,
      `<main style="padding-top: 340px"><button popovertarget="m">Account</button>${menu("m")}</main>`,
    );
    await page.click("button");
    const [button, list] = [await box(page, "button"), await box(page, "#m")];
    expect(list.bottom).toBeLessThanOrEqual(button.top);
  });

  test("closes with Esc and with a click outside that still lands", async ({
    page,
  }) => {
    await render(
      page,
      `<main><button popovertarget="m">Account</button>${menu("m")}
       <button id="other" onclick="this.dataset.clicked = 1">Other</button></main>`,
    );
    await page.click("button");
    await page.keyboard.press("Escape");
    await expect(page.locator("#m")).toBeHidden();
    await page.click("button");
    await page.click("#other");
    await expect(page.locator("#m")).toBeHidden();
    expect(await page.locator("#other").getAttribute("data-clicked")).toBe("1");
  });

  test("command buttons fill their item without the button look", async ({
    page,
  }) => {
    await render(
      page,
      `<main><button popovertarget="m">File</button>
       <ul id="m" popover class="dropdown">
         <li><a href="#">Open</a></li>
         <li><button id="save">Save</button></li>
       </ul></main>`,
    );
    await page.click("button");
    const [item, link, button] = await Promise.all(
      ["#m li:has(#save)", "#m a", "#save"].map((sel) => box(page, sel)),
    );
    expect(Math.round(button.width)).toBe(Math.round(link.width));
    expect(button.width).toBeGreaterThanOrEqual(item.width);
    expect(await style(page, "#save", "backgroundColor")).toBe(
      "rgba(0, 0, 0, 0)",
    );
    expect(await style(page, "#save", "borderTopWidth")).toBe("0px");
    expect(await style(page, "#save", "boxShadow")).toBe("none");
    await page.hover("#save");
    // Buttons transition their background, so wait for it to settle
    await expect
      .poll(() => style(page, "#save", "backgroundColor"))
      .not.toBe("rgba(0, 0, 0, 0)");
    expect(await style(page, "#save", "content", "::after")).toBe("none");
  });

  test("a separator item is a thin line across the menu", async ({ page }) => {
    await render(
      page,
      `<main><button popovertarget="m">File</button>
       <ul id="m" popover class="dropdown">
         <li><a href="#">Open</a></li><li><hr></li><li><a href="#">Exit</a></li>
       </ul></main>`,
    );
    await page.click("button");
    const [list, rule] = [await box(page, "#m"), await box(page, "#m hr")];
    expect(list.width - rule.width).toBeLessThan(4);
    expect(await style(page, "#m hr", "borderTopWidth")).not.toBe("0px");
    expect(px(await style(page, "#m hr", "marginTop"))).toBeLessThan(8);
  });

  test("the button shows a chevron that turns when open", async ({ page }) => {
    await render(
      page,
      `<main><button popovertarget="m">Account</button>${menu("m")}</main>`,
    );
    expect(await style(page, "button", "maskImage", "::after")).toContain(
      "url(",
    );
    expect(await style(page, "button", "transform", "::after")).toBe("none");
    await page.click("button");
    await expect(page.locator("#m")).toBeVisible();
    expect(await style(page, "button", "transform", "::after")).not.toBe(
      "none",
    );
  });

  test(".select looks like a select and shows validation", async ({ page }) => {
    await render(
      page,
      `<main><label>Size<button class="select" popovertarget="m">Choose</button></label>${menu("m")}
       <select><option>One</option></select>
       <button class="select" popovertarget="n" aria-invalid="true">Choose</button>${menu("n")}</main>`,
    );
    const select = await page
      .locator("select")
      .evaluate((el) => getComputedStyle(el).borderColor);
    expect(await style(page, "label .select", "borderColor")).toBe(select);
    expect(await style(page, "label .select", "textAlign")).toBe("start");
    expect(await style(page, "label .select", "backgroundImage")).toContain(
      "url(",
    );
    expect(await style(page, "label .select", "content", "::after")).toBe(
      "none",
    );
    expect(await style(page, ".select[aria-invalid]", "borderColor")).not.toBe(
      select,
    );
  });

  test("a plain button in a nav opens its menu like a link", async ({
    page,
  }) => {
    await render(
      page,
      `<nav><ul><li><button popovertarget="m">Products</button>${menu("m")}</li></ul></nav>`,
    );
    expect(await style(page, "nav button", "backgroundColor")).toBe(
      "rgba(0, 0, 0, 0)",
    );
    expect(await style(page, "nav button", "borderColor")).toBe(
      "rgba(0, 0, 0, 0)",
    );
    await page.click("nav button");
    const items = await page
      .locator("#m li")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
    expect(items[1]).toBeGreaterThan(items[0]);
  });

  test("only a button before a menu gets a chevron", async ({ page }) => {
    await render(
      page,
      `<main><p>Text</p>${menu("m")}<label>Size <button class="select" popovertarget="n">Choose</button></label>${menu("n")}</main>`,
    );
    expect(await style(page, "p", "content", "::after")).toBe("none");
    expect(await style(page, "label", "content", "::after")).toBe("none");
  });
});

test.describe("modal", () => {
  const dialog = (id, attributes = "") =>
    `<dialog id="${id}" ${attributes}><header><h3>Title</h3></header>
       <p>Body</p><footer><button>OK</button></footer></dialog>`;
  // Reduced motion leaves 1ms transitions, so wait for them to end
  const open = async (page, id) => {
    await page.evaluate((id) => document.getElementById(id).showModal(), id);
    await page.waitForFunction(() => document.getAnimations().length === 0);
  };
  const box = (page, selector) =>
    page
      .locator(selector)
      .evaluate((el) => el.getBoundingClientRect().toJSON());

  // Headless WebKit only advances transitions while it paints frames, so keep
  // them short
  test.beforeEach(({ page }) => page.emulateMedia({ reducedMotion: "reduce" }));

  test("the dialog is a centered card over a dimmed page", async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await render(
      page,
      `<main style="height: 3000px"><article class="card">Card</article>${dialog("m")}</main>`,
    );
    await open(page, "m");
    expect(await style(page, "dialog", "backgroundColor")).toBe(
      await style(page, ".card", "backgroundColor"),
    );
    await expect
      .poll(() => style(page, "dialog", "backgroundColor", "::backdrop"))
      .not.toBe("rgba(0, 0, 0, 0)");
    const { left, right, top, bottom } = await box(page, "dialog");
    expect(Math.abs(left - (800 - right))).toBeLessThan(2);
    expect(Math.abs(top - (600 - bottom))).toBeLessThan(2);
    expect(await style(page, "html", "overflowY")).toBe("hidden");
  });

  test("closedby=any closes it on a click outside", async ({ page }) => {
    await render(page, dialog("m", 'closedby="any"'));
    test.skip(
      !(await page.evaluate(() => "closedBy" in HTMLDialogElement.prototype)),
      "closedby is not supported in this browser",
    );
    await open(page, "m");
    await page.mouse.click(5, 5);
    await expect(page.locator("dialog")).toBeHidden();
  });

  test("drawers sit on their edge, mirrored in right to left", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    for (const dir of ["ltr", "rtl"]) {
      await render(
        page,
        dialog("e", 'class="drawer"') +
          dialog("s", 'class="drawer start"') +
          dialog("b", 'class="drawer bottom"'),
        { dir },
      );
      for (const id of ["e", "s", "b"]) await open(page, id);
      const [end, start, bottom] = [
        await box(page, "#e"),
        await box(page, "#s"),
        await box(page, "#b"),
      ];
      const [endEdge, startEdge] =
        dir === "ltr" ? [end.right, start.left] : [end.left, start.right];
      expect(Math.round(endEdge)).toBe(dir === "ltr" ? 800 : 0);
      expect(Math.round(startEdge)).toBe(dir === "ltr" ? 0 : 800);
      expect(Math.round(end.height)).toBe(600);
      expect(Math.round(bottom.bottom)).toBe(600);
      expect(bottom.height).toBeLessThan(300);
    }
  });

  test("a drawer slides from the side of its nearest dir", async ({ page }) => {
    await render(
      page,
      dialog("r", 'class="drawer"') +
        `<div dir="ltr">${dialog("l", 'class="drawer"')}</div>`,
      { dir: "rtl" },
    );
    // A closed dialog has no box, so its slide is measured on a visible probe
    const slide = (id) =>
      page.locator(`#${id}`).evaluate((el) => {
        const probe = document.createElement("div");
        probe.style.cssText = `width: 100px; transform: ${getComputedStyle(el).getPropertyValue("--_from")}`;
        document.body.append(probe);
        const x = new DOMMatrix(getComputedStyle(probe).transform).m41;
        probe.remove();
        return x;
      });
    expect(await slide("r")).toBe(-100);
    expect(await slide("l")).toBe(100);
  });
});

test.describe("tooltips and nav", () => {
  test("tooltip text stays readable by screen readers", async ({ page }) => {
    await render(
      page,
      `<span data-tooltip="CSS custom properties">variables</span>`,
    );
    expect(await page.locator("body").ariaSnapshot()).toContain(
      "CSS custom properties",
    );
  });

  test("a tooltip leaves the spinner of a busy button alone", async ({
    page,
  }) => {
    await render(
      page,
      `<button aria-busy="true" data-tooltip="Saving">Save</button>`,
    );
    expect(await style(page, "button", "position", "::before")).not.toBe(
      "absolute",
    );
    expect(await style(page, "button", "opacity", "::before")).toBe("1");
  });

  test("a tooltip leaves the chevron of a dropdown button alone", async ({
    page,
  }) => {
    await render(
      page,
      `<button popovertarget="m" data-tooltip="Account">Me</button>
       <ul id="m" popover class="dropdown"><li>Profile</li></ul>`,
    );
    expect(await style(page, "button", "position", "::after")).not.toBe(
      "absolute",
    );
    expect(await style(page, "button", "opacity", "::after")).toBe("1");
  });

  test("a hint popover tooltip anchors above and closes with Esc", async ({
    page,
  }) => {
    await render(
      page,
      `<p style="padding: 6rem"><button interestfor="tip">Save</button></p>
       <div id="tip" popover="hint">Save file</div>`,
    );
    test.skip(
      !(await page.evaluate(
        () => "interestForElement" in HTMLButtonElement.prototype,
      )),
      "interestfor is not supported in this browser",
    );
    await page.hover("button");
    await expect(page.locator("#tip")).toBeVisible();
    const [button, tip] = await page.evaluate(() =>
      ["button", "#tip"].map((s) =>
        document.querySelector(s).getBoundingClientRect(),
      ),
    );
    expect(tip.bottom).toBeLessThanOrEqual(button.top);
    await page.keyboard.press("Escape");
    await expect(page.locator("#tip")).toBeHidden();
  });

  test("breadcrumb dividers point the reading way in right to left", async ({
    page,
  }) => {
    for (const [dir, expected] of [
      ["ltr", ">"],
      ["rtl", "<"],
    ]) {
      await render(
        page,
        `<nav class="breadcrumb"><ol><li><a href="#">A</a></li><li>B</li></ol></nav>`,
        { dir },
      );
      // In rtl text the browser mirrors >, and scale flips it again. The
      // website RTL baseline checks the pixels.
      const shown = await page.locator("li + li").evaluate((li) => {
        const s = getComputedStyle(li, "::before");
        const bidiMirrored = s.direction === "rtl";
        const flipped = s.scale === "-1 1";
        return bidiMirrored !== flipped ? "<" : ">";
      });
      expect(shown).toBe(expected);
    }
  });

  test("only the nav's own lists form a row", async ({ page }) => {
    await render(
      page,
      `<nav><ul id="top"><li>Docs<ul id="sub"><li>One</li><li>Two</li></ul></li>
       <li><a href="#">Blog</a></li></ul></nav>`,
    );
    expect(await style(page, "#top", "display")).toBe("flex");
    expect(await style(page, "#sub", "display")).toBe("block");
    expect(await style(page, "#sub li", "display")).toBe("list-item");
  });

  test("a search field in a nav keeps room for its icon", async ({ page }) => {
    await render(page, `<nav><ul><li><input type="search"></li></ul></nav>`);
    expect(px(await style(page, "input", "paddingLeft"))).toBeGreaterThan(30);
  });
});

test.describe("sidenav", () => {
  const menu = `<nav class="sidenav" aria-label="Docs">
    <ul><li><a id="top" href="#">All topics</a></li></ul>
    <details id="group">
      <summary>Components</summary>
      <ul>
        <li><a id="plain" href="#">Alert</a></li>
        <li><a id="current" href="#" aria-current="page">Card</a></li>
        <li><details id="nested"><summary>Forms</summary>
          <ul><li><a id="deep" href="#" aria-current="page">Input</a></li></ul>
        </details></li>
      </ul>
    </details>
    <details id="closed"><summary>Layout</summary>
      <ul><li><a href="#" aria-current="page">Grid</a></li></ul>
    </details>
    <details id="other"><summary>Helpers</summary>
      <ul><li><a href="#">Stack</a></li></ul>
    </details>
    <h2 id="label">Resources</h2>
    <ul id="static"><li><a href="#">Changelog</a></li><li><a href="#">License</a></li></ul>
  </nav>`;

  const supportsDetailsContent = (page) =>
    page.evaluate(() => CSS.supports("selector(::details-content)"));

  test("nested lists indent and draw a guide line", async ({ page }) => {
    for (const dir of ["ltr", "rtl"]) {
      await render(page, `<aside>${menu}</aside>`, { dir });
      await page.locator("#group").evaluate((el) => (el.open = true));
      await page.locator("#nested").evaluate((el) => (el.open = true));
      const side = dir === "ltr" ? "Left" : "Right";
      for (const sel of ["#group > ul", "#nested > ul", "#static"]) {
        expect(px(await style(page, sel, `margin${side}`))).toBeGreaterThan(8);
        expect(px(await style(page, sel, `border${side}Width`))).toBe(1);
      }
      expect(px(await style(page, "nav > ul", `margin${side}`))).toBe(0);
      expect(px(await style(page, "nav > ul", `border${side}Width`))).toBe(0);
    }
  });

  test("the current link gets a bar and a stronger text color", async ({
    page,
  }) => {
    await render(page, `<aside>${menu}</aside>`);
    await page.locator("#group").evaluate((el) => (el.open = true));
    await page.locator("#nested").evaluate((el) => (el.open = true));
    for (const id of ["#current", "#deep"]) {
      expect(await style(page, id, "borderLeftColor")).not.toBe(
        "rgba(0, 0, 0, 0)",
      );
      expect(await style(page, id, "fontWeight")).toBe("600");
      expect(await style(page, id, "textDecorationLine")).toBe("none");
    }
    expect(await style(page, "#plain", "borderLeftColor")).toBe(
      "rgba(0, 0, 0, 0)",
    );
    expect(await style(page, "#plain", "fontWeight")).not.toBe("600");
  });

  test("a closed group holding the current page has a stronger summary", async ({
    page,
  }) => {
    await render(page, `<aside>${menu}</aside>`);
    const stronger = await style(page, "#closed > summary", "color");
    const plain = await style(page, "#other > summary", "color");
    expect(stronger).not.toBe(plain);
    expect(stronger).toBe(await style(page, "#current", "color"));
  });

  test("headings and summaries are the same kind of label", async ({
    page,
  }) => {
    await render(page, `<aside>${menu}</aside>`);
    for (const prop of ["fontWeight", "fontSize", "color", "marginTop"]) {
      expect(await style(page, "#label", prop)).toBe(
        await style(page, "#other > summary", prop),
      );
    }
  });

  test("the first group label has no space above it", async ({ page }) => {
    await render(
      page,
      `<nav class="sidenav"><details open><summary>First</summary>
       <ul><li><a href="#">A</a></li></ul></details></nav>`,
    );
    expect(await style(page, "summary", "marginTop")).toBe("0px");
  });

  test("an open nested group sits in its list like a row", async ({ page }) => {
    await render(page, menu);
    await page.locator("#group").evaluate((el) => (el.open = true));
    await page.locator("#nested").evaluate((el) => (el.open = true));
    expect(await style(page, "#nested > summary", "marginBottom")).toBe("0px");
    expect(
      px(await style(page, "#group > summary", "marginBottom")),
    ).toBeGreaterThan(0);
  });

  test("only the current link has a bar in forced colors", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await render(page, menu);
    await page.locator("#group").evaluate((el) => (el.open = true));
    const canvas = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.cssText = "forced-color-adjust: none; color: Canvas";
      document.body.append(probe);
      return getComputedStyle(probe).color;
    });
    expect(await style(page, "#plain", "borderLeftColor")).toBe(canvas);
    expect(await style(page, "#current", "borderLeftColor")).not.toBe(canvas);
  });

  test("lists stack outside an aside", async ({ page }) => {
    await render(page, menu);
    const [a, b] = await Promise.all(
      ["#static li:first-child a", "#static li:last-child a"].map((sel) =>
        page.locator(sel).evaluate((el) => el.getBoundingClientRect().toJSON()),
      ),
    );
    expect(b.top).toBeGreaterThanOrEqual(a.bottom);
  });

  test("a dropdown inside keeps its own look", async ({ page }) => {
    await render(
      page,
      `<nav class="sidenav"><ul><li><a href="#">One</a></li></ul>
       <button popovertarget="d">More</button>
       <ul id="d" popover class="dropdown"><li><a id="item" href="#" aria-current="page">Item</a></li></ul></nav>`,
    );
    await page.locator("button").click();
    expect(await style(page, "#item", "borderLeftWidth")).not.toBe("2px");
  });

  test("the style is scoped to .sidenav", async ({ page }) => {
    await render(
      page,
      `<aside><nav><ul><li><a id="a" href="#">A</a></li></ul></nav></aside>`,
    );
    expect(px(await style(page, "#a", "paddingLeft"))).not.toBe(16);
    expect(await style(page, "#a", "borderLeftWidth")).toBe("0px");
  });

  const wrapped = `<div class="with-sidebar" style="--i-sidebar-content-min-width: 60%">
    <aside><details><summary>Menu</summary>${menu}</details></aside>
    <main>Content</main></div>`;

  test("a wrapped menu shows on wide screens with the summary hidden", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await render(page, wrapped);
    test.skip(!(await supportsDetailsContent(page)), "no ::details-content");
    await expect(page.locator("aside > details > summary")).toBeHidden();
    await expect(page.locator("#top")).toBeVisible();
    expect(
      await page.locator("aside > details").evaluate((el) => el.open),
    ).toBe(false);
  });

  test("a wrapped menu folds on a phone and opens from the summary", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await render(page, wrapped);
    test.skip(!(await supportsDetailsContent(page)), "no ::details-content");
    await expect(page.locator("aside > details > summary")).toBeVisible();
    await expect(page.locator("#top")).toBeHidden();
    await page.locator("aside > details > summary").click();
    await expect(page.locator("#top")).toBeVisible();
  });

  test("a wrapped menu folds when the aside is stacked above the content", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await render(
      page,
      `<div style="width: 700px">${wrapped.replace("--i-sidebar-content-min-width: 60%", "--i-sidebar-content-min-width: 60%; --i-sidebar-gap: 3rem")}</div>`,
    );
    test.skip(!(await supportsDetailsContent(page)), "no ::details-content");
    const width = await page
      .locator("aside")
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(384);
    await expect(page.locator("aside > details > summary")).toBeVisible();
    await expect(page.locator("#top")).toBeHidden();
  });

  test("a wrapped menu stays a plain details without ::details-content", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const plainCss = css.replaceAll("::details-content", "::x-details-content");
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${plainCss}</style></head>
       <body>${wrapped}</body></html>`,
    );
    await expect(page.locator("aside > details > summary")).toBeVisible();
    await expect(page.locator("#top")).toBeHidden();
  });

  test(".sticky sticks below a sticky navbar and scrolls on its own", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 500 });
    await render(
      page,
      `<header class="navbar sticky"><nav><ul><li><a href="#">Brand</a></li></ul></nav></header>
       <div class="with-sidebar"><aside><details><summary>Menu</summary>
         <nav class="sidenav sticky" aria-label="Docs">
           <ul>${Array.from({ length: 40 }, (_, i) => `<li><a href="#">Item ${i}</a></li>`).join("")}</ul>
         </nav></details></aside>
         <main style="height: 3000px">Content</main></div>`,
    );
    test.skip(!(await supportsDetailsContent(page)), "no ::details-content");
    await page.evaluate(() => window.scrollTo(0, 1000));
    const [navbar, wrapper] = await Promise.all(
      ["header", "aside > details"].map((sel) =>
        page.locator(sel).evaluate((el) => el.getBoundingClientRect().toJSON()),
      ),
    );
    expect(wrapper.top).toBeGreaterThanOrEqual(navbar.bottom);
    expect(wrapper.top).toBeLessThan(navbar.bottom + 40);
    expect(wrapper.bottom).toBeLessThanOrEqual(500);
    expect(
      await page
        .locator(".sidenav")
        .evaluate((el) => el.scrollHeight > el.clientHeight),
    ).toBe(true);
  });

  test("an unwrapped .sticky menu sticks", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 500 });
    await render(
      page,
      `<div class="with-sidebar"><aside>
         <nav class="sidenav sticky" aria-label="Docs"><ul><li><a href="#">One</a></li></ul></nav>
       </aside><main style="height: 3000px">Content</main></div>`,
    );
    await page.evaluate(() => window.scrollTo(0, 1000));
    const top = await page
      .locator(".sidenav")
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeLessThan(40);
    expect(top).toBeGreaterThanOrEqual(0);
  });
});

test.describe("contrast", () => {
  for (const scheme of ["light", "dark"]) {
    test(`focus rings, borders and brand text in ${scheme}`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await render(
        page,
        `<main><button class="focus">Neutral</button><button class="primary focus">Primary</button>
         <button class="warning focus">Warning</button><a href="#" class="focus">Link</a>
         <input id="field"><input type="checkbox" id="cb"><input type="checkbox" role="switch" id="sw">
         <span class="brand">Brand</span><span class="brand-name">Name</span><span class="brand-accent">Accent</span>
         <ol class="steps"><li>One</li><li aria-current="step">Two</li></ol></main>`,
      );
      for (const selector of [
        "button",
        "button.primary",
        "button.warning",
        "a",
      ]) {
        expect(
          await contrast(page, selector, "outlineColor", "parent"),
        ).toBeGreaterThanOrEqual(3);
      }
      for (const selector of ["#field", "#cb", "#sw"]) {
        expect(
          await contrast(page, selector, "borderTopColor", "parent"),
        ).toBeGreaterThanOrEqual(3);
      }
      for (const selector of [".brand", ".brand-name", ".brand-accent"]) {
        expect(await contrast(page, selector, "color")).toBeGreaterThanOrEqual(
          4.5,
        );
      }
    });
  }
});

test.describe("print", () => {
  // Browsers skip backgrounds when printing, so the text must read on paper
  test("a nested dark theme prints dark text", async ({ page }) => {
    await render(
      page,
      `<section data-theme="dark"><p>Text</p></section><section class="dark"><p>Text</p></section>`,
    );
    await page.emulateMedia({ media: "print" });
    for (const selector of ["[data-theme] p", ".dark p"]) {
      expect(
        await contrast(page, selector, "color", "paper"),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("an aside still prints", async ({ page }) => {
    await render(page, `<aside>Note</aside>`);
    await page.emulateMedia({ media: "print" });
    expect(await style(page, "aside", "display")).toBe("block");
  });
});

test.describe("parsing", () => {
  // Every style rule must reach the CSSOM. A rule may only drop when its
  // selector targets another engine (::-moz-, ::-webkit-) or when an
  // enclosing @supports fails, since the browser lacks the feature anyway.
  test("no browser drops a rule it should keep", async ({ page }) => {
    const rules = [];
    postcss.parse(css).walkRules((rule) => {
      const supports = [];
      for (let node = rule.parent; node; node = node.parent) {
        if (node.type === "atrule" && /keyframes$/.test(node.name)) return;
        if (node.type === "atrule" && node.name === "supports") {
          supports.push(node.params);
        }
      }
      rules.push({
        selector: rule.selector,
        selectors: rule.selectors,
        supports,
      });
    });
    await render(page, "");
    const missing = await page.evaluate((rules) => {
      // The CSSOM serializes selectors its own way, so compare a normal form
      const normal = (selector) =>
        selector
          .replace(/\s+/g, "")
          .replace(/["']/g, "")
          .replace(/\*(?=:)/g, "")
          .replace(/\(odd\)/g, "(2n+1)")
          .replace(/\(even\)/g, "(2n)")
          .toLowerCase();
      const isFirefox = CSS.supports("selector(::-moz-range-thumb)");
      // Only a list where every selector is another engine's may drop. A
      // mixed list dropping is the bug this test is here for.
      const otherEngine = (selectors) =>
        !isFirefox && selectors.every((selector) => /:-moz-/.test(selector));
      const parsed = new Set();
      const walk = (list) => {
        for (const rule of list) {
          if (rule instanceof CSSKeyframesRule) continue;
          if (rule instanceof CSSStyleRule)
            parsed.add(normal(rule.selectorText));
          else if (rule.cssRules) walk(rule.cssRules);
        }
      };
      for (const sheet of document.styleSheets) walk(sheet.cssRules);
      return rules
        .filter(
          (rule) =>
            !otherEngine(rule.selectors) &&
            rule.supports.every((condition) => CSS.supports(condition)),
        )
        .map((rule) => rule.selector)
        .filter((selector) => !parsed.has(normal(selector)));
    }, rules);
    expect(missing).toEqual([]);
  });

  // The browsers above have these selectors, the floor (Chrome 111, Firefox
  // 113, Safari 16.2) does not, and drops the whole list over one of them.
  // :is() and :where() forgive them, so only a lone selector may go without.
  test("selectors newer than the floor only drop their own rule", ({
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "it reads the CSS, not a browser");
    const newer = /:has\(|:user-invalid|:dir\(/;
    const unforgiving = (selector) => {
      let rest = selector;
      for (let at; (at = rest.search(/:(is|where)\(/)) >= 0;) {
        let end = rest.indexOf("(", at) + 1;
        for (let depth = 1; depth; end++) {
          if (rest[end] === "(") depth++;
          else if (rest[end] === ")") depth--;
        }
        rest = rest.slice(0, at) + rest.slice(end);
      }
      return rest;
    };
    const mixed = [];
    postcss.parse(css).walkRules((rule) => {
      if (rule.selectors.length < 2) return;
      if (rule.selectors.some((s) => newer.test(unforgiving(s)))) {
        mixed.push(rule.selector);
      }
    });
    expect(mixed).toEqual([]);
  });

  // A value no engine accepts is dead code, such as an unprefixed
  // tap-highlight-color or anchor(inline-start). Each engine only judges the
  // declarations its @supports conditions let through. Values with var() are
  // only checked once substituted, so they are left out.
  test("every declaration works in some browser that reaches it", async ({
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "it launches every engine itself");
    test.setTimeout(60_000);
    // Same condition as playwright.config.mjs
    const engines = [chromium, firefox];
    if (process.env.CI || process.env.IRIS_WEBKIT) engines.push(webkit);
    // Features only an engine that may not run here supports
    const engineOnly = { "hanging-punctuation: first": "webkit" };
    const declarations = new Map();
    postcss.parse(css).walkDecls((decl) => {
      // Autoprefixer copies target one engine, and custom properties take anything
      if (/^-/.test(decl.prop) || /var\(/.test(decl.value)) return;
      const key = `${decl.prop}: ${decl.value.replace(/\s+/g, " ")}`;
      const supports = [];
      for (let node = decl.parent; node; node = node.parent) {
        if (node.type === "atrule" && node.name === "supports") {
          supports.push(node.params);
        }
      }
      declarations.set(`${key} @supports ${supports.join(" and ")}`, {
        key,
        prop: decl.prop,
        value: decl.value,
        supports,
      });
    });
    const list = [...declarations.values()];
    const reached = new Map(list.map((d) => [d, 0]));
    const accepted = new Map(list.map((d) => [d, 0]));
    for (const engine of engines) {
      const browser = await engine.launch();
      let results;
      try {
        results = await (
          await browser.newPage()
        ).evaluate(
          (list) =>
            list.map(({ prop, value, supports }) => [
              supports.every((condition) => CSS.supports(condition)),
              CSS.supports(prop, value),
            ]),
          list,
        );
      } finally {
        await browser.close();
      }
      results.forEach(([reach, ok], i) => {
        if (!reach) return;
        reached.set(list[i], reached.get(list[i]) + 1);
        if (ok) accepted.set(list[i], accepted.get(list[i]) + 1);
      });
    }
    const launched = engines.map((engine) => engine.name());
    const dead = list
      .filter((d) => reached.get(d) > 0 && accepted.get(d) === 0)
      .filter((d) => !engineOnly[d.key] || launched.includes(engineOnly[d.key]))
      .map((d) => d.key);
    expect(dead).toEqual([]);
  });
});

test.describe("themes", () => {
  // Browsers without light-dark() keep only the build fallback. Dropping the
  // light-dark() declarations and forcing its @supports not block on gives
  // the same stylesheet in any browser.
  const fallbackCss = css
    .replace(/^\s*--[\w-]+:\s*light-dark\([^;]*\);\s*$/gm, "")
    .replaceAll(
      "@supports not (color: light-dark(tan, tan))",
      "@supports (color: red)",
    )
    .replaceAll(
      "@supports (color: light-dark(red, red))",
      "@supports (color: nonsense)",
    );

  const themed = `
    <p id="page">Page</p><button class="primary" id="page-button">Go</button>
    <section data-theme="dark"><p id="dark">Dark</p><input id="dark-input">
      <div data-theme="light"><p id="light-in-dark">Light</p></div></section>
    <section class="dark"><p id="dark-class">Dark</p></section>`;

  async function colors(page, stylesheet) {
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${stylesheet}</style></head><body>${themed}</body></html>`,
    );
    return page.evaluate(() =>
      [
        "page",
        "page-button",
        "dark",
        "dark-input",
        "light-in-dark",
        "dark-class",
      ].map((id) => {
        const style = getComputedStyle(document.getElementById(id));
        return [id, style.color, style.backgroundColor, style.borderTopColor];
      }),
    );
  }

  for (const scheme of ["light", "dark"]) {
    test(`the light-dark() fallback matches in ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      expect(await colors(page, fallbackCss)).toEqual(await colors(page, css));
    });
  }

  test("a :root theme override reaches nested themes", async ({ page }) => {
    await render(
      page,
      `<button class="primary" id="top">Top</button>
       <section data-theme="dark"><button class="primary" id="nested">Nested</button></section>`,
      { head: `<style>:root { --i-color-primary: #7c3aed; }</style>` },
    );
    expect(await style(page, "#nested", "backgroundColor")).toBe(
      await style(page, "#top", "backgroundColor"),
    );
  });

  test("the fallback keeps a :root override outside nested themes", async ({
    page,
  }) => {
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${fallbackCss}</style>
       <style>:root { --i-color-primary: #7c3aed; }</style></head>
       <body><div><button class="primary">Go</button></div></body></html>`,
    );
    expect(await style(page, "button", "backgroundColor")).toBe(
      "rgb(124, 58, 237)",
    );
  });
});
