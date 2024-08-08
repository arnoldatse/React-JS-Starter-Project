import type {Config} from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^app(.*)$': '<rootDir>/src/app$1',
    '^core(.*)$': '<rootDir>/src/core$1',
    '^details(.*)$': '<rootDir>/src/details$1',
  },
};

export default config;