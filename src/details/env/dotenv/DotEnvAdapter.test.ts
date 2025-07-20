import DotEnv from './DotEnv';

describe('DotEnv', () => {
  let dotEnvAdapter: DotEnv;

  beforeAll(() => {
    process.env = {
        TEST_KEY: 'testValue',
        ANOTHER_KEY: 'anotherValue'
    };
    dotEnvAdapter = new DotEnv();
  });

  afterAll(() => {
    delete process.env.TEST_KEY;
    delete process.env.ANOTHER_KEY;
  });

  it('should return the correct value for an existing key', () => {
    expect(dotEnvAdapter.get('TEST_KEY')).toBe('testValue');
    expect(dotEnvAdapter.get('ANOTHER_KEY')).toBe('anotherValue');
  });

  it('should return undefined for a non-existent key', () => {
    expect(dotEnvAdapter.get('NON_EXISTENT_KEY')).toBeUndefined();
  });
});