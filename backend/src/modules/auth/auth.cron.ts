import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthCron {
  private readonly logger = new Logger(AuthCron.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Delete expired and revoked refresh tokens daily at 3 AM. */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async purgeStaleRefreshTokens() {
    this.logger.log('Running expired/revoked refresh token cleanup');

    const { count } = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null } },
        ],
      },
    });

    this.logger.log(`Purged ${count} stale refresh token(s)`);
  }
}
