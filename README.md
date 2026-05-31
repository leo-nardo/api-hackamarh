# ARARA - Acompanhamento Remoto de Áreas de Recuperação Ambiental 🌳🚀

Backend robusto desenvolvido para o **Hackamarh (Hackathon SEMARH/TO)**, focado no **Eixo 2: Monitoramento de Áreas em Recuperação**. Este sistema integra inteligência de dados satelitais, evidências de campo e automação via IA para transformar o monitoramento ambiental no Tocantins.

## 🤖 Engenharia 100% Autônoma (Direcionamento Humano + IA)

Este projeto marca uma jornada de inovação onde o **ser humano atuou exclusivamente como Arquiteto e Engenheiro de Prompt**, enquanto a **IA executou 100% da implementação técnica**.

### Como o projeto foi construído:
- **Arquiteto (Humano)**: Responsável pelo direcionamento estratégico, regras de negócio e visão técnica. **Nenhuma linha de código foi escrita manualmente pelo arquiteto.**
- **Codex Agent (IA)**: Utilizando modelos **Gemini 3.1 Pro** e **chatgpt 5.3**, os agentes interpretaram as instruções e o arquivo `project-spec.md` para implementar, de forma autônoma, toda a lógica de negócio, integrações geoespaciais e correções de infraestrutura.
- **Skills de Domínio**: Foram utilizadas habilidades especializadas para garantir que a IA seguisse os padrões NestJS e as especificações técnicas da SEMARH.
- **Fundação Técnica**: O código foi construído sobre o [brocoders/nestjs-boilerplate](https://github.com/brocoders/nestjs-boilerplate), reaproveitando as bases sólidas de autenticação e infraestrutura preexistentes, enquanto todo o novo domínio ambiental foi gerado pela IA sob demanda.

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
- **Framework**: NestJS (com SWC para performance no Render)
- **Banco de Dados**: PostgreSQL + PostGIS (Hospedado na Aiven Cloud)
- **Infraestrutura**: Docker Compose & Render
- **Integração Satelital**: Sentinel-Hub / MapBiomas

## 📖 Documentação Detalhada
- [Guia de Monitoramento de Recuperação](docs/restoration-monitoring.md)
- [Jornada de Desenvolvimento Backend](docs/hackamarh-backend.md)
- [Plano de Fotos de Campo](docs/collection-point-photo-backend-plan.md)

---
*Desenvolvido com orgulho para o Hackamarh 2026. Unindo tecnologia de ponta à preservação do bioma Cerrado.* 🦜✨
