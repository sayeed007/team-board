import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateListDto {
  @ApiProperty({ example: 'To Do' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  position?: number;
}
