module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'warn', //return type
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@app/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@controllers/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@middleware/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@plugins/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@routes/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@schemas/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@services/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@utils/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@config/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@decorator/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
