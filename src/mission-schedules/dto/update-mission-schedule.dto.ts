// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateMissionScheduleDto } from './create-mission-schedule.dto';

export class UpdateMissionScheduleDto extends PartialType(
  CreateMissionScheduleDto,
) {}
