import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist/', '**/__snapshots__/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  prettier,
  {
    plugins: { 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      // Autolinker's ES2015 build breaks Expo static rendering (#84), and the package root
      // resolves to it on web, so always import the CommonJS build explicitly.
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'autolinker', message: 'Import from autolinker/dist/commonjs instead.' }],
          patterns: [
            {
              group: ['autolinker/dist/es2015*'],
              message: 'Import from autolinker/dist/commonjs instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node, sourceType: 'commonjs' },
  },
  {
    files: ['**/*.test.*', '**/__mocks__/**'],
    languageOptions: { globals: globals.jest },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
