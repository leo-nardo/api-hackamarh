import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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
    const degradation = propertySatData.find(
      (obs) => obs.observationType === 'degradation_stats',
    );
    const alerts = propertySatData.filter(
      (obs) => obs.observationType === 'deforestation_alert',
    );

    const allEvidence = await this.evidenceRepository.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100 },
    });

    const fieldEvidence = allEvidence.filter(
      (ev) => ev.property?.carCode === carCode,
    );

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
    const properties = await this.propertyRepository.findAllWithPagination({
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
    // Filtro mais robusto (se property não estiver joinada, tentamos comparar IDs se disponíveis ou apenas pegar a primeira se for demo)
    const propertyAreas = allAreas.filter(
      (a) => a.property?.id === property.id || (a as any).propertyId === property.id
    );
    const mainArea = propertyAreas[0];

    // 3. Buscar Evidências
    const allEvidence = await this.evidenceRepository.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100 },
    });
    const fieldEvidence = allEvidence.filter(
      (ev) => ev.property?.id === property.id || (ev as any).propertyId === property.id
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
      if (!geom || !geom.coordinates || !geom.coordinates[0]) return [];
      try {
          return geom.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
      } catch (e) {
          console.error('Erro ao mapear polígono:', e);
          return [];
      }
    };

    const monitoringPoints = fieldEvidence.map((ev, index) => {
      const lat = ev.location?.coordinates?.[1] || -10.2;
      const lon = ev.location?.coordinates?.[0] || -48.3;

      const satImage = this.mapBiomasService.getSatelliteImageryForPoint(
        lat,
        lon,
      );

      return {
        id: ev.id,
        code: `P${index + 1}`,
        latitude: lat,
        longitude: lon,
        owner: property.ownerName || 'Proprietário não informado',
        observations: ev.notes || 'Sem observações adicionais.',
        status:
          ev.mortalityRate && ev.mortalityRate > 30
            ? 'critical'
            : ev.mortalityRate && ev.mortalityRate > 15
              ? 'attention'
              : 'adequate',
        createdAt: ev.capturedAt instanceof Date ? ev.capturedAt.toISOString() : (ev.createdAt?.toISOString() || new Date().toISOString()),
        hasPanorama: false,
        satellite: {
          currentDate: satImage.date,
          previousDate: '2025-01-01',
          currentImageUrl: satImage.imageryUrl,
          previousImageUrl: satImage.imageryUrl,
          ndviTrend: lulcHistory?.metrics && typeof lulcHistory.metrics === 'object' ? (lulcHistory.metrics['ndvi_trend'] as number) || 5 : 5,
        },
        photos: {
          north: {
            id: `${ev.id}-n`,
            direction: 'north',
            title: 'Foto de Campo',
            imageUrl: ev.fotoUrl,
            capturedAt: ev.capturedAt instanceof Date ? ev.capturedAt.toISOString() : new Date().toISOString(),
          },
          south: {
            id: `${ev.id}-s`,
            direction: 'south',
            title: 'Foto de Campo',
            imageUrl: ev.fotoUrl,
            capturedAt: ev.capturedAt instanceof Date ? ev.capturedAt.toISOString() : new Date().toISOString(),
          },
          east: {
            id: `${ev.id}-e`,
            direction: 'east',
            title: 'Foto de Campo',
            imageUrl: ev.fotoUrl,
            capturedAt: ev.capturedAt instanceof Date ? ev.capturedAt.toISOString() : new Date().toISOString(),
          },
          west: {
            id: `${ev.id}-w`,
            direction: 'west',
            title: 'Foto de Campo',
            imageUrl: ev.fotoUrl,
            capturedAt: ev.capturedAt instanceof Date ? ev.capturedAt.toISOString() : new Date().toISOString(),
          },
        },
      };
    });

    // Cálculo seguro do centroide
    let centroid: [number, number] = [-10.2, -48.3];
    if (mainArea?.geom?.coordinates?.[0]?.[0]) {
        const coords = mainArea.geom.coordinates[0][0];
        if (Array.isArray(coords) && coords.length >= 2) {
            centroid = [coords[1], coords[0]];
        }
    } else if (property.geom?.coordinates?.[0]?.[0]) {
        const coords = property.geom.coordinates[0][0];
        if (Array.isArray(coords) && coords.length >= 2) {
            centroid = [coords[1], coords[0]];
        }
    }

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
        centroid,
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

  /**
   * Fila de Vistorias Priorizada para o Analista.
   * Retorna propriedades com indicadores de risco (fogo, desmatamento) para orientar o trabalho.
   */
  async getComplianceQueue() {
    const properties = await this.propertyRepository.findAllWithPagination({
      paginationOptions: { page: 1, limit: 100 },
    });

    const satObservations =
      await this.externalObservationRepository.findAllWithPagination({
        paginationOptions: { page: 1, limit: 1000 },
      });

    const queue = properties.map((property) => {
      const propertyObs = satObservations.filter(
        (obs) => obs.entityId === property.carCode,
      );

      const hasAlerts = propertyObs.some(
        (obs) => obs.observationType === 'deforestation_alert',
      );
      const degradation = propertyObs.find(
        (obs) => obs.observationType === 'degradation_stats',
      );
      
      let fireRisk = 0;
      if (degradation?.metrics && typeof degradation.metrics === 'object') {
          fireRisk = (degradation.metrics['fire_frequency_10y'] as number) || 0;
      }

      // Cálculo de Prioridade Simples
      let priority = 'Low';
      let priorityScore = 0;

      if (hasAlerts) {
        priority = 'Critical';
        priorityScore = 100;
      } else if (fireRisk > 1) {
        priority = 'Medium';
        priorityScore = 50;
      }

      return {
        id: property.id,
        carCode: property.carCode,
        name: property.name,
        municipality: property.municipality || 'Tocantins',
        owner: property.ownerName || 'Não informado',
        status: property.status?.name || 'Pending',
        priority,
        priorityScore,
        lastUpdate: property.updatedAt || new Date(),
        indicators: {
          hasAlerts,
          fireRisk,
        },
      };
    });

    // Ordenar por prioridade (Critical primeiro)
    return queue.sort((a, b) => b.priorityScore - a.priorityScore);
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
