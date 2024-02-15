import { Inject, Injectable } from '@nestjs/common';
import { ConfigOptions } from './config.interfaces';
import { ConfigService as OriginalConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(
    private configService: OriginalConfigService,
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
}
