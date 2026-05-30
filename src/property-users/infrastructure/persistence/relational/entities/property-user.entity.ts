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
  name: 'property_user',
})
export class PropertyUserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PropertyEntity, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ default: 'owner', type: String })
  role: string;

  @Column({ default: false, name: 'can_submit_evidence', type: Boolean })
  canSubmitEvidence: boolean;

  @Column({ default: false, name: 'can_manage_property', type: Boolean })
  canManageProperty: boolean;

  @Column({ name: 'starts_at', nullable: true, type: 'timestamptz' })
  startsAt?: Date | null;

  @Column({ name: 'ends_at', nullable: true, type: 'timestamptz' })
  endsAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
