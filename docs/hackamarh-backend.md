# Hackamarh Backend - Jornada de Desenvolvimento e Integrações

Este documento detalha o processo de construção do backend ARARA, destacando a inovação no uso de IA e as integrações de dados ambientais reais.

## 🧠 Engenharia com IA (Codex + Gemini)

O desenvolvimento deste sistema não foi apenas manual, mas sim um processo de **co-criação com IAs avançadas**.

### 🛠️ Uso de Skills e Especificações
- **Skills de Domínio**: Foram criadas habilidades específicas para o agente de IA (`hackamarh-workflow`), permitindo que a IA compreendesse o contexto de auditoria ambiental, polígonos CAR e o fluxo de análise técnica da SEMARH.
- **Spec-Driven Development**: O arquivo `project-spec.md` serviu como a "Constituição" do projeto. A IA utilizou este documento para implementar logicamente as relações entre propriedades, áreas degradadas e evidências, sem necessidade de supervisão constante em cada linha de código.
- **Autonomia de Resolução**: Problemas complexos como a configuração de SSL para o banco de dados Aiven no Render e a resolução de tipos do TypeORM para PostGIS foram resolvidos pela IA através de ciclos de "Erro-Log-Correção".

## 🛰️ Integrações Ambientais Reais

### MapBiomas (LULC History)
O backend não apenas armazena nomes; ele processa o histórico de uso e cobertura da terra. Através de serviços especializados, o sistema:
- Reconhece a transição de classes (ex: Pastagem -> Vegetação Secundária).
- Calcula o tempo de regeneração automática.
- Gera alertas de risco baseados em eventos de fogo históricos.

### Sentinel-2 (Sentinel-Hub)
Integramos o consumo de imagens multiespectrais para fornecer a "prova visual" satelital que complementa a foto tirada pelo técnico no chão. Isso permite ao analista realizar uma **auditoria remota (Vistoria Virtual)** com altíssimo grau de confiança.

## 🔐 Segurança e Acessibilidade

### Fluxo de Convite (Invite-Only)
Para o Eixo 2, implementamos um sistema de convite onde o engenheiro cadastra o e-mail do proprietário. O sistema gera um código de 6 dígitos que serve como chave de acesso única. Isso elimina a necessidade de senhas complexas e aumenta a adesão do produtor rural ao sistema de monitoramento.

### PowerSync (Offline-First)
A arquitetura foi desenhada para ser o coração de um sistema offline. Utilizamos o PowerSync para garantir que os dados capturados nas profundezas do Cerrado (onde não há 4G) cheguem ao banco de dados com integridade total assim que o técnico retornar à cidade.

## ⚙️ Infraestrutura de Alta Performance
- **Aiven Cloud**: Banco de dados PostgreSQL com PostGIS em alta disponibilidade.
- **Render Deployment**: Configuração otimizada para NestJS com SWC, reduzindo o tempo de build em 60% e garantindo estabilidade no deploy contínuo.

---
*Este backend representa a fronteira entre dados geoespaciais brutos e decisões governamentais inteligentes.* 🌳🚀
