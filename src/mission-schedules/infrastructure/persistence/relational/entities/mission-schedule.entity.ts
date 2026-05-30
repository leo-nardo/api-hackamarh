import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MissionEntity } from '../../../../../missions/infrastructure/persistence/relational/entities/mission.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'mission_schedule',
})
export class MissionScheduleEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MissionEntity, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mission_id' })
  mission: MissionEntity;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'timestamptz' })
  endsAt: Date;

  @Column({ name: 'deadline_at', nullable: true, type: 'timestamptz' })
  deadlineAt?: Date | null;

  @Column({ name: 'recurrence_rule', nullable: true, type: String })
  recurrenceRule?: string | null;

  @Column({ default: 'scheduled', type: String })
  status: string;

  @Column({ nullable: true, type: 'text' })
  notes?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
