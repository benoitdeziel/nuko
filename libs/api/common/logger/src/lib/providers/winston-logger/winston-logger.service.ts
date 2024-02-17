import { Inject, Injectable } from '@nestjs/common';
import Logger, { LogData, LogLevel } from '../../interfaces/logger.interface';
import * as winston from 'winston';

type LevelIndexes = { [key in LogLevel]: number };

export const WinstonLoggerTransportsKey = Symbol();

@Injectable()
export class WinstonLoggerService implements Logger {
  private logger: winston.Logger;

  public constructor(
    @Inject(WinstonLoggerTransportsKey) transports: winston.transport[],
  ) {
    this.logger = winston.createLogger(this.getLoggerFormatOptions(transports));
  }

  private getLoggerFormatOptions(transports: winston.transport[]) {
    const levels: LevelIndexes = Object.values(LogLevel).reduce(
      (acc, current, index) => {
        acc[current as LogLevel] = index;
        return acc;
      },
      {} as LevelIndexes,
    );

    return {
      level: LogLevel.Debug,
      levels: levels,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format((info) => {
          if (info['error'] && info['error'] instanceof Error) {
            info['stack'] = info['error'].stack;
            info['error'] = undefined;
          }

          info[
            'label'
          ] = `${info['organization']}.${info['context']}.${info['app']}`;

          return info;
        })(),
        winston.format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message'],
        }),
        winston.format.json(),
      ),
      transports: transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports,
    };
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    const logData = {
      level: level,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      ...data,
    };

    if (profile) {
      this.logger.profile(profile, logData);
    } else {
      this.logger.log(logData);
    }
  }

  public debug(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Debug, message, data, profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Info, message, data, profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Warn, message, data, profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Error, message, data, profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Fatal, message, data, profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Emergency, message, data, profile);
  }

  public startProfile(id: string) {
    this.logger.profile(id);
  }
}
