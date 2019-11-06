module.exports = {
  'env': {
    'node': true,
    'jest/globals': true,
    'es6': true,
  },
  parser:  '@typescript-eslint/parser',
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  // Since both the JS and TS ruleset is applied for all files, we need to disable some TS rules for JS files
  // Currently there are limited options for mixed code-base: https://github.com/typescript-eslint/typescript-eslint/issues/109
  'overrides': [{
    'files': ['*.js'],
    'rules': {
      '@typescript-eslint/no-var-requires': 'off'
    }
  }],
  'rules': {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/indent': ['error', 2],
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    "semi": "off",
    "@typescript-eslint/semi": ["error"]
  }
};
