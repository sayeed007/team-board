import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { CardStatus, CardPriority } from '@prisma/client';

export class CreateCardDto {
  @ApiProperty({ example: 'Implement user authentication' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Add JWT-based authentication to the API', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  listId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({ enum: CardStatus, example: CardStatus.TODO, required: false })
  @IsEnum(CardStatus)
  @IsOptional()
  status?: CardStatus;

  @ApiProperty({ enum: CardPriority, example: CardPriority.MEDIUM, required: false })
  @IsEnum(CardPriority)
  @IsOptional()
  priority?: CardPriority;

  @ApiProperty({ example: 8.5, required: false })
  @IsNumber()
  @IsOptional()
  estimateHours?: number;

  @ApiProperty({ example: '2025-01-30', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
