import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const ALLOWED_ROLES = new Set(['user', 'coach', 'admin']);

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(actorId: string, opts: { search?: string; role?: string } = {}) {
    await this.ensureAdmin(actorId);
    return this.prisma.user.findMany({
      where: {
        ...(opts.role ? { role: opts.role } : {}),
        ...(opts.search
          ? {
              OR: [
                { email: { contains: opts.search, mode: 'insensitive' } },
                { fullName: { contains: opts.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        goal: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async setRole(actorId: string, userId: string, role: string) {
    await this.ensureAdmin(actorId);
    if (!ALLOWED_ROLES.has(role)) {
      throw new ForbiddenException(`Unknown role: ${role}`);
    }
    if (actorId === userId && role !== 'admin') {
      throw new ForbiddenException('Cannot demote yourself');
    }
    const target = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw new NotFoundException();
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }

  async stats(actorId: string) {
    await this.ensureAdmin(actorId);
    const [users, coaches, plans, sessions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'coach' } }),
      this.prisma.workoutPlan.count({ where: { isTemplate: false } }),
      this.prisma.workoutSession.count({ where: { status: 'completed' } }),
    ]);
    return { users, coaches, workoutPlans: plans, completedSessions: sessions };
  }

  private async ensureAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (user?.role !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }
  }
}
