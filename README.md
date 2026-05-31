# ARARA - Sistema de Monitoramento Ambiental (Backend) 🌳🚀

Backend robusto desenvolvido para o **Hackamarh (Hackathon SEMARH/TO)**, focado no **Eixo 2: Monitoramento de Áreas em Recuperação**. Este sistema integra inteligência de dados satelitais, evidências de campo e automação via IA para transformar o monitoramento ambiental no Tocantins.

## 🤖 Desenvolvimento Assistido por IA (Jornada Codex & Gemini)

Este projeto foi construído utilizando uma abordagem pioneira de **Engenharia Autônoma**, orquestrada pelo agente **Codex** (utilizando modelos **Gemini 1.5 Pro**).

### Como a IA foi utilizada:
- **Codex Agent**: Atuou como o arquiteto principal, realizando mudanças cirúrgicas no código, resolvendo bugs de infraestrutura (SSL, PostGIS) e integrando módulos complexos.
- **Skills Customizadas**: Foram utilizadas habilidades especializadas (`hackamarh-workflow`, `generate`) para garantir que o código seguisse os padrões NestJS e as especificações técnicas do edital.
- **Project Spec (`project-spec.md`)**: A IA consumiu uma especificação técnica detalhada para implementar, de forma autônoma, o modelo de dados georreferenciado e as integrações de satélite.
- **Resolução de Conflitos**: A IA gerenciou o merge entre as necessidades do Frontend (Next.js) e as capacidades do Backend (NestJS), criando camadas de compatibilidade dinâmica.

## 🏗️ Origem Técnica
Este projeto utiliza como fundação o [brocoders/nestjs-boilerplate](https://github.com/brocoders/nestjs-boilerplate), do qual extraímos a base sólida de autenticação, infraestrutura de banco de dados e padrões REST. Agradecemos à equipe do Brocoders pela base excelente.

## 🚀 Funcionalidades Chave (Eixo 2)

### 🛰️ Integração MapBiomas & Sentinel-2
- Consumo real de histórico LULC (Land Use and Land Cover).
- Detecção automática de alertas de desmatamento e focos de incêndio.
- Triangulação de dados: Cruzamento de métricas de satélite com evidências fotográficas de campo.

### 📶 Offline-First com PowerSync
- Sincronização bidirecional entre o App Móvel e o Servidor.
- Suporte a coleta de evidências (Fotos/GPS) em áreas sem sinal de internet.

### 🔑 Login por Convite (Passwordless)
- Fluxo simplificado para Proprietários Rurais via código de acesso de 24h enviado por e-mail.
- Segurança sem fricção, ideal para produtores rurais.

### 📊 Dashboard do Analista
- Fila de vistorias priorizada por **Score de Risco Ambiental**.
- Interface de "Vistoria Virtual" integrada com Mapas PostGIS.

## 🛠️ Stack Tecnológica
- **Linguagem**: TypeScript
- **Framework**: NestJS (com SWC para build de alta performance no Render)
- **Banco de Dados**: PostgreSQL + PostGIS (Hospedado na Aiven Cloud)
- **Infraestrutura**: Docker Compose & Render
- **Integração Satelital**: Sentinel-Hub / MapBiomas

## 📖 Documentação Detalhada
Para detalhes técnicos de cada módulo e guia de integração PowerSync, consulte:
- [Guia de Monitoramento de Recuperação](docs/restoration-monitoring.md)
- [Documentação Técnica do Backend](docs/hackamarh-backend.md)
- [Plano de Fotos de Campo](docs/collection-point-photo-backend-plan.md)

---
*Desenvolvido com orgulho para o Hackamarh 2026. Unindo tecnologia de ponta à preservação do bioma Cerrado.* 🦜✨
