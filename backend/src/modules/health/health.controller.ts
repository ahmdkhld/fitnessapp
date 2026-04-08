import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Public()
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const checks: Record<string, { status: 'up' | 'down'; error?: string }> = {};

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'up' };
    } catch (e) {
      checks.database = { status: 'down', error: (e as Error).message };
    }

    const ok = Object.values(checks).every((c) => c.status === 'up');
    return {
      status: ok ? 'ok' : 'degraded',
      uptimeSeconds: Math.floor(process.uptime()),
      version: process.env.npm_package_version ?? '0.1.0',
      checks,
    };
  }

  @Get('live')
  live() {
    return { status: 'ok' };
  }
}
