import { ApiProperty } from '@nestjs/swagger';
import type { Polygon } from 'typeorm/driver/types/GeoJsonTypes';
import { Property } from '../../properties/domain/property';
import { RestorationPlanVersion } from '../../restoration-plan-versions/domain/restoration-plan-version';

export class AffectedArea {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => Property })
  property: Property;

  @ApiProperty({ nullable: true, type: () => RestorationPlanVersion })
  restorationPlanVersion?: RestorationPlanVersion | null;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  areaType: string;

  @ApiProperty({ type: String })
  status: string;

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
  geom: Polygon;

  @ApiProperty({ nullable: true, type: Number })
  areaHa?: number | null;

  @ApiProperty({ nullable: true, type: Number })
  priority?: number | null;

  @ApiProperty({ nullable: true, type: String })
  notes?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
