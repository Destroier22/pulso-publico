# Dicionário de dados

## `data/snapshot.json`

### Metadados

| Campo | Tipo | Descrição |
|---|---|---|
| `meta.referenceYear` | inteiro | exercício fiscal |
| `meta.generatedAt` | ISO 8601 | instante UTC da extração |
| `meta.source` | texto | atribuição curta |
| `meta.sourceUrl` | URL | documentação oficial |
| `meta.scope` | texto | cobertura editorial |

### Municípios

| Campo | Tipo | Descrição |
|---|---|---|
| `city` | texto | nome da capital |
| `uf` | texto | sigla da unidade federativa |
| `ibgeCode` | inteiro | código oficial do ente |
| `region` | enum | macrorregião brasileira |
| `population` | inteiro | população informada na resposta Siconfi |
| `totalExpense` | número | despesa empenhada, exceto intraorçamentária |
| `expensePerCapita` | número | `totalExpense / population` |
| `healthExpense` | número | despesa empenhada na função 10 |
| `healthShare` | número | saúde como % de `totalExpense` |
| `educationExpense` | número | despesa empenhada na função 12 |
| `educationShare` | número | educação como % de `totalExpense` |
| `mapX`, `mapY` | inteiro | coordenadas editoriais do mapa esquemático |
