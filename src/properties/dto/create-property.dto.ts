import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import type { Polygon } from 'typeorm/driver/types/GeoJsonTypes';

export class CreatePropertyDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  carCode: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  ownerName?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  ownerDocument?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  municipality?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  state?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  totalAreaHa?: number | null;

  @ApiPropertyOptional({
    nullable: true,
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
  @IsOptional()
  @IsObject()
  geom?: Polygon | null;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  externalCode?: string | null;
}
