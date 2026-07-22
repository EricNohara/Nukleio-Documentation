import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypeScript,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },

    rules: {
      /*
       * Import organization
       */
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      /*
       * Remove unused imports automatically.
       */
      "unused-imports/no-unused-imports": "error",

      /*
       * Report unused variables.
       *
       * Variables beginning with "_" are intentionally allowed.
       * Example: const { unusedValue: _unusedValue, ...rest } = object;
       */
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      "import/no-anonymous-default-export": "off",

      /*
       * Disable the original rules to prevent duplicate warnings.
       */
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      /*
       * General cleanup
       */
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    "public/_pagefind/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

