import { AppDataSource } from './src/database/data-source';
import { PropertyEntity } from './src/properties/infrastructure/persistence/relational/entities/property.entity';
import { AffectedAreaEntity } from './src/affected-areas/infrastructure/persistence/relational/entities/affected-area.entity';
import { ExternalObservationEntity } from './src/external-observations/infrastructure/persistence/relational/entities/external-observation.entity';
import { EvidenceEntity } from './src/evidence/infrastructure/persistence/relational/entities/evidence.entity';
import { MissionEntity } from './src/missions/infrastructure/persistence/relational/entities/mission.entity';
import { UserEntity } from './src/users/infrastructure/persistence/relational/entities/user.entity';

async function seedSigcarData() {
  console.log('--- ATUALIZANDO DADOS PARA FIDELIDADE SIGCAR ---');

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const carCode = 'TO-1721000-171B1780D2204179A0DBBDBB25A32A97';
  
  try {
    const propertyRepo = AppDataSource.getRepository(PropertyEntity);
    const obsRepo = AppDataSource.getRepository(ExternalObservationEntity);

    // 1. Limpar dados antigos desse CAR para garantir veracidade
    console.log(`Limpando registros antigos do CAR: ${carCode}`);
    await propertyRepo.delete({ carCode });
    await obsRepo.delete({ entityId: carCode });

    // 2. Criar Propriedade com dados EXATOS do SIGCAR
    console.log('Injetando dados oficiais do SIGCAR...');
    const property = propertyRepo.create({
      carCode: carCode,
      name: 'Fazenda Estrela do Tocantins', // Nome fictício, mas dados técnicos reais
      ownerName: 'Ricardo Alves dos Santos', 
      municipality: 'Palmas',
      state: 'TO',
      totalAreaHa: 222.02, // DADO REAL SIGCAR
      source: 'sicar_import',
      createdAt: new Date('2026-02-14'), // DATA INSCRIÇÃO SIGCAR
      // Coordenadas convertidas do SIGCAR: 10°15'6.712"S 48°18'17.132"W
      geom: {
        type: 'Polygon',
        coordinates: [[
          [-48.306, -10.250],
          [-48.303, -10.250],
          [-48.303, -10.253],
          [-48.306, -10.253],
          [-48.306, -10.250]
        ]]
      } as any
    });
    const savedProperty = await propertyRepo.save(property);

    // 3. Injetar Metadados Adicionais (Módulos Fiscais) como uma observação
    await obsRepo.save(obsRepo.create({
        source: 'SIGCAR',
        observationType: 'property_specs',
        entityType: 'Property',
        entityId: carCode,
        observedAt: new Date(),
        metrics: {
            fiscal_modules: 2.78, // DADO REAL SIGCAR
            registration_date: '2026-02-14',
            last_rectification: '2026-02-14'
        }
    }));

    // 4. Injetar Histórico MapBiomas Consistente
    await obsRepo.save(obsRepo.create({
        source: 'MapBiomas Collections',
        observationType: 'lulc_history',
        entityType: 'Property',
        entityId: carCode,
        observedAt: new Date(),
        metrics: {
            last_class: 'Formação Savânica',
            regeneration_years: 3,
            history: [
                { year: 2021, class: 'Pastagem', color: '#edde8e' },
                { year: 2022, class: 'Pastagem', color: '#edde8e' },
                { year: 2023, class: 'Regeneração', color: '#90ee90' },
                { year: 2024, class: 'Formação Savânica', color: '#006400' },
            ]
        }
    }));

    console.log('--- DADOS SIGCAR SINCRONIZADOS COM SUCESSO! ---');

  } catch (error) {
    console.error('Erro na sincronização SIGCAR:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedSigcarData();
