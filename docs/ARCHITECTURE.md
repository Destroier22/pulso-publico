# Arquitetura

O projeto separa aquisição, produto de dados e apresentação.

1. `pipeline/refresh-data.mjs` contém a lista explícita de entes, consulta a API, seleciona contas e aplica validações.
2. `data/snapshot.json` é o contrato versionado entre pipeline e interface. O site nunca depende da disponibilidade da API em tempo de navegação.
3. `app/page.tsx` trata filtros e comparação no cliente sem alterar os dados de origem.
4. `.github/workflows/data-refresh.yml` agenda a execução e registra apenas snapshots aprovados.

Essa separação favorece auditabilidade, experiência estável para o visitante e revisão de mudanças por diff.

## Decisões

- **Snapshot versionado:** torna retificações visíveis e evita que uma falha momentânea da fonte derrube o painel.
- **Sem dependências no pipeline:** reduz superfície de manutenção e facilita execução em Actions.
- **Mapa esquemático:** atende à comparação editorial sem carregar uma biblioteca cartográfica pesada; é identificado como não cartográfico.
- **Cálculos no pipeline:** impede divergência entre diferentes componentes visuais.
