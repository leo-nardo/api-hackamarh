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

## 3. Dashboard de Auditoria (Fluxo do Analista)
Para facilitar o trabalho do gestor florestal, implementamos um endpoint de **Triangulação de Dados** (`GET /api/v1/compliances/audit-summary/:carCode`). 

Este painel organiza as informações em três pilares:

### A. Visão de Satélite (MapBiomas + Sentinel-2)
- **Classe Atual**: Confirma se a área é classificada como "Vegetação Secundária".
- **Tempo de Regeneração**: Quantos anos o satélite detecta crescimento ativo.
- **Histórico de Fogo**: Frequência de queimadas nos últimos 10 anos.

### B. Visão de Campo (App Flutter)
- **Evidências Fotográficas**: Fotos reais georreferenciadas do local.
- **Taxa de Mortalidade**: Média reportada pelo técnico em campo.
- **Notas Técnicas**: Observações qualitativas do técnico (ex: presença de pragas).

### C. Inteligência de Recomendação (Conformidade)
O sistema cruza os dados e sugere um status:
- 🟢 **CONFORME (GREEN)**: Quando o satélite confirma a regeneração (>= 2 anos) E o campo confirma baixa mortalidade (< 20%).
- 🟡 **EM REVISÃO (YELLOW)**: Quando os dados são inconclusivos ou há poucas evidências de campo.
- 🔴 **NÃO CONFORME (RED)**: Quando há alertas de desmatamento recentes ou alta mortalidade/fogo recorrente.

## 4. Benefícios para a SEMARH/TO
- **Agilidade**: O analista não precisa abrir 5 sistemas diferentes (MapBiomas, Planet, SICAR, etc.). Tudo está consolidado.
- **Segurança Jurídica**: O relatório de auditoria serve como prova técnica de que o PRAD está sendo cumprido, unindo o dado automatizado com o dado humano.
- **Colaboração**: Os dados de campo retroalimentam a inteligência do sistema, aumentando a precisão das futuras análises.
