// ESLint
import js from "@eslint/js";
import globals from "globals";

// TypeScript
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "build/**",
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "**/*.d.ts",
    ],
  },

  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Type-aware TypeScript rules
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tseslint.parser,

      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },

      globals: globals.node,
    },

    rules: {
      // Disable base rule in favor of TS version
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Async safety
      "@typescript-eslint/no-floating-promises": "error",

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],

      // Code consistency
      "@typescript-eslint/consistent-type-imports": "warn",

      // Gradual strictness
      "@typescript-eslint/no-explicit-any": "warn",

      // Backend logging is acceptable
      "no-console": "off",
    },
  }
);