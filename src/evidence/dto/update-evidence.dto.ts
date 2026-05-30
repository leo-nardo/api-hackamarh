// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateEvidenceDto } from './create-evidence.dto';

export class UpdateEvidenceDto extends PartialType(CreateEvidenceDto) {}
