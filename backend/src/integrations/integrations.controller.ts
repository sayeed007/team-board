import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { ExportDailySummaryDto } from './dto/export-daily-summary.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('daily-summary/export')
  @Roles(UserRole.ORG_ADMIN, UserRole.SYS_ADMIN)
  @ApiOperation({ summary: 'Export daily summary via SOAP' })
  exportDailySummary(
    @Body() exportDailySummaryDto: ExportDailySummaryDto,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.integrationsService.exportDailySummary(exportDailySummaryDto, organizationId);
  }

  @Get('daily-summary/logs')
  @Roles(UserRole.ORG_ADMIN, UserRole.SYS_ADMIN)
  @ApiQuery({ name: 'date', required: false, example: '2025-01-18' })
  @ApiOperation({ summary: 'Get export logs' })
  getExportLogs(@CurrentUser('organizationId') organizationId: string, @Query('date') date?: string) {
    return this.integrationsService.getExportLogs(organizationId, date);
  }
}
