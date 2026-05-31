import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class InviteOwnerDto {
  @ApiProperty({ example: 'proprietario@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'João' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Silva' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'TO-1721000-C36D0001D696444AA0C94E914C0C46E6' })
  @IsNotEmpty()
  @IsString()
  carCode: string;

  @ApiProperty({ example: 'Fazenda Estrela' })
  @IsOptional()
  @IsString()
  propertyName?: string;
}
