import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: 'Q1 2025 Sprint' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Sprint board for Q1 initiatives', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  @IsOptional()
  teamId?: string;
}
