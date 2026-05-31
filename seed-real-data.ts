import { AppDataSource } from './src/database/data-source';
import { PropertyEntity } from './src/properties/infrastructure/persistence/relational/entities/property.entity';
import { AffectedAreaEntity } from './src/affected-areas/infrastructure/persistence/relational/entities/affected-area.entity';
import { ExternalObservationEntity } from './src/external-observations/infrastructure/persistence/relational/entities/external-observation.entity';
import { EvidenceEntity } from './src/evidence/infrastructure/persistence/relational/entities/evidence.entity';
import { MissionEntity } from './src/missions/infrastructure/persistence/relational/entities/mission.entity';
import { UserEntity } from './src/users/infrastructure/persistence/relational/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

async function seedRealData() {
  console.log('--- INICIANDO SEED DE DADOS REAIS + EVIDÊNCIAS ---');

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const carCode = 'TO-1721000-171B1780D2204179A0DBBDBB25A32A97';
  
  try {
    const propertyRepo = AppDataSource.getRepository(PropertyEntity);
    const areaRepo = AppDataSource.getRepository(AffectedAreaEntity);
    const obsRepo = AppDataSource.getRepository(ExternalObservationEntity);
    const evidenceRepo = AppDataSource.getRepository(EvidenceEntity);
    const missionRepo = AppDataSource.getRepository(MissionEntity);
    const userRepo = AppDataSource.getRepository(UserEntity);

    // Pegar o admin como técnico para o demo
    const technician = await userRepo.findOne({ where: { email: 'admin@example.com' } });
    if (!technician) {
        console.error('Técnico admin@example.com não encontrado. Rode o seed principal primeiro.');
        return;
    }

    console.log(`Verificando CAR: ${carCode}`);
    let property = await propertyRepo.findOne({ where: { carCode } });

    if (!property) {
      property = propertyRepo.create({
        carCode,
        name: 'Fazenda Arara Real - TO',
        ownerName: 'Proprietário Demo Real',
        municipality: 'Palmas',
        state: 'TO',
        totalAreaHa: 154.2,
        source: 'sicar_import',
        geom: {
          type: 'Polygon',
          coordinates: [[
            [-48.33, -10.18],
            [-48.31, -10.18],
            [-48.31, -10.20],
            [-48.33, -10.20],
            [-48.33, -10.18]
          ]]
        } as any
      });
      property = await propertyRepo.save(property);
    }

    console.log('Criando Área de Recuperação...');
    let area = await areaRepo.findOne({ where: { property: { id: property.id } } });
    if (!area) {
        area = areaRepo.create({
            name: 'Área de Preservação Permanente - Nascente',
            areaType: 'APP',
            status: 'monitoring',
            areaHa: 12.5,
            property: property,
            geom: {
                type: 'Polygon',
                coordinates: [[
                  [-48.325, -10.185],
                  [-48.315, -10.185],
                  [-48.315, -10.195],
                  [-48.325, -10.195],
                  [-48.325, -10.185]
                ]]
              } as any
        });
        area = await areaRepo.save(area);
    }

    console.log('Criando Missão para Evidências...');
    let mission = await missionRepo.findOne({ where: { affectedArea: { id: area.id } } });
    if (!mission) {
        mission = missionRepo.create({
            name: 'Vistoria Inicial de Monitoramento',
            objective: 'Coleta de evidências fotográficas para linha de base.',
            status: 'completed',
            affectedArea: area,
            assignedTo: technician
        });
        mission = await missionRepo.save(mission);
    }

    console.log('Criando Evidências de Campo Reais (Fotos)...');
    const existingEvidence = await evidenceRepo.find({ where: { property: { id: property.id } } });
    if (existingEvidence.length === 0) {
        const evidence1 = evidenceRepo.create({
            property: property,
            mission: mission,
            fotoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000',
            notes: 'Regeneração natural iniciada. Baixa taxa de mortalidade observada.',
            mortalityRate: 5,
            location: { type: 'Point', coordinates: [-48.32, -10.19] } as any,
            capturedAt: new Date(),
            status: 'active'
        });
        const evidence2 = evidenceRepo.create({
            property: property,
            mission: mission,
            fotoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
            notes: 'Cerca de proteção instalada corretamente.',
            mortalityRate: 10,
            location: { type: 'Point', coordinates: [-48.318, -10.188] } as any,
            capturedAt: new Date(),
            status: 'active'
        });
        await evidenceRepo.save([evidence1, evidence2]);
    }

    console.log('--- SEED CONCLUÍDO COM SUCESSO! ---');

  } catch (error) {
    console.error('Erro no Seed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedRealData();
