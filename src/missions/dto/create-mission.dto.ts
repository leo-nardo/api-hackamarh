import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';
import { AffectedAreaDto } from '../../affected-areas/dto/affected-area.dto';
import { UserDto } from '../../users/dto/user.dto';

export class CreateMissionDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  objective?: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
    type: () => AffectedAreaDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AffectedAreaDto)
  affectedArea?: AffectedAreaDto | null;

  @ApiProperty({
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  assignedTo: UserDto;

  @ApiProperty({
    nullable: true,
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  createdBy?: UserDto | null;

  @ApiProperty({
    enum: ['pending', 'scheduled', 'in_progress', 'submitted', 'completed'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'scheduled', 'in_progress', 'submitted', 'completed'])
  status?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({
    nullable: true,
    required: false,
    type: Date,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  dueDate?: Date | null;
}
