// For details, check: https://basarat.gitbooks.io/typescript/docs/testing/jest.html
module.exports = {
  'roots': [
    '<rootDir>/src'
  ],
  'transform': {
    '^.+\\.tsx?$': 'ts-jest'
  },
  'testRegex': '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  }
};
