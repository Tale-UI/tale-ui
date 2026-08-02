module.exports = {
  preset: '@react-native/jest-preset',
  watchman: false,
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  moduleNameMapper: {
    '^@tale-ui/tokens/native$': '<rootDir>/../tokens/src/generated.ts',
  },
  testMatch: ['<rootDir>/test/**/*.test.ts?(x)'],
  transformIgnorePatterns: [
    'node_modules/.pnpm/(?!(?:@react-native\\+|react-native@|@testing-library\\+react-native@))',
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@testing-library/react-native|\\.pnpm)/)',
  ],
};
