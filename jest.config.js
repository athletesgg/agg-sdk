module.exports = {
  preset: 'ts-jest',
  setupFiles: [
    'jest-localstorage-mock',
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'node_modules',
    'dist',
  ],
}
