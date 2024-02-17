import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import Logger, {
  LoggerBaseKey,
  LoggerKey,
} from './interfaces/logger.interface';
import { LoggerService } from './providers/logger.service';
import {
  WinstonLoggerService,
  WinstonLoggerTransportsKey,
} from './providers/winston-logger/winston-logger.service';
import ConsoleTransport from './providers/winston-logger/transporters/console-transporter';
import FileTransport from './providers/winston-logger/transporters/file-trasporter';
import SlackTransport from './providers/winston-logger/transporters/slack-transporter';
import morgan from 'morgan';
import { LoggerAdapterService } from './providers/logger-adapter/logger-adapter.service';
import { ConfigService } from '@nuko/api/common/config';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLoggerService,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: LoggerAdapterService,
      useFactory: (logger: Logger) => new LoggerAdapterService(logger),
      inject: [LoggerKey],
    },
    {
      provide: WinstonLoggerTransportsKey,
      useFactory: (configService: ConfigService) => {
        const transports = [];
        transports.push(ConsoleTransport.createColorize());
        transports.push(FileTransport.create(configService.get('APP')));
        if (configService.isProduction) {
          if (configService.slackWebhookUrl) {
            transports.push(
              SlackTransport.create(configService.slackWebhookUrl),
            );
          }
        }
        return transports;
      },
      inject: [ConfigService],
    },
    LoggerService,
  ],
  exports: [LoggerKey, LoggerAdapterService],
})
export class LoggerModule implements NestModule {
  public constructor(
    @Inject(LoggerKey) private logger: Logger,
    private configService: ConfigService,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan(this.configService.isProduction ? 'combined' : 'dev', {
          stream: {
            write: (message: string) => {
              this.logger.debug(message, {
                sourceClass: 'RequestLogger',
              });
            },
          },
        }),
      )
      .forRoutes('*');
  }
}
