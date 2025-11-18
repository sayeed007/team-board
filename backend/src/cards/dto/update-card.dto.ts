import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { CardStatus, CardPriority } from '@prisma/client';

export class UpdateCardDto {
  @ApiProperty({ example: 'Updated card title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({ enum: CardStatus, required: false })
  @IsEnum(CardStatus)
  @IsOptional()
  status?: CardStatus;

  @ApiProperty({ enum: CardPriority, required: false })
  @IsEnum(CardPriority)
  @IsOptional()
  priority?: CardPriority;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @IsOptional()
  estimateHours?: number;

  @ApiProperty({ example: '2025-02-01', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
