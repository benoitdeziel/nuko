import {
  RabbitMQConfig,
  RabbitMQExchangeConfig,
} from '@golevelup/nestjs-rabbitmq';
import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { Event } from '../event/event';

export const MessageProviderServiceKey = Symbol();

export interface MessageBrokerExchange extends RabbitMQExchangeConfig {
  initRetryExchange?: boolean;
  initDeadLetterExchange?: boolean;
}

export interface MessageBrokerModuleConfig {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => RabbitMQConfig;
}

export interface IMessageBroker {
  publishEvent<T extends object>(
    event: Event<T>,
    message: T,
    exchange: string,
    options?: any,
  ): void;

  request<K = object, T extends object = object>(
    routingKey: string,
    payload: T,
    exchange: string,
    options?: any,
  ): Promise<K>;

  setupRetryAndDeadLetterQueues(): Promise<void>;
}
