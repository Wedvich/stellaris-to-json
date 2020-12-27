module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.story.*', '!**/*.test.*'],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
};
