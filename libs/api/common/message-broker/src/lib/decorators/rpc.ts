import {
  QueueOptions,
  RabbitMQExchangeConfig,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { Decorators } from './interfaces';

export function Rpc(
  routingKey: string,
  queueName: string,
  exchange: RabbitMQExchangeConfig,
  queueOptions: QueueOptions,
): Decorators {
  const fullQueueName = `${queueName}-${exchange.name}_${routingKey}`;

  return RabbitRPC({
    exchange: exchange.name,
    createQueueIfNotExists: true,
    queue: fullQueueName,
    routingKey: routingKey,
    queueOptions: {
      durable: true,
      ...queueOptions,
    },
  });
}
