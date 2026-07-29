module.exports = {
  preset: '@react-native/jest-preset',
  watchman: false,
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  testMatch: ['<rootDir>/test/**/*.test.ts?(x)'],
  transformIgnorePatterns: [
    'node_modules/.pnpm/(?!(?:@react-native\\+|react-native@|@testing-library\\+react-native@))',
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@testing-library/react-native|\\.pnpm)/)',
  ],
};
