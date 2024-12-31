import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
  languageOptions: {
    ecmaVersion: 2018,
    globals: {
      es6: true,
      node: true,
    }
  },
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
  },
}];
