import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDailyStatusDto } from './dto/create-daily-status.dto';

@Injectable()
export class DailyStatusService {
  constructor(private prisma: PrismaService) {}

  async create(createDailyStatusDto: CreateDailyStatusDto, userId: string) {
    const date = createDailyStatusDto.date ? new Date(createDailyStatusDto.date) : new Date();
    date.setHours(0, 0, 0, 0);

    // Upsert - update if exists for this date, create if not
    const status = await this.prisma.dailyStatus.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        summary: createDailyStatusDto.summary,
        blockers: createDailyStatusDto.blockers,
        mood: createDailyStatusDto.mood,
      },
      create: {
        userId,
        date,
        summary: createDailyStatusDto.summary,
        blockers: createDailyStatusDto.blockers,
        mood: createDailyStatusDto.mood,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return status;
  }

  async findAll(organizationId: string, date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    return this.prisma.dailyStatus.findMany({
      where: {
        date: queryDate,
        user: {
          organizationId,
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, position: true, avatarUrl: true },
        },
      },
      orderBy: { user: { name: 'asc' } },
    });
  }

  async findByUser(userId: string, date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    return this.prisma.dailyStatus.findUnique({
      where: {
        userId_date: {
          userId,
          date: queryDate,
        },
      },
    });
  }
}
