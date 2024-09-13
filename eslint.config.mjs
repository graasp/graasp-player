import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import cypressEslint from 'eslint-plugin-cypress';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/build',
      '**/public',
      '**/coverage',
      '**/node_modules',
      '.yarn/.cache',
      '**/.husky',
      '**/.nyc_output',
      '**/.yarn',
      '**/commitlint.config.cjs',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'airbnb',
      'plugin:import/typescript',
      'prettier',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'eslint:recommended',
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      'react-hooks': fixupPluginRules(reactHooks),
      cypress: fixupConfigRules(cypressEslint),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        ...globals.jest,
        cy: true,
        Cypress: true,
        JSX: 'readonly',
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },

        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      'import/order': 'off',

      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
        },
      ],

      'import/extensions': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        {
          allowHigherOrderFunctions: true,
        },
      ],

      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],

      'import/no-named-as-default': 'off',

      'react/static-property-placement': [
        'error',
        'property assignment',
        {
          childContextTypes: 'static public field',
          contextTypes: 'static public field',
          contextType: 'static public field',
          defaultProps: 'static public field',
          displayName: 'static public field',
          propTypes: 'static public field',
        },
      ],

      'no-restricted-syntax': 'off',
      'react/state-in-constructor': ['error', 'never'],

      'no-console': [
        'error',
        {
          allow: ['error', 'info'],
        },
      ],

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],

      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        {
          allowHigherOrderFunctions: true,
        },
      ],
    },
  },
  {
    files: ['src/**/*.js', 'src/**/*.tsx', 'src/**/*.ts'],

    rules: {
      'no-restricted-syntax': ['error'],
    },
  },
];
