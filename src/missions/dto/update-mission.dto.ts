// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateMissionDto } from './create-mission.dto';

export class UpdateMissionDto extends PartialType(CreateMissionDto) {}
