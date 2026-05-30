import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RestorationPlanEntity } from '../../../../../restoration-plans/infrastructure/persistence/relational/entities/restoration-plan.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'restoration_plan_version',
})
export class RestorationPlanVersionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RestorationPlanEntity, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restoration_plan_id' })
  restorationPlan: RestorationPlanEntity;

  @Column({ name: 'version_number', type: 'integer' })
  versionNumber: number;

  @Column({ default: 'technician', type: String })
  source: string;

  @Column({ default: 'proposed', type: String })
  status: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'proposed_by' })
  proposedBy?: UserEntity | null;

  @Column({ name: 'document_url', nullable: true, type: 'text' })
  documentUrl?: string | null;

  @Column({ nullable: true, type: 'text' })
  summary?: string | null;

  @Column({ name: 'content_json', nullable: true, type: 'jsonb' })
  contentJson?: Record<string, unknown> | null;

  @Column({ name: 'submitted_at', nullable: true, type: 'timestamptz' })
  submittedAt?: Date | null;

  @Column({ name: 'approved_at', nullable: true, type: 'timestamptz' })
  approvedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
