import { Injectable } from '@nestjs/common';
import { ConfigService } from '@microservice-stack/nest-config';
import { ConfigVariables } from '@nuko/api/gateway/constants';

@Injectable()
export class GatewayService {
  constructor(private configService: ConfigService) {}

  public hello(): string {
    return this.configService.get<string>(
      ConfigVariables.REQUIRED_ENVIRONMENT_VARIABLE,
    );
  }
}
