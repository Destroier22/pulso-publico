# Fontes

## Siconfi — Secretaria do Tesouro Nacional

- **Conjunto:** Declaração das Contas Anuais (DCA)
- **Anexo:** DCA-Anexo I-E — Despesas por função
- **Provedor:** Secretaria do Tesouro Nacional
- **Cobertura usada:** 15 capitais municipais, exercício de 2024
- **Formato:** JSON
- **Documentação:** https://apidatalake.tesouro.gov.br/docs/siconfi/
- **Endpoint-base:** `https://apidatalake.tesouro.gov.br/ords/cdwhprd/siconfi/tt/dca`
- **Autenticação:** não exigida
- **Limite informado:** 1 requisição por segundo
- **Campos consumidos:** `cod_ibge`, `uf`, `conta`, `coluna`, `valor`, `populacao`
- **Última extração do snapshot:** registrada em `data/snapshot.json → meta.generatedAt`

Parâmetros da consulta:

| Parâmetro | Valor |
|---|---|
| `an_exercicio` | 2024 |
| `no_anexo` | `DCA-Anexo I-E` |
| `co_esfera` | `M` |
| `id_ente` | código IBGE de cada capital |

## Rastreabilidade

Cada registro processado preserva o código IBGE, a UF e o ano de referência. O histórico Git permite comparar snapshots e identificar retificações ou mudanças da fonte.

## Atribuição e reutilização

A API Siconfi é um serviço oficial de dados abertos. O Tesouro Transparente descreve a oferta como gratuita e sem necessidade de identificação, sujeita às orientações de uso da API. A atribuição “Fonte: Siconfi/STN — DCA, Anexo I-E” acompanha o painel e o snapshot.
