import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lists both global library exercises (userId=null) and the user's
   * own exercises, optionally filtered by category or name.
   */
  list(
    userId: string,
    opts: { category?: string; search?: string; isCardio?: boolean } = {},
  ) {
    return this.prisma.exercise.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
        ...(opts.category ? { category: opts.category } : {}),
        ...(opts.isCardio != null ? { isCardio: opts.isCardio } : {}),
        ...(opts.search
          ? { name: { contains: opts.search, mode: 'insensitive' } }
          : {}),
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const ex = await this.prisma.exercise.findUnique({ where: { id } });
    if (!ex) throw new NotFoundException();
    if (ex.userId && ex.userId !== userId) throw new ForbiddenException();
    return ex;
  }

  create(userId: string, dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateExerciseDto) {
    const existing = await this.findOne(userId, id);
    if (!existing.userId) {
      throw new ForbiddenException('Library exercises cannot be edited');
    }
    return this.prisma.exercise.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    const existing = await this.findOne(userId, id);
    if (!existing.userId) {
      throw new ForbiddenException('Library exercises cannot be deleted');
    }
    await this.prisma.exercise.delete({ where: { id } });
    return { success: true };
  }
}
