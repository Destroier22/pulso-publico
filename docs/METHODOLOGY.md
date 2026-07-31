# Metodologia

## Pergunta de pesquisa

Como as capitais do recorte diferem no volume de despesa empenhada por habitante e na participação das funções saúde e educação?

## Unidade de análise

Capital municipal. Brasília foi excluída porque o Distrito Federal não é município e sua estrutura fiscal não é diretamente comparável à esfera municipal consultada (`co_esfera=M`).

## Recorte

Foram escolhidas 15 capitais para manter o painel ágil e, ao mesmo tempo, representar as cinco regiões. O recorte é editorial, não amostral.

## Transformações

1. Consulta do Anexo I-E da DCA por código IBGE.
2. Seleção da coluna `Despesas Empenhadas`.
3. Extração das contas:
   - `Despesas Exceto Intraorçamentárias`;
   - `10 - Saúde`;
   - `12 - Educação`.
4. Conversão de valores para número decimal.
5. Cálculo da despesa total por população.
6. Cálculo das participações funcionais sobre a despesa total.
7. Arredondamento monetário em centavos e percentual em uma casa decimal.

## Regras de qualidade

- exatamente 15 registros;
- código IBGE presente e único;
- população e despesas maiores que zero;
- participações entre 0% e 100%;
- falha explícita se uma conta esperada não for localizada.

## Interpretação

Os indicadores medem composição e escala orçamentária. Eles não medem eficiência, qualidade do serviço, necessidade social, custo regional ou resultado da política pública. Comparações substantivas devem acrescentar inflação, perfil demográfico, rede existente e indicadores de resultado.

## Atualização

O workflow semanal recria o snapshot. Como a DCA é anual e pode ser retificada, uma frequência semanal serve principalmente para capturar revisões sem sobrecarregar a fonte.
