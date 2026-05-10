import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import mocha from 'eslint-plugin-mocha'
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/dist/', '**/*.js', 'website-next/'],
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  mocha.configs.recommended,
  stylistic.configs['recommended'],
  {
    rules: {
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-setup-in-describe': 'off',
      'mocha/no-exclusive-tests': 'error',
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      'object-shorthand': ['error', 'always', { avoidQuotes: true }],
      '@typescript-eslint/no-require-imports': 'error',
      // EventEmitter overloads rely on `any` for variadic listeners; the typed overloads
      // immediately above each implementation provide the actual user-facing safety.
      '@typescript-eslint/no-explicit-any': 'off',
      // The codebase widely uses `Function` and pre-existing patterns; ban-types deprecated in v8.
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
  {
    files: ['test/**/*.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'mocha/consistent-spacing-between-blocks': 'off',
      '@stylistic/max-statements-per-line': 'off',
    },
  },
  {
    files: ['**/*.cjs'],
    rules: {
      '@stylistic/quote-props': 'off',
    },
  },
]
