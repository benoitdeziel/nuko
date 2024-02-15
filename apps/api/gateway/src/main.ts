import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SERVICE_NAME } from '@nuko/gateway/constants';
import { startService } from '@nuko/api/common/nest-app';

async function bootstrap(): Promise<void> {
  await startService(SERVICE_NAME, AppModule);
}

bootstrap().catch((error) => {
  Logger.error(error);
  throw error;
});
