// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAffectedAreaDto } from './create-affected-area.dto';

export class UpdateAffectedAreaDto extends PartialType(CreateAffectedAreaDto) {}
