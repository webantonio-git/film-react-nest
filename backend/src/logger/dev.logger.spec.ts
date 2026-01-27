import { ConsoleLogger } from '@nestjs/common';

import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  it('должен наследоваться от ConsoleLogger и вызывать его log', () => {
    const spy = jest
      .spyOn(ConsoleLogger.prototype, 'log')
      .mockImplementation(() => undefined as unknown as void);

    const logger = new DevLogger();
    logger.log('test message');

    expect(spy).toHaveBeenCalledWith('test message');

    spy.mockRestore();
  });
});
