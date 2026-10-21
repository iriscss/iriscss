// Gzipped size budget for the minified build, a little over today's size.
// Raise a budget on purpose, in the same change that needs the bytes.
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const budgets = {
  "iris.min.css": 28 * 1024,
};

for (const [file, budget] of Object.entries(budgets)) {
  test(`${file} stays under ${budget / 1024} KB gzipped`, ({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "the size is the same in every browser",
    );
    const css = readFileSync(new URL(`../dist/${file}`, import.meta.url));
    expect(gzipSync(css, { level: 9 }).length).toBeLessThanOrEqual(budget);
  });
}
