import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateCollectionPointDto } from './dto/create-collection-point.dto';
import { UpdateCollectionPointDto } from './dto/update-collection-point.dto';
import { CollectionPointRepository } from './infrastructure/persistence/collection-point.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CollectionPoint } from './domain/collection-point';
import { AffectedArea } from '../affected-areas/domain/affected-area';
import { DeepPartial } from '../utils/types/deep-partial.type';

@Injectable()
export class CollectionPointsService {
  constructor(
    // Dependencies here
    private readonly collectionPointRepository: CollectionPointRepository,
  ) {}

  async create(createCollectionPointDto: CreateCollectionPointDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.collectionPointRepository.create({
      affectedArea: {
        id: createCollectionPointDto.affectedArea.id,
      } as AffectedArea,
      name: createCollectionPointDto.name,
      pointType: createCollectionPointDto.pointType ?? 'field_photo',
      location: createCollectionPointDto.location,
      radiusMeters: createCollectionPointDto.radiusMeters ?? 30,
      requiredPhotoCount: createCollectionPointDto.requiredPhotoCount ?? 1,
      instructions: createCollectionPointDto.instructions,
      sortOrder: createCollectionPointDto.sortOrder ?? 0,
      isActive: createCollectionPointDto.isActive ?? true,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.collectionPointRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: CollectionPoint['id']) {
    return this.collectionPointRepository.findById(id);
  }

  findByIds(ids: CollectionPoint['id'][]) {
    return this.collectionPointRepository.findByIds(ids);
  }

  async update(
    id: CollectionPoint['id'],
    updateCollectionPointDto: UpdateCollectionPointDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.collectionPointRepository.update(id, {
      affectedArea: updateCollectionPointDto.affectedArea
        ? ({ id: updateCollectionPointDto.affectedArea.id } as AffectedArea)
        : undefined,
      name: updateCollectionPointDto.name,
      pointType: updateCollectionPointDto.pointType,
      location: updateCollectionPointDto.location,
      radiusMeters: updateCollectionPointDto.radiusMeters,
      requiredPhotoCount: updateCollectionPointDto.requiredPhotoCount,
      instructions: updateCollectionPointDto.instructions,
      sortOrder: updateCollectionPointDto.sortOrder,
      isActive: updateCollectionPointDto.isActive,
      // Do not remove comment below.
      // <updating-property-payload />
    } as DeepPartial<CollectionPoint>);
  }

  remove(id: CollectionPoint['id']) {
    return this.collectionPointRepository.remove(id);
  }
}
