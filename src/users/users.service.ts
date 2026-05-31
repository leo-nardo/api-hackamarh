import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { FilesService } from '../files/files.service';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FileType } from '../files/domain/file';
import { Role } from '../roles/domain/role';
import { Status } from '../statuses/domain/status';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteOwnerDto } from './dto/invite-owner.dto';
import { MailService } from '../mail/mail.service';
import { PropertyRepository } from '../properties/infrastructure/persistence/property.repository';
import { PropertyUserRepository } from '../property-users/infrastructure/persistence/property-user.repository';
import { MapBiomasService } from '../external-observations/mapbiomas.service';
import crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
    private readonly mailService: MailService,
    private readonly propertyRepository: PropertyRepository,
    private readonly propertyUserRepository: PropertyUserRepository,
    private readonly mapBiomasService: MapBiomasService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Do not remove comment below.
    // <creating-property />

    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;

    if (createUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        createUserDto.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
      email = createUserDto.email;
    }

    let photo: FileType | null | undefined = undefined;

    if (createUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        createUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (createUserDto.photo === null) {
      photo = null;
    }

    let role: Role | undefined = undefined;

    if (createUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(createUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: createUserDto.role.id,
      };
    }

    let status: Status | undefined = undefined;

    if (createUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(createUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: createUserDto.status.id,
      };
    }

    return this.usersRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      inviteExpires: createUserDto.inviteExpires,

      inviteCode: createUserDto.inviteCode,

      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      password: password,
      photo: photo,
      role: role,
      status: status,
      provider: createUserDto.provider ?? AuthProvidersEnum.email,
      socialId: createUserDto.socialId,
    });
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  findByIds(ids: User['id'][]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    return this.usersRepository.findBySocialIdAndProvider({
      socialId,
      provider,
    });
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Do not remove comment below.
    // <updating-property />

    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let photo: FileType | null | undefined = undefined;

    if (updateUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        updateUserDto.photo.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (updateUserDto.photo === null) {
      photo = null;
    }

    let role: Role | undefined = undefined;

    if (updateUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(updateUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: updateUserDto.role.id,
      };
    }

    let status: Status | undefined = undefined;

    if (updateUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(updateUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: updateUserDto.status.id,
      };
    }

    return this.usersRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      inviteExpires: updateUserDto.inviteExpires,

      inviteCode: updateUserDto.inviteCode,

      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      photo,
      role,
      status,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
    });
  }

  async inviteOwner(inviteDto: InviteOwnerDto): Promise<User> {
    // 1. Verificar se a propriedade já existe pelo CAR
    const properties = await this.propertyRepository.findManyWithPagination({
      paginationOptions: { page: 1, limit: 10 },
    });
    // Nota: Idealmente o repository teria um findByCarCode
    let property = properties.find((p) => p.carCode === inviteDto.carCode);

    if (!property) {
      // Se não existir, criamos uma básica
      property = await this.propertyRepository.create({
        carCode: inviteDto.carCode,
        name: inviteDto.propertyName || `Propriedade ${inviteDto.carCode}`,
        source: 'engineer_invite',
      });
    }

    // 2. Criar ou buscar o usuário
    let user = await this.usersRepository.findByEmail(inviteDto.email);
    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // Ex: A1B2C3
    const inviteExpires = new Date();
    inviteExpires.setHours(inviteExpires.getHours() + 24);

    if (!user) {
      user = await this.usersRepository.create({
        email: inviteDto.email,
        firstName: inviteDto.firstName,
        lastName: inviteDto.lastName,
        role: { id: RoleEnum.user },
        status: { id: StatusEnum.inactive },
        provider: AuthProvidersEnum.email,
        inviteCode,
        inviteExpires,
      });
    } else {
      // Atualiza o código se o usuário já existir
      user = await this.usersRepository.update(user.id, {
        inviteCode,
        inviteExpires,
      });
    }

    // 3. Vincular usuário à propriedade
    // Verificar se já existe vínculo
    const propertyUsers =
      await this.propertyUserRepository.findAllWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });

    const existingLink = propertyUsers.find(
      (pu) => pu.user?.id === user?.id && pu.property?.id === property?.id,
    );

    if (!existingLink && user) {
      await this.propertyUserRepository.create({
        user,
        property,
        role: 'owner',
        canSubmitEvidence: true,
        canManageProperty: true,
      });
    }

    // 4. Disparar E-mail
    await this.mailService.sendInviteCode({
      to: inviteDto.email,
      data: {
        code: inviteCode,
        firstName: inviteDto.firstName,
      },
    });

    // 5. Trigger MapBiomas Sync em background (opcional, mas recomendado)
    void this.mapBiomasService.fetchLulcHistory(inviteDto.carCode);
    void this.mapBiomasService.fetchDegradationMetrics(inviteDto.carCode);

    return user!;
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }
}
