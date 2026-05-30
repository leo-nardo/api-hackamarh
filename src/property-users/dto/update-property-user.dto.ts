// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatePropertyUserDto } from './create-property-user.dto';

export class UpdatePropertyUserDto extends PartialType(CreatePropertyUserDto) {}
