# Pulso Público — Atlas do Dinheiro Municipal

> Do cofre à rua: um painel aberto para comparar como 15 capitais brasileiras distribuem suas despesas.

![Capa do Pulso Público](public/og.png)

[![Dados: Siconfi](https://img.shields.io/badge/dados-Siconfi%2FSTN-1e4d3c)](https://apidatalake.tesouro.gov.br/docs/siconfi/)
[![Atualização semanal](https://img.shields.io/badge/pipeline-semanal-d9f34a)](.github/workflows/data-refresh.yml)
[![Licença MIT](https://img.shields.io/badge/código-MIT-ed6b3b)](LICENSE)

## Por que este projeto existe

Orçamento público costuma aparecer como uma pilha de rubricas. O Pulso Público muda o ponto de entrada: parte de perguntas que qualquer pessoa pode fazer — quanto a cidade empenha por habitante e que fatia vai para saúde ou educação? — e preserva o caminho até a fonte oficial.

O resultado não é um ranking de “melhores cidades”. É uma ferramenta de comparação responsável: torna diferenças visíveis e deixa explícito o que os números não explicam sozinhos.

## O que você encontra

- painel responsivo com filtros por região e por indicador;
- mapa esquemático interativo das capitais;
- cartões de detalhe e ranking comparativo;
- snapshot real da DCA/Siconfi, exercício de 2024;
- pipeline de extração, limpeza e validação sem dependências;
- atualização semanal por GitHub Actions;
- testes de qualidade e documentação das limitações;
- identidade editorial e imagem Open Graph próprias.

## Indicadores

| Indicador | Cálculo | Unidade |
|---|---|---|
| Despesa por pessoa | despesa empenhada ÷ população informada no Siconfi | R$/habitante |
| Prioridade em saúde | despesa empenhada na função 10 ÷ despesa total | % |
| Prioridade em educação | despesa empenhada na função 12 ÷ despesa total | % |

O denominador de despesas exclui operações intraorçamentárias. Leia o [dicionário de dados](docs/DATA_DICTIONARY.md) e a [metodologia](docs/METHODOLOGY.md) antes de reutilizar os indicadores.

## Arquitetura

```text
API Siconfi / STN
        │
        ▼
pipeline/refresh-data.mjs
  importar → selecionar → tipar → validar
        │
        ▼
data/snapshot.json
        │
        ▼
painel Next.js / React
```

Veja a [decisão de arquitetura e o fluxo completo](docs/ARCHITECTURE.md).

## Executar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Para atualizar o recorte oficial:

```bash
npm run data:refresh
```

A API do Tesouro recomenda no máximo uma requisição por segundo; o pipeline aplica uma pausa de 1,05 s entre municípios.

## Qualidade e manutenção

```bash
npm test
npm run build
```

A automação roda às segundas-feiras e também pode ser disparada manualmente. Ela só publica um novo snapshot se todas as 15 capitais forem obtidas, os códigos IBGE forem únicos e os percentuais estiverem em intervalos válidos.

## Limites importantes

- Despesa empenhada é um compromisso orçamentário, não o pagamento realizado.
- Valores de 2024 são nominais e não foram corrigidos pela inflação.
- Gastar mais não implica, por si só, melhor serviço público.
- O recorte de 15 capitais não representa os 5.570 municípios.
- A posição no mapa é esquemática e não serve a análises cartográficas.
- Os dados são declaratórios e podem ser retificados pelo ente.

## Fontes e licenças

Os indicadores derivam da **Declaração das Contas Anuais, Anexo I-E**, disponibilizada pela Secretaria do Tesouro Nacional na [API Siconfi](https://apidatalake.tesouro.gov.br/docs/siconfi/). Consulte [SOURCES.md](docs/SOURCES.md) para endpoints, periodicidade, cobertura e termos.

O código deste repositório usa licença [MIT](LICENSE). Dados públicos preservam os termos e a atribuição de seus provedores.

## Contribuir

Correções metodológicas, melhorias de acessibilidade e novos testes são bem-vindos. Consulte [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir uma contribuição.

---

**Pulso Público** é uma peça de engenharia e comunicação de dados: rastreável por dentro, legível por fora.
