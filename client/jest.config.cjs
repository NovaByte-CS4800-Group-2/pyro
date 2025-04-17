const { TestEnvironment } = require("jest-environment-jsdom");

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest to transform JS, JSX, TS, TSX
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'], // Recognize .js, .jsx, .ts, .tsx files
};