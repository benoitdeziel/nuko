import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import Logger from '../../interfaces/logger.interface';

@Injectable()
export class LoggerAdapterService
  extends ConsoleLogger
  implements LoggerService
{
  public constructor(private logger: Logger) {
    super();
  }

  public override log(message: string, ...optionalParams: any[]) {
    return this.logger.info(message, this.getLogData(optionalParams));
  }

  public override error(message: string, ...optionalParams: any[]) {
    return this.logger.error(message, this.getLogData(optionalParams));
  }

  public override warn(message: string, ...optionalParams: any[]) {
    return this.logger.warn(message, this.getLogData(optionalParams));
  }

  public override debug(message: string, ...optionalParams: any[]) {
    return this.logger.debug(message, this.getLogData(optionalParams));
  }

  public override verbose(message: string, ...optionalParams: any[]) {
    return this.logger.info(message, this.getLogData(optionalParams));
  }

  private getLogData(...optionalParams: any[]) {
    return {
      sourceClass: optionalParams[0] ? optionalParams[0] : undefined,
    };
  }
}
