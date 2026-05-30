import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Polygon } from 'typeorm/driver/types/GeoJsonTypes';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'property',
})
export class PropertyEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'car_code', type: String, unique: true })
  carCode: string;

  @Column({ type: String })
  name: string;

  @Column({ name: 'owner_name', nullable: true, type: String })
  ownerName?: string | null;

  @Column({ name: 'owner_document', nullable: true, type: String })
  ownerDocument?: string | null;

  @Column({ nullable: true, type: String })
  municipality?: string | null;

  @Column({ nullable: true, type: String })
  state?: string | null;

  @Column({
    name: 'total_area_ha',
    nullable: true,
    precision: 12,
    scale: 2,
    type: 'numeric',
  })
  totalAreaHa?: number | null;

  @Column({
    nullable: true,
    spatialFeatureType: 'Polygon',
    srid: 4326,
    type: 'geometry',
  })
  geom?: Polygon | null;

  @Column({ default: 'manual', type: String })
  source: string;

  @Column({ name: 'external_code', nullable: true, type: String })
  externalCode?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
