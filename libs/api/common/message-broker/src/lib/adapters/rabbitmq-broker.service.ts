import { Injectable, Logger } from '@nestjs/common';
import {
  AmqpConnection,
  RabbitHandlerConfig,
} from '@golevelup/nestjs-rabbitmq';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Options } from 'amqplib';
import { Channel } from 'amqp-connection-manager';
import { v4 } from 'uuid';
import { IMessageBroker } from '../interfaces/message-broker.interfaces';
import { RABBIT_RETRY_HANDLER } from '../decorators';
import { MessageBrokerExchangeUtil } from '../message-broker-exchange.util';
import { Event } from '../event/event';

@Injectable()
export class RabbitMQBrokerService implements IMessageBroker {
  constructor(
    private amqpConnection: AmqpConnection,
    private discover: DiscoveryService,
  ) {}

  public publishEvent<T extends object>(
    event: Event<T>,
    message: T,
    exchange: string,
    options?: Options.Publish,
  ): void {
    const eventId = v4();
    const headers = {
      'event-id': eventId,
      ...options?.headers,
    };

    this.amqpConnection.publish(exchange, event.getRoutingKey(), message, {
      ...options,
      headers,
    });
  }

  public async request<K = object, T extends object = object>(
    routingKey: string,
    payload: T,
    exchange: string,
    options?: any,
  ): Promise<K> {
    return this.amqpConnection.request<K>({
      exchange,
      routingKey,
      payload,
      timeout: 10_000,
      ...options,
    });
  }

  async setupRetryAndDeadLetterQueues(): Promise<void> {
    const retryHandlers = [
      ...(await this.discover.providerMethodsWithMetaAtKey<RabbitHandlerConfig>(
        RABBIT_RETRY_HANDLER,
      )),
      ...(await this.discover.controllerMethodsWithMetaAtKey<RabbitHandlerConfig>(
        RABBIT_RETRY_HANDLER,
      )),
    ];

    if (retryHandlers.length === 0) {
      return;
    }

    await this.amqpConnection.managedChannel.addSetup(
      async (channel: Channel) => {
        Logger.log('Retry and dead letter queue setup started...');

        await Promise.all(
          retryHandlers.map(async ({ discoveredMethod, meta }) => {
            const handler = discoveredMethod.handler.bind(
              discoveredMethod.parentClass.instance,
            );
            await this.amqpConnection.createSubscriber(
              handler,
              meta,
              discoveredMethod.methodName,
            );

            await this.createDeadLetterQueue(channel, meta);
          }),
        );
      },
    );
  }

  private async createDeadLetterQueue(
    channel: Channel,
    meta: RabbitHandlerConfig,
  ): Promise<void> {
    const deadLetterExchange =
      meta.queueOptions?.arguments['x-dead-letter-exchange'];
    const deadLetterRoutingKey =
      meta.queueOptions?.arguments['x-dead-letter-routing-key'];

    if (
      meta.queue === undefined ||
      meta.queueOptions === undefined ||
      deadLetterRoutingKey === undefined ||
      deadLetterExchange === undefined
    ) {
      Logger.warn(
        'Invalid queue configuration. queue or queueOptions are missing. Dead letter queues are not initialized',
      );
      return;
    }

    const { queue } = await channel.assertQueue(
      MessageBrokerExchangeUtil.getDeadLetterQueueName(meta.queue),
      {
        durable: true,
      },
    );
    await channel.bindQueue(queue, deadLetterExchange, deadLetterRoutingKey);

    Logger.log({
      message: 'Dead letter queue initialized',
      queue: meta.queue,
      exchange: deadLetterExchange,
      routingKey: deadLetterRoutingKey,
    });
  }
}
