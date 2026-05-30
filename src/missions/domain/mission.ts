import { ApiProperty } from '@nestjs/swagger';
import { AffectedArea } from '../../affected-areas/domain/affected-area';
import { User } from '../../users/domain/user';

export class Mission {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  objective?: string | null;

  @ApiProperty({
    type: () => AffectedArea,
    nullable: true,
  })
  affectedArea?: AffectedArea | null;

  @ApiProperty({
    type: () => User,
  })
  assignedTo: User;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  createdBy?: User | null;

  @ApiProperty({
    enum: ['pending', 'scheduled', 'in_progress', 'submitted', 'completed'],
  })
  status: string;

  @ApiProperty({
    type: String,
  })
  priority: string;

  @ApiProperty({
    nullable: true,
    type: Date,
  })
  dueDate?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
