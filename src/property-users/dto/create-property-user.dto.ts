import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PropertyDto } from '../../properties/dto/property.dto';
import { UserDto } from '../../users/dto/user.dto';

export class CreatePropertyUserDto {
  @ApiProperty({
    type: () => PropertyDto,
  })
  @ValidateNested()
  @Type(() => PropertyDto)
  @IsNotEmptyObject()
  property: PropertyDto;

  @ApiProperty({
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  canSubmitEvidence?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  canManageProperty?: boolean;

  @ApiPropertyOptional({
    nullable: true,
    type: Date,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  startsAt?: Date | null;

  @ApiPropertyOptional({
    nullable: true,
    type: Date,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  endsAt?: Date | null;
}
