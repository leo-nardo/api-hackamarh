// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateRestorationPlanDto } from './create-restoration-plan.dto';

export class UpdateRestorationPlanDto extends PartialType(
  CreateRestorationPlanDto,
) {}
