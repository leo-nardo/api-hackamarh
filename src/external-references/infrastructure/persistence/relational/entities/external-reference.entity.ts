import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'external_reference',
})
export class ExternalReferenceEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String })
  source: string;

  @Column({ name: 'reference_type', type: String })
  referenceType: string;

  @Column({ type: String })
  title: string;

  @Column({ nullable: true, type: 'text' })
  url?: string | null;

  @Column({ name: 'external_id', nullable: true, type: String })
  externalId?: string | null;

  @Column({ name: 'entity_type', type: String })
  entityType: string;

  @Column({ name: 'entity_id', type: String })
  entityId: string;

  @Column({ name: 'captured_at', nullable: true, type: 'timestamptz' })
  capturedAt?: Date | null;

  @Column({ name: 'metadata_json', nullable: true, type: 'jsonb' })
  metadataJson?: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
