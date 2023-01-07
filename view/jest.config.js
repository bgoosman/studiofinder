module.exports = {
  moduleNameMapper: {
    '\\.(css|less)$': 'src/__mocks__/styleMock.js',
  },
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileTransformer.js',
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  setupFilesAfterEnv: ["jest-sorted"],
  testEnvironment: 'jsdom',
};