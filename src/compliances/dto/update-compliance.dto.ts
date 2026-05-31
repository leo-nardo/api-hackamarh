// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateComplianceDto } from './create-compliance.dto';

export class UpdateComplianceDto extends PartialType(CreateComplianceDto) {}
