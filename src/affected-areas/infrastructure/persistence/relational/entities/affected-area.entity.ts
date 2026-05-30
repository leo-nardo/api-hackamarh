import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Polygon } from 'typeorm/driver/types/GeoJsonTypes';
import { PropertyEntity } from '../../../../../properties/infrastructure/persistence/relational/entities/property.entity';
import { RestorationPlanVersionEntity } from '../../../../../restoration-plan-versions/infrastructure/persistence/relational/entities/restoration-plan-version.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'affected_area',
})
export class AffectedAreaEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PropertyEntity, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  @ManyToOne(() => RestorationPlanVersionEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'restoration_plan_version_id' })
  restorationPlanVersion?: RestorationPlanVersionEntity | null;

  @Column({ type: String })
  name: string;

  @Column({ default: 'restoration', name: 'area_type', type: String })
  areaType: string;

  @Column({ default: 'active', type: String })
  status: string;

  @Column({
    spatialFeatureType: 'Polygon',
    srid: 4326,
    type: 'geometry',
  })
  geom: Polygon;

  @Column({
    name: 'area_ha',
    nullable: true,
    precision: 12,
    scale: 2,
    type: 'numeric',
  })
  areaHa?: number | null;

  @Column({ nullable: true, type: 'integer' })
  priority?: number | null;

  @Column({ nullable: true, type: 'text' })
  notes?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
