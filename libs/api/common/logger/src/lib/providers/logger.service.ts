import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import Logger, {
  LogData,
  LogLevel,
  LoggerBaseKey,
} from '../interfaces/logger.interface';
import { ContextService } from '@nuko/api/common/context';
import { ConfigService } from '@nuko/api/common/config';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements Logger {
  private sourceClass: string;
  private organization: string;
  private context: string;
  private app: string;

  public constructor(
    @Inject(LoggerBaseKey) private logger: Logger,
    configService: ConfigService,
    @Inject(INQUIRER) parentClass: object,
    private contextStorageService: ContextService,
  ) {
    this.sourceClass = parentClass?.constructor?.name;

    // Set the organization, context and app from the environment variables
    this.organization = configService.get('ORGANIZATION') || 'default-org';
    this.context = configService.get('CONTEXT') || 'default-context';
    this.app = configService.get('APP') || 'default-app';
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }

  public debug(message: string, data?: LogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      organization: data?.organization || this.organization,
      context: data?.context || this.context,
      app: data?.app || this.app,
      sourceClass: data?.sourceClass || this.sourceClass,
      correlationId:
        data?.correlationId || this.contextStorageService.getContextId(),
    };
  }

  public startProfile(id: string) {
    this.logger.startProfile(id);
  }
}
