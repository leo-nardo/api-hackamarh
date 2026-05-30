import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MissionDto } from '../../missions/dto/mission.dto';

export class CreateMissionScheduleDto {
  @ApiProperty({ type: () => MissionDto })
  @ValidateNested()
  @Type(() => MissionDto)
  @IsNotEmptyObject()
  mission: MissionDto;

  @ApiProperty({ type: Date })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startsAt: Date;

  @ApiProperty({ type: Date })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endsAt: Date;

  @ApiPropertyOptional({ nullable: true, type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  deadlineAt?: Date | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  recurrenceRule?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  notes?: string | null;
}
