import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PropertyDto } from '../../properties/dto/property.dto';
import { UserDto } from '../../users/dto/user.dto';

export class CreateRestorationPlanDto {
  @ApiProperty({ type: () => PropertyDto })
  @ValidateNested()
  @Type(() => PropertyDto)
  @IsNotEmptyObject()
  property: PropertyDto;

  @ApiProperty({ type: String })
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  planType?: string;

  @ApiPropertyOptional({ nullable: true, type: () => UserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  createdBy?: UserDto | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  currentVersionId?: string | null;

  @ApiPropertyOptional({ nullable: true, type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  approvedAt?: Date | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  notes?: string | null;
}
