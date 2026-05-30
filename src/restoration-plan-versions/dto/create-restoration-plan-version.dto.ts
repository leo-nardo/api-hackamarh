import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RestorationPlanDto } from '../../restoration-plans/dto/restoration-plan.dto';
import { UserDto } from '../../users/dto/user.dto';

export class CreateRestorationPlanVersionDto {
  @ApiProperty({ type: () => RestorationPlanDto })
  @ValidateNested()
  @Type(() => RestorationPlanDto)
  @IsNotEmptyObject()
  restorationPlan: RestorationPlanDto;

  @ApiProperty({ type: Number })
  @IsNumber()
  versionNumber: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ nullable: true, type: () => UserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  proposedBy?: UserDto | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  documentUrl?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  summary?: string | null;

  @ApiPropertyOptional({ nullable: true, type: Object })
  @IsOptional()
  @IsObject()
  contentJson?: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  submittedAt?: Date | null;

  @ApiPropertyOptional({ nullable: true, type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  approvedAt?: Date | null;
}
