import { ApiProperty } from '@nestjs/swagger';
import type { Point } from 'typeorm/driver/types/GeoJsonTypes';
import { CollectionPoint } from '../../collection-points/domain/collection-point';
import { Mission } from '../../missions/domain/mission';
import { User } from '../../users/domain/user';

export class Evidence {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Mission,
  })
  mission: Mission;

  @ApiProperty({
    nullable: true,
    type: () => CollectionPoint,
  })
  collectionPoint?: CollectionPoint | null;

  @ApiProperty({
    nullable: true,
    type: () => User,
  })
  technician?: User | null;

  @ApiProperty({
    example: {
      type: 'Point',
      coordinates: [-48.123, -15.456],
    },
  })
  location: Point;

  @ApiProperty({
    type: String,
  })
  fotoUrl: string;

  @ApiProperty({
    type: Date,
  })
  capturedAt: Date;

  @ApiProperty({
    nullable: true,
    type: Date,
  })
  submittedAt?: Date | null;

  @ApiProperty({
    nullable: true,
    type: Number,
  })
  mortalityRate?: number | null;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  faseSucessional?: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  metodoRestauracao?: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  notes?: string | null;

  @ApiProperty({
    type: String,
  })
  validationStatus: string;

  @ApiProperty({
    nullable: true,
    type: String,
  })
  validationReason?: string | null;

  @ApiProperty({
    nullable: true,
    type: () => User,
  })
  validatedBy?: User | null;

  @ApiProperty({
    nullable: true,
    type: Date,
  })
  validatedAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
