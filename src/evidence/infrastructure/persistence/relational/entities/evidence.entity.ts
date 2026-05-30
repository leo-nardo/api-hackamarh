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
import { CollectionPointEntity } from '../../../../../collection-points/infrastructure/persistence/relational/entities/collection-point.entity';
import { MissionEntity } from '../../../../../missions/infrastructure/persistence/relational/entities/mission.entity';
import { PropertyEntity } from '../../../../../properties/infrastructure/persistence/relational/entities/property.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'evidence',
})
export class EvidenceEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'pending', type: String })
  status: string;

  @ManyToOne(() => MissionEntity, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'mission_id' })
  mission: MissionEntity;

  @ManyToOne(() => PropertyEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'property_id' })
  property?: PropertyEntity | null;

  @ManyToOne(() => CollectionPointEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'collection_point_id' })
  collectionPoint?: CollectionPointEntity | null;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'technician_id' })
  technician?: UserEntity | null;

  @Column({
    name: 'coordenada',
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Point;

  @Column({
    nullable: true,
    type: 'double precision',
  })
  altitude?: number | null;

  @Column({ name: 'foto_url', type: 'text' })
  fotoUrl: string;

  @Column({ name: 'timestamp', type: 'timestamptz' })
  capturedAt: Date;

  @Column({ name: 'submitted_at', nullable: true, type: 'timestamptz' })
  submittedAt?: Date | null;

  @Column({ name: 'device_model', nullable: true, type: String })
  deviceModel?: string | null;

  @Column({
    name: 'mortalidade_taxa',
    nullable: true,
    type: 'double precision',
  })
  mortalityRate?: number | null;

  @Column({ name: 'fase_sucessional', nullable: true, type: String })
  faseSucessional?: string | null;

  @Column({ name: 'metodo_restauracao', nullable: true, type: String })
  metodoRestauracao?: string | null;

  @Column({ nullable: true, type: 'text' })
  notes?: string | null;

  @Column({ name: 'validation_reason', nullable: true, type: 'text' })
  validationReason?: string | null;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'validated_by' })
  validatedBy?: UserEntity | null;

  @Column({ name: 'validated_at', nullable: true, type: 'timestamptz' })
  validatedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
