import { ApiProperty } from '@nestjs/swagger';
import { Mission } from '../../missions/domain/mission';

export class MissionSchedule {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => Mission })
  mission: Mission;

  @ApiProperty({ type: Date })
  startsAt: Date;

  @ApiProperty({ type: Date })
  endsAt: Date;

  @ApiProperty({ nullable: true, type: Date })
  deadlineAt?: Date | null;

  @ApiProperty({ nullable: true, type: String })
  recurrenceRule?: string | null;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ nullable: true, type: String })
  notes?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
