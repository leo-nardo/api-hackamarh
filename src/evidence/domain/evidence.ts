import { ApiProperty } from '@nestjs/swagger';
import type { Point } from 'typeorm/driver/types/GeoJsonTypes';
import { Mission } from '../../missions/domain/mission';

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
    example: {
      type: 'Point',
      coordinates: [-48.123, -15.456],
    },
  })
  coordenada: Point;

  @ApiProperty({
    type: String,
  })
  fotoUrl: string;

  @ApiProperty({
    type: Date,
  })
  timestamp: Date;

  @ApiProperty({
    nullable: true,
    type: Number,
  })
  mortalidadeTaxa?: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
