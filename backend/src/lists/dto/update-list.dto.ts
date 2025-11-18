import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateListDto {
  @ApiProperty({ example: 'In Progress', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  position?: number;
}
