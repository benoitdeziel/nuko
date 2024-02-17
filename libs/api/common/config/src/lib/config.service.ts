import { Inject, Injectable } from '@nestjs/common';
import { ConfigOptions } from './config.interfaces';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(
    private configService: NestConfigService,
    @Inject('CONFIG_OPTIONS') private options: ConfigOptions,
  ) {
    options.requiredEnvironmentVariables.forEach((variableName: string) => {
      if (this.configService.get(variableName) === undefined) {
        throw new Error(`INVALID_CONFIG_${variableName}_MISSING`);
      }
    });
  }

  public get<T = never>(configVariable: string): T {
    const value = this.configService.get(configVariable);

    if (this.options.parse) {
      return this.options.parse(configVariable, value);
    }

    return value;
  }

  get isProduction(): boolean {
    return this.environment === 'production';
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  get isTest(): boolean {
    return this.environment === 'test';
  }

  get slackWebhookUrl(): string {
    return this.get('SLACK_INC_WEBHOOK_URL');
  }

  private get environment(): string {
    return this.get('NODE_ENV');
  }
}
