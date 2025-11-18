import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class ExportDailySummaryDto {
  @ApiProperty({ example: '2025-01-18' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  teamId?: string;
}
