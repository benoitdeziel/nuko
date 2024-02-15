import { QueueOptions } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerExchange } from '../interfaces/message-broker.interfaces';

// eslint-disable-next-line @typescript-eslint/ban-types
export type Decorators = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;

export interface SubscriptionOptions {
  requeueOnError?: RequeueOnErrorOptions;
  exchange?: MessageBrokerExchange;
  queue?: QueueOptions;
}

export interface RequeueOnErrorOptions {
  retry: boolean;
  deadLetter: boolean;
  retryInitialDelayInMs: number;
  maxRetries: number;
  retryBackoffMultiplier: number;
}

export { QueueOptions };
