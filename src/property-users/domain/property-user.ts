import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../properties/domain/property';
import { User } from '../../users/domain/user';

export class PropertyUser {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Property,
  })
  property: Property;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    type: String,
  })
  role: string;

  @ApiProperty({
    type: Boolean,
  })
  canSubmitEvidence: boolean;

  @ApiProperty({
    type: Boolean,
  })
  canManageProperty: boolean;

  @ApiProperty({
    nullable: true,
    type: Date,
  })
  startsAt?: Date | null;

  @ApiProperty({
    nullable: true,
    type: Date,
  })
  endsAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
