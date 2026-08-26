import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    extends: [tseslint.configs.recommended],

    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "no-unused-vars": "off",
      "no-console": "warn",

      "@typescript-eslint/explicit-module-boundary-types": "off",

      "react/no-unescaped-entities": "off",
      "@next/next/no-sync-scripts": "off",

      "react/display-name": "off",

      "react/jsx-curly-brace-presence": [
        "warn",
        {
          props: "never",
          children: "never",
        },
      ],

      "@typescript-eslint/no-unused-vars": "off",

      "unused-imports/no-unused-imports": "warn",

      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "simple-import-sort/exports": "warn",

      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // External libraries and side effects
            ["^@?\\w", "^\\u0000"],

            // CSS
            ["^.+\\.s?css$"],

            // Lib and hooks
            ["^@/lib", "^@/hooks"],

            // Static data
            ["^@/data"],

            // Components
            ["^@/components", "^@/container"],

            // Zustand store
            ["^@/store"],

            // Other aliases
            ["^@/"],

            // Relative imports
            [
              "^\\./?$",
              "^\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\.\\.(?!/?$)",
              "^\\.\\./\\.\\./?$",
              "^\\.\\./\\.\\.(?!/?$)",
              "^\\.\\./\\.\\./\\.\\./?$",
              "^\\.\\./\\.\\./\\.\\.(?!/?$)",
            ],

            // Types
            ["^@/types"],

            // Anything else
            ["^"],
          ],
        },
      ],
    },
  },

  prettier,
]);
