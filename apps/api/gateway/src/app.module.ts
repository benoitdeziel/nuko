import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nuko/api/common/config';
import { ConfigVariables } from '@nuko/gateway/constants';
import { HealthModule } from '@nuko/api/common/health';
import { GatewayModule } from '@nuko/gateway/gateway';
import { CacheModule } from '@nuko/api/common/cache';
import { MessageBrokerModule } from '@nuko/message-broker';
import { ContextModule } from '@nuko/api/common/context';
import { LoggerModule } from '@nuko/api/common/logger';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [],
    }),
    MessageBrokerModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(ConfigVariables.RABBITMQ_URL),
      }),
    }),
    CacheModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connections: [
          {
            connectionName: 'default',
            connectionUrl: configService.get(ConfigVariables.CACHE_URL),
          },
        ],
      }),
    }),
    ContextModule,
    LoggerModule,
    HealthModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
