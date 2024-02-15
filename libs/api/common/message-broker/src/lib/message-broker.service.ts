import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Event } from './event/event';
import {
  IMessageBroker,
  MessageProviderServiceKey,
} from './interfaces/message-broker.interfaces';

@Injectable()
export class MessageBrokerService implements OnApplicationBootstrap {
  constructor(
    @Inject(MessageProviderServiceKey) private messageBroker: IMessageBroker,
  ) {}

  public publishEvent<T extends object>(
    event: Event<T>,
    message: T,
    exchange: string,
    options?: any,
  ): void {
    this.messageBroker.publishEvent(event, message, exchange, options);
  }

  public async request<K = object, T extends object = object>(
    routingKey: string,
    payload: T,
    exchange: string,
    options?: any,
  ): Promise<K> {
    return this.messageBroker.request<K, T>(
      routingKey,
      payload,
      exchange,
      options,
    );
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.messageBroker.setupRetryAndDeadLetterQueues();
  }
}
