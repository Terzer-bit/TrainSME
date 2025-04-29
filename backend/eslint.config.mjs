import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jest from 'eslint-plugin-jest';



export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  { files: ['**/__tests__/**/*.js', '**/*.test.js'], plugins: { jest }, languageOptions: { globals: jest.environments.globals.globals}},
]);