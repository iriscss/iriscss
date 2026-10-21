/**
 * Build script: Concatenate CSS source files
 *
 * Resolves @import statements in src/iris.css and writes the result to
 * dist/iris.css.
 */

const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

const srcDir = path.join(__dirname, "..", "src");
const outDir = path.join(__dirname, "..", "dist");

const input = "iris.css";
const output = "iris.css";

const banner = `/*!
 * Iris CSS v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * ${pkg.license} License
 * ${pkg.homepage}
 */
`;

/**
 * Recursively resolve @import statements. Only `@import "file";` and
 * `@import "file" layer(name);` are supported. Anything else, a missing file
 * or an import cycle stops the build, since a browser would skip an @import
 * left in the middle of the output.
 */
function resolveImports(filePath, chain = []) {
  if (chain.includes(filePath)) {
    throw new Error(`Import cycle: ${[...chain, filePath].join(" -> ")}`);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const dir = path.dirname(filePath);

  const resolved = content.replace(
    /@import\s+["']([^"']+)["']\s*(?:layer\(([^)]+)\))?\s*;/g,
    (match, importPath, layer) => {
      const resolvedPath = path.resolve(dir, importPath);
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Cannot resolve ${importPath} from ${filePath}`);
      }
      const css = resolveImports(resolvedPath, [...chain, filePath]);
      return layer ? `@layer ${layer} {\n${css}}\n` : css;
    }
  );

  const leftover = resolved.match(/@import[^;]*;/);
  if (leftover) {
    throw new Error(`Unsupported import in ${filePath}: ${leftover[0]}`);
  }
  return resolved;
}

// Start clean, so a file dropped from the build never ships from an old dist/
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

console.log(`  ${input} → dist/${output}`);
// The banner goes first, ahead of the @layer statement that opens the entry
fs.writeFileSync(
  path.join(outDir, output),
  banner + resolveImports(path.join(srcDir, input)),
  "utf-8",
);

console.log("  CSS concatenation complete.");
