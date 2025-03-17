import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPrettierPlugin from "eslint-plugin-prettier";
import eslintPrettierConfig from "eslint-config-prettier/flat";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["src/**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    { plugins: eslintPrettierPlugin },
    eslintPrettierConfig,
];
