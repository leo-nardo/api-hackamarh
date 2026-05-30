// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateRestorationPlanVersionDto } from './create-restoration-plan-version.dto';

export class UpdateRestorationPlanVersionDto extends PartialType(
  CreateRestorationPlanVersionDto,
) {}
