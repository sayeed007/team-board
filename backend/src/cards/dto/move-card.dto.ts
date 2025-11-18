import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsOptional } from 'class-validator';

export class MoveCardDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  listId: string;

  @ApiProperty({ example: 2, required: false })
  @IsInt()
  @IsOptional()
  position?: number;
}
