import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('formatMessage возвращает корректный JSON', () => {
    const json = logger.formatMessage('log', 'hello', 1, { foo: 'bar' });

    const parsed = JSON.parse(json);

    expect(parsed).toEqual({
      level: 'log',
      message: 'hello',
      optionalParams: [1, { foo: 'bar' }],
    });
  });

  it('log пишет форматированную строку в console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined as unknown as void);

    logger.log('msg', { a: 1 });

    expect(spy).toHaveBeenCalledTimes(1);

    const arg = spy.mock.calls[0][0];
    const parsed = JSON.parse(String(arg));

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('msg');
    expect(parsed.optionalParams).toEqual([{ a: 1 }]);

    spy.mockRestore();
  });

  it('error пишет форматированную строку в console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined as unknown as void);

    logger.error('oops', 'details');

    expect(spy).toHaveBeenCalledTimes(1);

    const arg = spy.mock.calls[0][0];
    const parsed = JSON.parse(String(arg));

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('oops');
    expect(parsed.optionalParams).toEqual(['details']);

    spy.mockRestore();
  });
});
