import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class CoachService {
  private readonly logger = new Logger(CoachService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  /**
   * A coach invites a client by email. If the client doesn't exist yet,
   * the invite is rejected with 404 to avoid enumeration side-effects.
   * The link is created un-accepted and must be confirmed by the client.
   * The client also receives an email pointing them at /coach/accept/:id.
   */
  async inviteClient(coachId: string, clientEmail: string) {
    const coach = await this.ensureCoach(coachId);

    const client = await this.prisma.user.findUnique({
      where: { email: clientEmail },
    });
    if (!client) throw new NotFoundException('Client not found');
    if (client.id === coachId) {
      throw new ForbiddenException('Cannot coach yourself');
    }

    const link = await this.prisma.coachLink.upsert({
      where: { coachId_clientId: { coachId, clientId: client.id } },
      create: { coachId, clientId: client.id },
      update: {},
    });

    // Best-effort email — never fail the invite if delivery hiccups.
    try {
      const acceptUrl =
        `${process.env.APP_URL ?? 'https://app.nutritrack.app'}` +
        `/dashboard/coach?accept=${link.id}`;
      await this.mailer.sendCoachInvite(
        client.email,
        coach.fullName ?? coach.email,
        acceptUrl,
      );
    } catch (err) {
      this.logger.warn(`Coach invite email failed: ${(err as Error).message}`);
    }

    return link;
  }

  /** A client accepts a pending coaching relationship. */
  async acceptInvite(clientId: string, linkId: string) {
    const link = await this.prisma.coachLink.findUnique({ where: { id: linkId } });
    if (!link) throw new NotFoundException();
    if (link.clientId !== clientId) throw new ForbiddenException();
    return this.prisma.coachLink.update({
      where: { id: linkId },
      data: { acceptedAt: new Date() },
    });
  }

  /** Coach-side list of current clients (only accepted links). */
  async myClients(coachId: string) {
    await this.ensureCoach(coachId);
    return this.prisma.coachLink.findMany({
      where: { coachId, acceptedAt: { not: null } },
      include: {
        client: {
          select: { id: true, email: true, fullName: true, goal: true },
        },
      },
    });
  }

  /** Client-side list of pending + accepted invites. */
  myCoaches(clientId: string) {
    return this.prisma.coachLink.findMany({
      where: { clientId },
      include: {
        coach: { select: { id: true, email: true, fullName: true } },
      },
    });
  }

  /**
   * Read-only summary of a client the coach is authorised to view.
   * Returns the same fields used by the web coach-portal view.
   */
  async clientSummary(coachId: string, clientId: string) {
    const link = await this.prisma.coachLink.findFirst({
      where: {
        coachId,
        clientId,
        acceptedAt: { not: null },
      },
    });
    if (!link) throw new ForbiddenException('No active coaching link');

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 13);

    const [client, profile, scheduleItems, sessions, prs] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: clientId },
        select: {
          id: true,
          email: true,
          fullName: true,
          goal: true,
          unitSystem: true,
        },
      }),
      this.prisma.userProfile.findFirst({
        where: { userId: clientId },
        orderBy: { recordedAt: 'desc' },
      }),
      this.prisma.dailyScheduleItem.findMany({
        where: { userId: clientId, date: { gte: since } },
        select: { date: true, status: true, itemType: true },
      }),
      this.prisma.workoutSession.findMany({
        where: {
          userId: clientId,
          status: 'completed',
          date: { gte: since },
        },
        include: { day: { select: { name: true } } },
        take: 20,
        orderBy: { date: 'desc' },
      }),
      this.prisma.personalRecord.findMany({
        where: { userId: clientId, achievedAt: { gte: since } },
        include: { exercise: { select: { name: true } } },
        orderBy: { achievedAt: 'desc' },
        take: 20,
      }),
    ]);

    const total = scheduleItems.length;
    const completed = scheduleItems.filter((i) => i.status === 'completed').length;

    return {
      client,
      profile,
      summary: {
        adherencePct: total > 0 ? Math.round((completed / total) * 100) : 0,
        totalItems: total,
        completedItems: completed,
        workoutSessions: sessions.length,
        personalRecords: prs.length,
      },
      recentSessions: sessions.map((s) => ({
        id: s.id,
        date: s.date,
        name: s.day?.name ?? 'Freeform',
        durationMin: s.durationMin,
      })),
      recentPRs: prs.map((pr) => ({
        exercise: pr.exercise.name,
        recordType: pr.recordType,
        value: Number(pr.value),
        unit: pr.unit,
        achievedAt: pr.achievedAt,
      })),
    };
  }

  private async ensureCoach(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true },
    });
    if (user?.role !== 'coach' && user?.role !== 'admin') {
      throw new ForbiddenException('Coach role required');
    }
    return user;
  }
}
