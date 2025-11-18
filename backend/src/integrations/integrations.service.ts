import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExportDailySummaryDto } from './dto/export-daily-summary.dto';
import * as soap from 'soap';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(private prisma: PrismaService) {}

  async exportDailySummary(dto: ExportDailySummaryDto, organizationId: string) {
    const queryDate = new Date(dto.date);
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get integration config
    const config = await this.prisma.integrationConfig.findFirst({
      where: {
        organizationId,
        type: 'SOAP',
        isActive: true,
      },
    });

    if (!config) {
      throw new Error('SOAP integration not configured');
    }

    // Get users to export
    const where: any = {
      organizationId,
      status: 'ACTIVE',
      deletedAt: null,
    };

    if (dto.teamId) {
      where.teamMembers = {
        some: { teamId: dto.teamId },
      };
    }

    const users = await this.prisma.user.findMany({ where });

    const results = [];

    for (const user of users) {
      try {
        // Get user's daily status
        const dailyStatus = await this.prisma.dailyStatus.findUnique({
          where: {
            userId_date: {
              userId: user.id,
              date: queryDate,
            },
          },
        });

        // Get task metrics
        const activeTasks = await this.prisma.card.count({
          where: {
            assigneeId: user.id,
            status: { not: 'DONE' },
            deletedAt: null,
          },
        });

        const completedToday = await this.prisma.card.count({
          where: {
            assigneeId: user.id,
            status: 'DONE',
            updatedAt: {
              gte: queryDate,
              lt: nextDay,
            },
            deletedAt: null,
          },
        });

        const estimatedHours = await this.prisma.card.aggregate({
          where: {
            assigneeId: user.id,
            status: { not: 'DONE' },
            deletedAt: null,
          },
          _sum: {
            estimateHours: true,
          },
        });

        // Prepare SOAP payload
        const soapData = {
          employeeId: user.id,
          email: user.email,
          name: user.name,
          date: dto.date,
          activeTasks,
          completedToday,
          estimatedHours: estimatedHours._sum.estimateHours || 0,
          summary: dailyStatus?.summary || 'No status submitted',
          blockers: dailyStatus?.blockers || 'None',
          mood: dailyStatus?.mood || 'NEUTRAL',
        };

        // Send SOAP request (mock implementation)
        const result = await this.sendSOAPRequest(config.endpointUrl, soapData);

        // Log export
        await this.prisma.dailyExportLog.create({
          data: {
            organizationId,
            date: queryDate,
            userId: user.id,
            status: result.success ? 'SUCCESS' : 'FAILED',
            requestPayload: soapData,
            response: result.response,
            errorMessage: result.error,
          },
        });

        results.push({
          userId: user.id,
          userName: user.name,
          status: result.success ? 'SUCCESS' : 'FAILED',
          error: result.error,
        });
      } catch (error) {
        this.logger.error(`Failed to export for user ${user.id}:`, error);
        results.push({
          userId: user.id,
          userName: user.name,
          status: 'FAILED',
          error: error.message,
        });
      }
    }

    return {
      date: dto.date,
      totalUsers: users.length,
      results,
      summary: {
        success: results.filter((r) => r.status === 'SUCCESS').length,
        failed: results.filter((r) => r.status === 'FAILED').length,
      },
    };
  }

  private async sendSOAPRequest(
    url: string,
    data: any,
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      // This is a mock implementation
      // In production, you would use the soap library to make actual SOAP calls

      // For demonstration purposes, we'll simulate a successful SOAP call
      this.logger.log(`Sending SOAP request to ${url}`);
      this.logger.log(`Data: ${JSON.stringify(data)}`);

      // Simulate SOAP call delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Mock success response
      return {
        success: true,
        response: `Successfully exported data for ${data.name}`,
      };

      /*
      // Real SOAP implementation would look like this:
      const client = await soap.createClientAsync(url);
      const result = await client.SubmitEmployeeDailySummaryAsync(data);
      return {
        success: true,
        response: JSON.stringify(result),
      };
      */
    } catch (error) {
      this.logger.error('SOAP request failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getExportLogs(organizationId: string, date?: string) {
    const where: any = { organizationId };

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      where.date = queryDate;
    }

    return this.prisma.dailyExportLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
