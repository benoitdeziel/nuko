import { DynamicModule, Module } from '@nestjs/common';
import { RedisOptions } from './cache.interfaces';
import { CacheService } from './cache.service';

@Module({})
export class CacheModule {
  static register(options: RedisOptions): DynamicModule {
    return {
      module: CacheModule,
      imports: options.imports,
      providers: [
        {
          inject: options.inject,
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
        },
        CacheService,
      ],
      exports: [CacheService],
      global: true,
    };
  }
}
