import { Injectable } from '@nestjs/common';
import { MessageBrokerExchange } from './interfaces/message-broker.interfaces';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MessageBrokerExchangeUtil {
  public static createExchanges(
    exchanges: MessageBrokerExchange[],
  ): RabbitMQExchangeConfig[] {
    return [...exchanges, this.getDefaultExchange()].flatMap(
      (exchange: MessageBrokerExchange) => {
        // install the plugin
        /*         const retryExchange: RabbitMQExchangeConfig = {
          name: MessageBrokerExchangeUtil.getRetryExchangeName(exchange.name),
          type: 'x-delayed-message',
          options: {
            arguments: {
              'x-delayed-type': 'direct',
            },
          },
        }; */

        const deadLetterExchange: RabbitMQExchangeConfig = {
          name: MessageBrokerExchangeUtil.getDeadLetterExchangeName(
            exchange.name,
          ),
          type: 'direct',
        };

        return [exchange, /* retryExchange, */ deadLetterExchange];
      },
    );
  }

  public static getDefaultExchange(): RabbitMQExchangeConfig {
    return {
      name: 'default',
      type: 'topic',
    };
  }

  public static getRetryExchangeName(exchange: string): string {
    return `${exchange}.retry`;
  }

  public static getDeadLetterExchangeName(exchange: string): string {
    return `${exchange}.dead`;
  }

  public static getDeadLetterQueueName(queueName: string): string {
    return `${queueName}.dead`;
  }
}
