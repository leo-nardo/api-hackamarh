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

@Injectable()
export class CompliancesService {
  constructor(
    private readonly complianceRepository: ComplianceRepository,
    private readonly externalObservationRepository: ExternalObservationRepository,
    private readonly evidenceRepository: EvidenceRepository,
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
