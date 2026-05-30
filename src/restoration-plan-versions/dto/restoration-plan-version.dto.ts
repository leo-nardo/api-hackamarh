import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RestorationPlanVersionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
