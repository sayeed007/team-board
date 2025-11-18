import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getEmployeeDailySummary(userId: string, organizationId: string, date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get user info
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId },
      select: { id: true, name: true, email: true, position: true },
    });

    // Get daily status
    const dailyStatus = await this.prisma.dailyStatus.findUnique({
      where: {
        userId_date: { userId, date: queryDate },
      },
    });

    // Get active tasks (not done)
    const activeTasks = await this.prisma.card.count({
      where: {
        assigneeId: userId,
        status: { not: 'DONE' },
        deletedAt: null,
      },
    });

    // Get completed tasks today
    const completedToday = await this.prisma.card.count({
      where: {
        assigneeId: userId,
        status: 'DONE',
        updatedAt: {
          gte: queryDate,
          lt: nextDay,
        },
        deletedAt: null,
      },
    });

    // Get tasks due today
    const dueToday = await this.prisma.card.count({
      where: {
        assigneeId: userId,
        dueDate: queryDate,
        status: { not: 'DONE' },
        deletedAt: null,
      },
    });

    // Get total estimated hours for active tasks
    const estimatedHours = await this.prisma.card.aggregate({
      where: {
        assigneeId: userId,
        status: { not: 'DONE' },
        deletedAt: null,
      },
      _sum: {
        estimateHours: true,
      },
    });

    return {
      user,
      date: queryDate,
      dailyStatus,
      metrics: {
        activeTasks,
        completedToday,
        dueToday,
        totalEstimatedHours: estimatedHours._sum.estimateHours || 0,
      },
    };
  }

  async getTeamDailySummary(teamId: string, organizationId: string, date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get team info and members
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, organizationId },
      include: {
        teamMembers: {
          include: {
            user: {
              select: { id: true, name: true, email: true, position: true },
            },
          },
        },
      },
    });

    const summaries = await Promise.all(
      team.teamMembers.map(async (member) => {
        const summary = await this.getEmployeeDailySummary(member.userId, organizationId, date);
        return summary;
      }),
    );

    return {
      team: {
        id: team.id,
        name: team.name,
      },
      date: queryDate,
      members: summaries,
    };
  }

  async getWeeklyReport(teamId?: string, organizationId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const where: any = {
      updatedAt: {
        gte: weekAgo,
        lte: today,
      },
      deletedAt: null,
    };

    if (teamId) {
      where.board = { teamId };
    } else if (organizationId) {
      where.board = { organizationId };
    }

    const completedCards = await this.prisma.card.groupBy({
      by: ['assigneeId'],
      where: {
        ...where,
        status: 'DONE',
      },
      _count: {
        id: true,
      },
      _sum: {
        estimateHours: true,
      },
    });

    const usersData = await Promise.all(
      completedCards.map(async (item) => {
        const user = await this.prisma.user.findUnique({
          where: { id: item.assigneeId },
          select: { id: true, name: true, email: true },
        });

        return {
          user,
          completedCards: item._count.id,
          totalHours: item._sum.estimateHours || 0,
        };
      }),
    );

    return {
      period: {
        from: weekAgo,
        to: today,
      },
      users: usersData,
    };
  }
}
