import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ExternalObservationRepository } from './infrastructure/persistence/external-observation.repository';
import { firstValueFrom } from 'rxjs';
import { CreateExternalObservationDto } from './dto/create-external-observation.dto';

@Injectable()
export class MapBiomasService {
  private readonly logger = new Logger(MapBiomasService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly repository: ExternalObservationRepository,
  ) {}

  /**
   * Busca alertas reais no MapBiomas Alerta para um código de CAR específico.
   */
  async fetchAlertsByCar(carCode: string) {
    const url = `https://alerta.mapbiomas.org/api/v1/alerts?car_code=${carCode}`;

    try {
      this.logger.log(`Buscando alertas MapBiomas para o CAR: ${carCode}`);
      const { data } = await firstValueFrom(this.httpService.get(url));
      
      const savedObservations: any[] = [];

      if (Array.isArray(data)) {
        for (const alert of data) {
          const observationDto: CreateExternalObservationDto = {
            source: 'MapBiomas Alerta',
            observationType: 'deforestation_alert',
            entityType: 'Property',
            entityId: carCode,
            observedAt: new Date(alert.published_at || alert.created_at),
            metrics: {
              area_ha: alert.area_ha,
              alert_id: alert.id,
              status: alert.status,
              report_url: alert.report_url,
              imageUrl: alert.image_after_url || alert.thumbnail_url,
            },
            rawPayload: alert,
          };

          const saved = await this.repository.create(observationDto);
          savedObservations.push(saved);
        }
      }

      return savedObservations;
    } catch (error) {
      this.logger.error(`Erro ao buscar alertas MapBiomas: ${error.message}`);
      return [];
    }
  }

  /**
   * Busca ou simula o Histórico de Uso e Cobertura do Solo (LULC) para o CAR.
   * Essencial para o Eixo 2: Provar a transição de área degradada para restaurada.
   */
  async fetchLulcHistory(carCode: string) {
    this.logger.log(`Buscando histórico LULC para o CAR: ${carCode}`);
    
    // Em um cenário de produção, aqui faríamos uma integração com o Google Earth Engine
    // ou com a API de Coleções do MapBiomas. 
    // Para o MVP Hackamarh, retornamos um histórico estruturado que permite a auditoria.
    
    const history = [
      { year: 2020, class: 'Pasture', color: '#F5DEB3' },
      { year: 2021, class: 'Pasture', color: '#F5DEB3' },
      { year: 2022, class: 'Degraded Area', color: '#D2B48C' }, // Início do PRAD
      { year: 2023, class: 'Secondary Vegetation', color: '#90EE90' },
      { year: 2024, class: 'Secondary Vegetation', color: '#32CD32' },
      { year: 2025, class: 'Secondary Vegetation', color: '#228B22' },
    ];

    const observationDto: CreateExternalObservationDto = {
      source: 'MapBiomas Collections',
      observationType: 'lulc_history',
      entityType: 'Property',
      entityId: carCode,
      observedAt: new Date(),
      metrics: {
        last_class: 'Secondary Vegetation',
        regeneration_years: 3,
        history: history,
      },
      rawPayload: { simulated: true, carCode },
    };

    return this.repository.create(observationDto);
  }

  /**
   * Busca métricas de degradação (Fogo e Fragmentação).
   * Ajuda o engenheiro a entender falhas na recuperação.
   */
  async fetchDegradationMetrics(carCode: string) {
    this.logger.log(`Buscando métricas de degradação para o CAR: ${carCode}`);

    const observationDto: CreateExternalObservationDto = {
      source: 'MapBiomas Degradation',
      observationType: 'degradation_stats',
      entityType: 'Property',
      entityId: carCode,
      observedAt: new Date(),
      metrics: {
        fire_frequency_10y: 2,
        last_fire_year: 2022,
        edge_effect_exposure: 'Low',
        connectivity_score: 0.75,
        canopy_disturbance: 'Decreasing',
      },
      rawPayload: { simulated: true, carCode },
    };

    return this.repository.create(observationDto);
  }

  /**
   * Gera uma URL de imagem de satélite real (Sentinel-2) para uma coordenada específica.
   * Útil para o analista ver o "antes" e "depois" de um ponto de coleta.
   */
  async getSatelliteImageryForPoint(lat: number, lon: number, date?: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Usando o Sentinel Hub Playground ou similar (URL de visualização pública)
    // Para um hackathon, esta é a forma mais rápida de renderizar um tile de satélite real.
    // BBOX (Bounding Box) de ~500m ao redor do ponto
    const delta = 0.005;
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    
    // Esta é uma URL de preview que muitos sistemas de monitoramento usam
    const imageryUrl = `https://services.sentinel-hub.com/ogc/wms/v1/a9ad278c-579c-4824-814d-17e764a85966?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/jpeg&TRANSPARENT=true&LAYERS=TRUE-COLOR&TIME=${targetDate}/${targetDate}&STYLES=&SRS=EPSG:4326&BBOX=${bbox}&WIDTH=512&HEIGHT=512`;

    return {
      lat,
      lon,
      date: targetDate,
      imageryUrl,
      provider: 'Sentinel-2 via Sentinel Hub',
    };
  }
}
