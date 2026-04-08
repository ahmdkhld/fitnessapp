import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Attaches a unique request ID to every incoming request.
 *
 * - If the client already sends an `X-Request-Id` header it is reused;
 *   otherwise a new UUID v4 is generated.
 * - The ID is stored on `req.id` for use in logging / tracing.
 * - The ID is echoed back in the `X-Request-Id` response header.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const id =
      (req.headers['x-request-id'] as string | undefined) || randomUUID();
    (req as any).id = id;
    _res.setHeader('X-Request-Id', id);
    next();
  }
}
