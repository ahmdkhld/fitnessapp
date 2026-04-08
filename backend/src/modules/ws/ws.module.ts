import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WsGateway } from './ws.gateway';

/**
 * Global WebSocket module.
 *
 * Marked `@Global()` so any module can inject `WsGateway` to push
 * real-time events without adding WsModule to its own imports array.
 */
@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
    }),
  ],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
