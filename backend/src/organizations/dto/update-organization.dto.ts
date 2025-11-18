import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty({ example: 'Updated Organization Name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: { defaultWorkHours: 8, workingDays: ['Monday', 'Tuesday'] },
    required: false,
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}
