import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerExchangeUtil } from './message-broker-exchange.util';
import { MessageBrokerService } from './message-broker.service';
import {
  MessageProviderServiceKey,
  MessageBrokerModuleConfig,
} from './interfaces/message-broker.interfaces';
import { RabbitMQBrokerService } from './adapters/rabbitmq-broker.service';

@Module({})
export class MessageBrokerModule {
  static register(options: MessageBrokerModuleConfig): DynamicModule {
    const imports = [
      RabbitMQModule.forRootAsync(RabbitMQModule, {
        imports: options.imports,
        inject: options.inject,
        useFactory: (...args): RabbitMQConfig => {
          const config = options.useFactory(...args);

          return {
            ...config,
            exchanges: MessageBrokerExchangeUtil.createExchanges([
              ...(config.exchanges ? config.exchanges : []),
            ]),
            prefetchCount: 250,
            enableControllerDiscovery: true,
            connectionInitOptions: { wait: false },
            logger: new Logger(),
          };
        },
      }),
    ];

    const exports: Provider[] = [MessageBrokerService];
    const providers: Provider[] = [
      {
        provide: MessageProviderServiceKey,
        useClass: RabbitMQBrokerService,
      },
      MessageBrokerService,
    ];

    return {
      module: MessageBrokerModule,
      providers,
      imports,
      exports,
      global: true,
    };
  }
}
