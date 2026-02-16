import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  it('formatMessage формирует строку в TSKV-формате (key=value, разделённые табами)', () => {
    const msg = logger.formatMessage('log', 'hello', { foo: 'bar' }, 42);
    const parts = msg.split('\t');

    expect(parts[0]).toBe('level=log');
    expect(parts[1]).toBe('message=hello');
    expect(parts[2]).toMatch(/^meta0=/);
    expect(parts[3]).toMatch(/^meta1=/);
  });

  it('log пишет строку в console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined as unknown as void);

    logger.log('hello');

    expect(spy).toHaveBeenCalledTimes(1);

    const arg = String(spy.mock.calls[0][0]);
    expect(arg.startsWith('level=log\tmessage=hello')).toBe(true);

    spy.mockRestore();
  });

  it('error пишет строку в console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined as unknown as void);

    logger.error('oops');

    expect(spy).toHaveBeenCalledTimes(1);

    const arg = String(spy.mock.calls[0][0]);
    expect(arg.startsWith('level=error\tmessage=oops')).toBe(true);

    spy.mockRestore();
  });
});
