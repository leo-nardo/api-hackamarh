import { ApiProperty } from '@nestjs/swagger';
import type { Point } from 'typeorm/driver/types/GeoJsonTypes';
import { AffectedArea } from '../../affected-areas/domain/affected-area';

export class CollectionPoint {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => AffectedArea })
  affectedArea: AffectedArea;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  pointType: string;

  @ApiProperty({
    example: {
      type: 'Point',
      coordinates: [-48.123, -15.456],
    },
  })
  location: Point;

  @ApiProperty({ type: Number })
  radiusMeters: number;

  @ApiProperty({ type: Number })
  requiredPhotoCount: number;

  @ApiProperty({ nullable: true, type: String })
  instructions?: string | null;

  @ApiProperty({ type: Number })
  sortOrder: number;

  @ApiProperty({ type: Boolean })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
