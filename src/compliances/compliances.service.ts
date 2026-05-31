import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateComplianceDto } from './dto/create-compliance.dto';
import { UpdateComplianceDto } from './dto/update-compliance.dto';
import { ComplianceRepository } from './infrastructure/persistence/compliance.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Compliance } from './domain/compliance';
import { ExternalObservationRepository } from '../external-observations/infrastructure/persistence/external-observation.repository';
import { EvidenceRepository } from '../evidence/infrastructure/persistence/evidence.repository';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { AffectedAreaRepository } from '../affected-areas/infrastructure/persistence/affected-area.repository';
import { PropertyRepository } from '../properties/infrastructure/persistence/property.repository';
import { MapBiomasService } from '../external-observations/mapbiomas.service';

@Injectable()
export class CompliancesService {
  constructor(
    private readonly complianceRepository: ComplianceRepository,
    private readonly externalObservationRepository: ExternalObservationRepository,
    private readonly evidenceRepository: EvidenceRepository,
    private readonly affectedAreaRepository: AffectedAreaRepository,
    private readonly propertyRepository: PropertyRepository,
    private readonly mapBiomasService: MapBiomasService,
  ) {}

  /**
   * Resumo de Auditoria para o Analista Ambiental.
   * Cruza dados de satélite (MapBiomas) com evidências de campo (Técnico).
   */
  async getAuditSummary(carCode: string) {
    // 1. Buscar observações de satélite recentes
    const satObservations =
      await this.externalObservationRepository.findAllWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });

    // Filtrar pelo carCode (simulando busca por entidade)
    const propertySatData = satObservations.filter(
      (obs) => obs.entityId === carCode,
    );

    const lulcHistory = propertySatData.find(
      (obs) => obs.observationType === 'lulc_history',
    );
    const degradation = propertySatData.find(
      (obs) => obs.observationType === 'degradation_stats',
    );
    const alerts = propertySatData.filter(
      (obs) => obs.observationType === 'deforestation_alert',
    );

    // 2. Buscar evidências de campo recentes
    const allEvidence = await this.evidenceRepository.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100 },
    });

    const fieldEvidence = allEvidence.filter(
      (ev) => ev.property?.carCode === carCode,
    );

    // 3. Lógica de Triangulação (Inteligência do Analista)
    const indicators = {
      satelliteRegenerationYears:
        (lulcHistory?.metrics?.['regeneration_years'] as number) || 0,
      fieldMortalityRate:
        fieldEvidence.length > 0
          ? fieldEvidence.reduce((acc, ev) => acc + (ev.mortalityRate || 0), 0) /
            fieldEvidence.length
          : null,
      hasRecentAlerts: alerts.length > 0,
      fireRisk: (degradation?.metrics?.['fire_frequency_10y'] as number) || 0,
    };

    let recommendation = 'YELLOW (Needs Review)';
    let recommendationReason = 'Aguardando mais evidências de campo.';

    if (
      indicators.satelliteRegenerationYears >= 2 &&
      indicators.fieldMortalityRate !== null &&
      indicators.fieldMortalityRate < 20
    ) {
      recommendation = 'GREEN (Compliant)';
      recommendationReason =
        'Satélite confirma regeneração e campo confirma baixa mortalidade.';
    } else if (indicators.hasRecentAlerts) {
      recommendation = 'RED (Non-Compliant)';
      recommendationReason =
        'Alertas de desmatamento recentes detectados após início do PRAD.';
    }

    return {
      carCode,
      analysisDate: new Date(),
      triangulation: {
        satellite: {
          currentClass: lulcHistory?.metrics?.['last_class'] || 'Unknown',
          regenerationYears: indicators.satelliteRegenerationYears,
          fireHistory: indicators.fireRisk,
          alertsCount: alerts.length,
        },
        field: {
          evidenceCount: fieldEvidence.length,
          averageMortalityRate: indicators.fieldMortalityRate,
          latestPhotos: fieldEvidence.map((ev) => ev.fotoUrl).slice(0, 3),
        },
      },
      audit: {
        recommendation,
        reason: recommendationReason,
        status: recommendation.split(' ')[0], // GREEN, YELLOW, RED
      },
    };
  }

  /**
   * Endpoint de Compatibilidade para o Front-Arara.
   * Transforma nossos dados reais no formato do mock esperado pelo frontend.
   */
  async getRecoveryAnalysis(carCode: string) {
    // 1. Buscar Propriedade
    const properties = await this.propertyRepository.findManyWithPagination({
      paginationOptions: { page: 1, limit: 100 },
    });
    const property = properties.find((p) => p.carCode === carCode);

    if (!property) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { property: 'notFound' },
      });
    }

    // 2. Buscar Áreas Afetadas vinculadas
    const allAreas = await this.affectedAreaRepository.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100 },
    });
    const propertyAreas = allAreas.filter((a) => a.property?.id === property.id);
    const mainArea = propertyAreas[0];

    // 3. Buscar Evidências
    const allEvidence = await this.evidenceRepository.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100 },
    });
    const fieldEvidence = allEvidence.filter(
      (ev) => ev.property?.id === property.id,
    );

    // 4. Buscar Dados do MapBiomas
    const satObservations =
      await this.externalObservationRepository.findAllWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });
    const propertySatData = satObservations.filter(
      (obs) => obs.entityId === carCode,
    );
    const lulcHistory = propertySatData.find(
      (obs) => obs.observationType === 'lulc_history',
    );

    // 5. Mapear para o formato do Frontend (RecoveryAnalysisDataset)
    const mapPolygon = (geom: any): [number, number][] => {
      if (!geom || !geom.coordinates) return [];
      return geom.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
    };

    const monitoringPoints = fieldEvidence.map((ev, index) => {
      const satImage = this.mapBiomasService.getSatelliteImageryForPoint(
        ev.location.coordinates[1],
        ev.location.coordinates[0],
      );

      return {
        id: ev.id,
        code: `P${index + 1}`,
        latitude: ev.location.coordinates[1],
        longitude: ev.location.coordinates[0],
        owner: property.ownerName || 'Proprietário não informado',
        observations: ev.notes || 'Sem observações adicionais.',
        status:
          ev.mortalityRate && ev.mortalityRate > 30
            ? 'critical'
            : ev.mortalityRate && ev.mortalityRate > 15
              ? 'attention'
              : 'adequate',
        createdAt: ev.capturedAt.toISOString(),
        hasPanorama: false,
        satellite: {
          currentDate: satImage.date,
          previousDate: '2025-01-01',
          currentImageUrl: satImage.imageryUrl,
          previousImageUrl: satImage.imageryUrl,
          ndviTrend: (lulcHistory?.metrics?.['ndvi_trend'] as number) || 5,
        },
        photos: {
          north: {
            id: `${ev.id}-n`,
            direction: 'north',
            title: 'Foto de Campo',
            imageUrl: ev.fotoUrl,
            capturedAt: ev.capturedAt.toISOString(),
          },
          south: {
            id: `${ev.id}-s`,
            direction: 'south',
            title: 'Foto de Campo',
            imageUrl: ev.fotoUrl,
            capturedAt: ev.capturedAt.toISOString(),
          },
          east: {
            id: `${ev.id}-e`,
            direction: 'east',
            title: 'Foto de Campo',
            imageUrl: ev.fotoUrl,
            capturedAt: ev.capturedAt.toISOString(),
          },
          west: {
            id: `${ev.id}-w`,
            direction: 'west',
            title: 'Foto de Campo',
            imageUrl: ev.fotoUrl,
            capturedAt: ev.capturedAt.toISOString(),
          },
        },
      };
    });

    return {
      area: {
        id: property.id,
        semarhCode: `CAR-${property.carCode.substring(0, 8)}`,
        name: property.name,
        propertyName: property.name,
        owner: property.ownerName || 'Não informado',
        municipality: property.municipality || 'Tocantins',
        totalAreaHectares: property.totalAreaHa || 0,
        recoveryAreaHectares: mainArea?.areaHa || 0,
        centroid: mainArea?.geom
          ? [
              mainArea.geom.coordinates[0][0][1],
              mainArea.geom.coordinates[0][0][0],
            ]
          : [-10.2, -48.3],
        recoveryPolygon: mapPolygon(mainArea?.geom),
        propertyBoundary: mapPolygon(property.geom),
      },
      monitoringPoints,
      timeline: [
        {
          id: 'current',
          label: 'Atual',
          daysAgo: 0,
          capturedAt: new Date().toISOString().split('T')[0],
        },
        {
          id: '30-days',
          label: '30 dias',
          daysAgo: 30,
          capturedAt: '2026-04-30',
        },
      ],
    };
  }

  async create(createComplianceDto: CreateComplianceDto) {
    return this.complianceRepository.create({
      ...createComplianceDto,
    } as Compliance);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.complianceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Compliance['id']) {
    return this.complianceRepository.findById(id);
  }

  findByIds(ids: Compliance['id'][]) {
    return this.complianceRepository.findByIds(ids);
  }

  async update(id: Compliance['id'], updateComplianceDto: UpdateComplianceDto) {
    return this.complianceRepository.update(id, {
      ...updateComplianceDto,
    } as DeepPartial<Compliance>);
  }

  remove(id: Compliance['id']) {
    return this.complianceRepository.remove(id);
  }
}
