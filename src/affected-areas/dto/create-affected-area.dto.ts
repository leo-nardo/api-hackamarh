import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { Polygon } from 'typeorm/driver/types/GeoJsonTypes';
import { PropertyDto } from '../../properties/dto/property.dto';
import { RestorationPlanVersionDto } from '../../restoration-plan-versions/dto/restoration-plan-version.dto';

export class CreateAffectedAreaDto {
  @ApiProperty({ type: () => PropertyDto })
  @ValidateNested()
  @Type(() => PropertyDto)
  @IsNotEmptyObject()
  property: PropertyDto;

  @ApiPropertyOptional({
    nullable: true,
    type: () => RestorationPlanVersionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RestorationPlanVersionDto)
  restorationPlanVersion?: RestorationPlanVersionDto | null;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  areaType?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [-48.123, -15.456],
          [-48.124, -15.456],
          [-48.124, -15.457],
          [-48.123, -15.456],
        ],
      ],
    },
  })
  @IsObject()
  geom: Polygon;

  @ApiPropertyOptional({ nullable: true, type: Number })
  @IsOptional()
  @IsNumber()
  areaHa?: number | null;

  @ApiPropertyOptional({ nullable: true, type: Number })
  @IsOptional()
  @IsNumber()
  priority?: number | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  notes?: string | null;
}
