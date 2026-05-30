import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AffectedAreaEntity } from '../../../../../affected-areas/infrastructure/persistence/relational/entities/affected-area.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'mission',
})
export class MissionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', type: String })
  name: string;

  @Column({ nullable: true, type: 'text' })
  objective?: string | null;

  @ManyToOne(() => AffectedAreaEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'affected_area_id' })
  affectedArea?: AffectedAreaEntity | null;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'tecnico_id' })
  assignedTo: UserEntity;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy?: UserEntity | null;

  @Column({ default: 'scheduled', type: String })
  status: string;

  @Column({ default: 'normal', type: String })
  priority: string;

  @Column({ name: 'due_date', nullable: true, type: 'date' })
  dueDate?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
