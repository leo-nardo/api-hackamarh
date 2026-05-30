import { ApiProperty } from '@nestjs/swagger';
import type { Polygon } from 'typeorm/driver/types/GeoJsonTypes';

export class Property {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  carCode: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  ownerName?: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  ownerDocument?: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  municipality?: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  state?: string | null;

  @ApiProperty({
    nullable: true,
    type: Number,
  })
  totalAreaHa?: number | null;

  @ApiProperty({
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
  geom?: Polygon | null;

  @ApiProperty({
    type: String,
  })
  source: string;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  externalCode?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
