import { ApiProperty } from '@nestjs/swagger';
import type { Polygon } from 'typeorm/driver/types/GeoJsonTypes';
import { User } from '../../users/domain/user';

export class Mission {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  nome: string;

  @ApiProperty({
    type: String,
  })
  codigoCar: string;

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
  poligono: Polygon;

  @ApiProperty({
    type: () => User,
  })
  tecnico: User;

  @ApiProperty({
    enum: ['pending', 'completed'],
  })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
