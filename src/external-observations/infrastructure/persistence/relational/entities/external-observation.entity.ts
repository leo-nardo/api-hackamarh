import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Geometry } from 'typeorm/driver/types/GeoJsonTypes';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'external_observation',
})
export class ExternalObservationEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String })
  source: string;

  @Column({ name: 'observation_type', type: String })
  observationType: string;

  @Column({ name: 'entity_type', type: String })
  entityType: string;

  @Column({ name: 'entity_id', type: String })
  entityId: string;

  @Column({ name: 'observed_at', type: 'timestamptz' })
  observedAt: Date;

  @Column({ name: 'period_start', nullable: true, type: 'timestamptz' })
  periodStart?: Date | null;

  @Column({ name: 'period_end', nullable: true, type: 'timestamptz' })
  periodEnd?: Date | null;

  @Column({ name: 'query_params', nullable: true, type: 'jsonb' })
  queryParams?: Record<string, unknown> | null;

  @Column({ nullable: true, type: 'jsonb' })
  metrics?: Record<string, unknown> | null;

  @Column({
    nullable: true,
    srid: 4326,
    type: 'geometry',
  })
  geom?: Geometry | null;

  @Column({ name: 'raw_payload', nullable: true, type: 'jsonb' })
  rawPayload?: Record<string, unknown> | null;

  @Column({
    name: 'confidence_score',
    nullable: true,
    type: 'double precision',
  })
  confidenceScore?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
