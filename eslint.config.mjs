// @ts-check
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { ignores: ["**/dist/", "test/projects/"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginUnicorn.configs["flat/recommended"],
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
      "unicorn/consistent-function-scoping": "warn",
      "unicorn/explicit-length-check": "warn",
      "unicorn/import-style": "warn",
      "unicorn/no-array-reduce": "warn",
      "unicorn/no-nested-ternary": "warn",
      "unicorn/prefer-regexp-test": "warn",
      "unicorn/prefer-string-slice": "warn",
      // disable strict rules/not applicable
      "unicorn/empty-brace-spaces": "off", // conflict with prettier
      "unicorn/no-array-callback-reference": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
];
