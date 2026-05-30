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
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'mission',
})
export class MissionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String })
  nome: string;

  @Column({ name: 'codigo_car', type: String })
  codigoCar: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  poligono: Polygon;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'tecnico_id' })
  tecnico: UserEntity;

  @Column({ default: 'pending', type: String })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
