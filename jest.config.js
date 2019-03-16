// For details, check: https://basarat.gitbooks.io/typescript/docs/testing/jest.html
module.exports = {
  "roots": [
    "<rootDir>/packages"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
};
