import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('employee/:id/daily-summary')
  @ApiQuery({ name: 'date', required: false, example: '2025-01-18' })
  @ApiOperation({ summary: 'Get employee daily summary' })
  getEmployeeDailySummary(
    @Param('id') userId: string,
    @CurrentUser('organizationId') organizationId: string,
    @Query('date') date?: string,
  ) {
    return this.reportsService.getEmployeeDailySummary(userId, organizationId, date);
  }

  @Get('team/:id/daily-summary')
  @ApiQuery({ name: 'date', required: false, example: '2025-01-18' })
  @ApiOperation({ summary: 'Get team daily summary' })
  getTeamDailySummary(
    @Param('id') teamId: string,
    @CurrentUser('organizationId') organizationId: string,
    @Query('date') date?: string,
  ) {
    return this.reportsService.getTeamDailySummary(teamId, organizationId, date);
  }

  @Get('weekly')
  @ApiQuery({ name: 'teamId', required: false })
  @ApiOperation({ summary: 'Get weekly report' })
  getWeeklyReport(
    @Query('teamId') teamId?: string,
    @CurrentUser('organizationId') organizationId?: string,
  ) {
    return this.reportsService.getWeeklyReport(teamId, organizationId);
  }
}
