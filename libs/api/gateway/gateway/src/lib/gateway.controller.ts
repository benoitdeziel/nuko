import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('v1/gateway')
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @Get()
  public hello(): string {
    return this.gatewayService.hello();
  }
}
