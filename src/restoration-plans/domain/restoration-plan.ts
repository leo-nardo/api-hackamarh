import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../properties/domain/property';
import { User } from '../../users/domain/user';

export class RestorationPlan {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => Property })
  property: Property;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ type: String })
  planType: string;

  @ApiProperty({ nullable: true, type: () => User })
  createdBy?: User | null;

  @ApiProperty({ nullable: true, type: String })
  currentVersionId?: string | null;

  @ApiProperty({ nullable: true, type: Date })
  approvedAt?: Date | null;

  @ApiProperty({ nullable: true, type: String })
  notes?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
