import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreatePropertyUserDto } from './dto/create-property-user.dto';
import { UpdatePropertyUserDto } from './dto/update-property-user.dto';
import { PropertyUserRepository } from './infrastructure/persistence/property-user.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PropertyUser } from './domain/property-user';
import { Property } from '../properties/domain/property';
import { User } from '../users/domain/user';

@Injectable()
export class PropertyUsersService {
  constructor(
    // Dependencies here
    private readonly propertyUserRepository: PropertyUserRepository,
  ) {}

  async create(createPropertyUserDto: CreatePropertyUserDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.propertyUserRepository.create({
      property: { id: createPropertyUserDto.property.id } as Property,
      user: { id: createPropertyUserDto.user.id } as User,
      role: createPropertyUserDto.role ?? 'owner',
      canSubmitEvidence: createPropertyUserDto.canSubmitEvidence ?? false,
      canManageProperty: createPropertyUserDto.canManageProperty ?? false,
      startsAt: createPropertyUserDto.startsAt,
      endsAt: createPropertyUserDto.endsAt,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.propertyUserRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: PropertyUser['id']) {
    return this.propertyUserRepository.findById(id);
  }

  findByIds(ids: PropertyUser['id'][]) {
    return this.propertyUserRepository.findByIds(ids);
  }

  async update(
    id: PropertyUser['id'],
    updatePropertyUserDto: UpdatePropertyUserDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.propertyUserRepository.update(id, {
      property: updatePropertyUserDto.property
        ? ({ id: updatePropertyUserDto.property.id } as Property)
        : undefined,
      user: updatePropertyUserDto.user
        ? ({ id: updatePropertyUserDto.user.id } as User)
        : undefined,
      role: updatePropertyUserDto.role,
      canSubmitEvidence: updatePropertyUserDto.canSubmitEvidence,
      canManageProperty: updatePropertyUserDto.canManageProperty,
      startsAt: updatePropertyUserDto.startsAt,
      endsAt: updatePropertyUserDto.endsAt,
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: PropertyUser['id']) {
    return this.propertyUserRepository.remove(id);
  }
}
