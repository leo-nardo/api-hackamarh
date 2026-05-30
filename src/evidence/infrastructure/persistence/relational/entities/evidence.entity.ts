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
import { MissionEntity } from '../../../../../missions/infrastructure/persistence/relational/entities/mission.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'evidence',
})
export class EvidenceEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MissionEntity, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'mission_id' })
  mission: MissionEntity;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordenada: Point;

  @Column({ name: 'foto_url', type: String })
  fotoUrl: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({
    name: 'mortalidade_taxa',
    nullable: true,
    type: 'double precision',
  })
  mortalidadeTaxa?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
