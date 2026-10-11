// Verify that code cleanup did not change component runtime behavior.
// Usage: node scripts/check-component-equivalence.cjs <baseline-commit>
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const ts = require("../playground/node_modules/typescript");

const baseline = process.argv[2];
if (!baseline) throw new Error("Pass the baseline Git commit to compare.");
const root = path.resolve(__dirname, "..");
const options = {
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2023,
  module: ts.ModuleKind.ESNext,
};
function runtime(source, name) {
  let output = ts.transpileModule(source, {
    fileName: name,
    compilerOptions: options,
  }).outputText;
  // The Vite build removes unused React default imports with automatic JSX.
  const withoutDefault = output.replace(/import React, \{/, "import {");
  const ast = ts.createSourceFile(
    name + ".js",
    withoutDefault,
    ts.ScriptTarget.ES2023,
    true,
    ts.ScriptKind.JS,
  );
  let usesReact = false;
  function visit(node) {
    if (ts.isImportDeclaration(node)) return;
    if (ts.isIdentifier(node) && node.text === "React") usesReact = true;
    ts.forEachChild(node, visit);
  }
  visit(ast);
  if (!usesReact) output = withoutDefault;
  return output;
}
const files = fs
  .readdirSync(path.join(root, "components"))
  .filter((name) => name.endsWith(".tsx"));
const baselineFiles = execFileSync(
  "git",
  ["ls-tree", "-r", "--name-only", baseline, "--", "components"],
  { cwd: root, encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => path.basename(name));
for (const name of baselineFiles) {
  const original = execFileSync(
    "git",
    ["show", `${baseline}:components/${name}`],
    { cwd: root, encoding: "utf8" },
  );
  const current = fs.readFileSync(path.join(root, "components", name), "utf8");
  if (runtime(original, name) !== runtime(current, name))
    throw new Error(`Runtime code differs: ${name}`);
}
console.log(
  `Verified ${baselineFiles.length} original components: identical runtime JavaScript, excluding unused React imports. ${files.length - baselineFiles.length} new components excluded.`,
);
