import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PropertyUsersService } from './property-users.service';
import { CreatePropertyUserDto } from './dto/create-property-user.dto';
import { UpdatePropertyUserDto } from './dto/update-property-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PropertyUser } from './domain/property-user';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllPropertyUsersDto } from './dto/find-all-property-users.dto';

@ApiTags('Propertyusers')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'property-users',
  version: '1',
})
export class PropertyUsersController {
  constructor(private readonly propertyUsersService: PropertyUsersService) {}

  @Post()
  @ApiCreatedResponse({
    type: PropertyUser,
  })
  create(@Body() createPropertyUserDto: CreatePropertyUserDto) {
    return this.propertyUsersService.create(createPropertyUserDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(PropertyUser),
  })
  async findAll(
    @Query() query: FindAllPropertyUsersDto,
  ): Promise<InfinityPaginationResponseDto<PropertyUser>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.propertyUsersService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: PropertyUser,
  })
  findById(@Param('id') id: string) {
    return this.propertyUsersService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: PropertyUser,
  })
  update(
    @Param('id') id: string,
    @Body() updatePropertyUserDto: UpdatePropertyUserDto,
  ) {
    return this.propertyUsersService.update(id, updatePropertyUserDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.propertyUsersService.remove(id);
  }
}
