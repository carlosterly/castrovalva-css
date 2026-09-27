import js from "@eslint/js";
import globals from "globals";
import wc from "eslint-plugin-wc";

// Flat-config port of the former .eslintrc.json - same rules, same scope.
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.mocha,
      },
    },
    plugins: { wc },
    rules: {
      "wc/guard-super-call": "error",
      "wc/no-closed-shadow-root": "error",
      "wc/no-constructor-attributes": "error",
      "wc/no-invalid-element-name": "error",
      "wc/no-self-class": "error",
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "linebreak-style": ["error", "unix"],
      "eol-last": ["error", "always"],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
