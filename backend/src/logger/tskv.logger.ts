import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]): string {
    const record: Record<string, string> = {
      level,
      message: String(message),
    };

    optionalParams.forEach((param, index) => {
      let value: string;

      if (typeof param === 'string') {
        value = param;
      } else {
        try {
          value = JSON.stringify(param);
        } catch {
          value = String(param);
        }
      }


      value = value.replace(/\t/g, ' ').replace(/\n/g, ' ');

      record[`meta${index}`] = value;
    });

    return Object.entries(record)
      .map(([key, value]) => `${key}=${value}`)
      .join('\t');
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug?(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose?(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
