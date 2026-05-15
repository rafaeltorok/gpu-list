// ESLint
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

// TypeScript
import tseslint from "typescript-eslint";

// Config
export default defineConfig([
  {
    ignores: [
      "build/**",
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "*.d.ts",
      "tests/**"
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,
  
  {
    files: ["src/**/*.{ts}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      },
      globals: globals.node 
    },
    rules: {
      // Use TS version instead
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-floating-promises": "error",

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],

      "no-console": "off",

      "@typescript-eslint/consistent-type-imports": "warn",

      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
