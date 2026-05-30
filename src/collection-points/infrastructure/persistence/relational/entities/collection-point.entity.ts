import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Point } from 'typeorm/driver/types/GeoJsonTypes';
import { AffectedAreaEntity } from '../../../../../affected-areas/infrastructure/persistence/relational/entities/affected-area.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'collection_point',
})
export class CollectionPointEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AffectedAreaEntity, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'affected_area_id' })
  affectedArea: AffectedAreaEntity;

  @Column({ type: String })
  name: string;

  @Column({ default: 'field_photo', name: 'point_type', type: String })
  pointType: string;

  @Column({
    spatialFeatureType: 'Point',
    srid: 4326,
    type: 'geometry',
  })
  location: Point;

  @Column({ default: 30, name: 'radius_meters', type: 'integer' })
  radiusMeters: number;

  @Column({ default: 1, name: 'required_photo_count', type: 'integer' })
  requiredPhotoCount: number;

  @Column({ nullable: true, type: 'text' })
  instructions?: string | null;

  @Column({ default: 0, name: 'sort_order', type: 'integer' })
  sortOrder: number;

  @Column({ default: true, name: 'is_active', type: Boolean })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
