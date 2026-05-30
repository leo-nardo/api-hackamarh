import { ApiProperty } from '@nestjs/swagger';
import { RestorationPlan } from '../../restoration-plans/domain/restoration-plan';
import { User } from '../../users/domain/user';

export class RestorationPlanVersion {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => RestorationPlan })
  restorationPlan: RestorationPlan;

  @ApiProperty({ type: Number })
  versionNumber: number;

  @ApiProperty({ type: String })
  source: string;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ nullable: true, type: () => User })
  proposedBy?: User | null;

  @ApiProperty({ nullable: true, type: String })
  documentUrl?: string | null;

  @ApiProperty({ nullable: true, type: String })
  summary?: string | null;

  @ApiProperty({ nullable: true, type: Object })
  contentJson?: Record<string, unknown> | null;

  @ApiProperty({ nullable: true, type: Date })
  submittedAt?: Date | null;

  @ApiProperty({ nullable: true, type: Date })
  approvedAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
