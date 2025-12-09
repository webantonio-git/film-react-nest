module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier', 'import', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // включить prettier
    'prettier/prettier': 'warn',

    // авто-сортировка импортов
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',

    // запрет лишних ts-ignore
    '@typescript-eslint/ban-ts-comment': 'warn',

    // порядок импортов не от import/order, а от simple-import-sort
    'import/order': 'off',
  },
};
