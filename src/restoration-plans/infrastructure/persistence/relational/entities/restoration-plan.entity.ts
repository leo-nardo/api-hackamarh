import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyEntity } from '../../../../../properties/infrastructure/persistence/relational/entities/property.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'restoration_plan',
})
export class RestorationPlanEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PropertyEntity, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  @Column({ type: String })
  title: string;

  @Column({ default: 'draft', type: String })
  status: string;

  @Column({ default: 'prad', name: 'plan_type', type: String })
  planType: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy?: UserEntity | null;

  @Column({ name: 'current_version_id', nullable: true, type: 'uuid' })
  currentVersionId?: string | null;

  @Column({ name: 'approved_at', nullable: true, type: 'timestamptz' })
  approvedAt?: Date | null;

  @Column({ nullable: true, type: 'text' })
  notes?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
