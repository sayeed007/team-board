import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This looks good! Let me review the implementation.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
