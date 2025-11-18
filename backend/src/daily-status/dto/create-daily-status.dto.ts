import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Mood } from '@prisma/client';

export class CreateDailyStatusDto {
  @ApiProperty({ example: '2025-01-18', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 'Completed authentication module and started working on boards' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ example: 'Waiting for design approval', required: false })
  @IsString()
  @IsOptional()
  blockers?: string;

  @ApiProperty({ enum: Mood, example: Mood.HAPPY, required: false })
  @IsEnum(Mood)
  @IsOptional()
  mood?: Mood;
}
