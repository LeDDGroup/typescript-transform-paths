// @ts-check
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { ignores: ["**/dist/", "test/projects/"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
      "no-empty": ["error", { allowEmptyCatch: true }],
      "prefer-const": ["error", { destructuring: "all" }],
    },
  },
  {
    // overrides for cjs files
    files: ["*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    rules: {
      // fix these warnings
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
