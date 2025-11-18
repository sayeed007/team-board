import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DailyStatusService } from './daily-status.service';
import { CreateDailyStatusDto } from './dto/create-daily-status.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('daily-status')
@ApiBearerAuth()
@Controller('daily-status')
export class DailyStatusController {
  constructor(private readonly dailyStatusService: DailyStatusService) {}

  @Post()
  @ApiOperation({ summary: 'Submit or update daily status' })
  create(@Body() createDailyStatusDto: CreateDailyStatusDto, @CurrentUser('id') userId: string) {
    return this.dailyStatusService.create(createDailyStatusDto, userId);
  }

  @Get()
  @ApiQuery({ name: 'date', required: false, example: '2025-01-18' })
  @ApiOperation({ summary: 'Get all daily statuses for a date' })
  findAll(@CurrentUser('organizationId') organizationId: string, @Query('date') date?: string) {
    return this.dailyStatusService.findAll(organizationId, date);
  }

  @Get('my')
  @ApiQuery({ name: 'date', required: false, example: '2025-01-18' })
  @ApiOperation({ summary: 'Get my daily status for a date' })
  findMy(@CurrentUser('id') userId: string, @Query('date') date?: string) {
    return this.dailyStatusService.findByUser(userId, date);
  }
}
