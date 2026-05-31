# Monitoramento de Restauração (Eixo 2 - Hackamarh)

Este documento descreve como o sistema atende aos requisitos de monitoramento de áreas degradadas e restauração ecológica, utilizando dados do MapBiomas e Sentinel-2.

## 1. Visão Geral
O sistema não busca substituir ferramentas consolidadas, mas sim servir como uma camada de **Auditoria e Verdade de Campo** para engenheiros ambientais e florestais.

## 2. Indicadores do Eixo 2
O backend agora processa três níveis de informação para cada propriedade (CAR):

### A. Alertas de Desmatamento (MapBiomas Alerta)
- Identifica supressões de vegetação recentes.
- Cruza o alerta com as missões de campo para verificar se a supressão foi autorizada ou se é uma quebra do PRAD.

### B. Histórico de Regeneração (LULC History)
- Mapeia a transição de classes de cobertura (Ex: Pastagem -> Vegetação Secundária).
- Calcula o tempo de regeneração ativa, fundamental para validar o sucesso do plantio/condução.

### C. Fatores de Degradação
- **Frequência de Fogo**: Analisa se a área é alvo constante de queimadas, o que compromete a restauração.
- **Conectividade**: Mede se a área em restauração está se conectando a fragmentos florestais vizinhos.

## 3. Fluxo de Trabalho do Engenheiro
1. O engenheiro cadastra o **CAR** e a **Meta do PRAD** (Ex: 40% de cobertura em 5 anos).
2. O sistema sincroniza os dados do MapBiomas.
3. O sistema compara o dado do satélite com as fotos e métricas coletadas pelo técnico no campo via App Flutter.
4. **Relatório de Conformidade**: O sistema gera um parecer automático indicando se a área está evoluindo conforme o planejado ou se precisa de intervenção.

## 4. Colaboração com o Ecossistema
Os dados de "Verdade de Campo" (fotos georreferenciadas e densidade de regenerantes) coletados pelo nosso sistema podem ser futuramente fornecidos ao MapBiomas para ajudar no treinamento de seus algoritmos de classificação, criando um ciclo positivo de dados de alta qualidade.
