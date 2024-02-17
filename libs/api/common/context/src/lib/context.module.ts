import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';
import { ContextService } from './context.service';
import { CONTEXT_CORRELATION_ID_HEADER } from './constants/context.constants';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req) =>
          req.headers[CONTEXT_CORRELATION_ID_HEADER] ?? v4(),
      },
    }),
  ],
  providers: [ContextService],
  exports: [ContextService],
})
export class ContextModule {}
