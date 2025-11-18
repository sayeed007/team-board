import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Engineering Team' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Software development team', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
