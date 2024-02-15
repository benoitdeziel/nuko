import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { RedisConfig } from './cache.interfaces';
import { Connection } from './connection/connection';

@Injectable()
export class CacheService implements OnModuleInit {
  private connections: Map<string, Connection> = new Map();

  constructor(@Inject('CONFIG_OPTIONS') private options: RedisConfig) {}

  onModuleInit() {
    this.options.connections.forEach((connection) => {
      this.connections.set(
        connection.connectionName,
        new Connection(connection.connectionUrl, connection.keyPrefix),
      );
    });
  }

  forConnection(connectionName: string): Connection {
    if (this.connections.has(connectionName)) {
      return this.connections.get(connectionName)!;
    }

    throw new InternalServerErrorException(
      `CONNECTION - ${connectionName} - not available.`,
    );
  }
}
