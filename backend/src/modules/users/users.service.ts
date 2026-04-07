import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        goal: true,
        timezone: true,
        unitSystem: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async getProfile(userId: string) {
    return this.prisma.userProfile.findFirst({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async upsertProfile(userId: string, dto: UpsertProfileDto) {
    return this.prisma.userProfile.create({
      data: { userId, ...dto },
    });
  }
}
