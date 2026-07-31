#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const YEAR = 2024;
const BASE = "https://apidatalake.tesouro.gov.br/ords/cdwhprd/siconfi/tt/dca";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../data/snapshot.json");
const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));

const capitals = [
  ["Manaus", "AM", 1302603, "Norte", 5, 2],
  ["Belém", "PA", 1501402, "Norte", 6, 3],
  ["Palmas", "TO", 1721000, "Norte", 6, 5],
  ["São Luís", "MA", 2111300, "Nordeste", 7, 4],
  ["Fortaleza", "CE", 2304400, "Nordeste", 8, 5],
  ["Recife", "PE", 2611606, "Nordeste", 9, 6],
  ["Salvador", "BA", 2927408, "Nordeste", 8, 7],
  ["Campo Grande", "MS", 5002704, "Centro-Oeste", 5, 9],
  ["Goiânia", "GO", 5208707, "Centro-Oeste", 7, 8],
  ["Belo Horizonte", "MG", 3106200, "Sudeste", 9, 9],
  ["Rio de Janeiro", "RJ", 3304557, "Sudeste", 10, 10],
  ["São Paulo", "SP", 3550308, "Sudeste", 9, 11],
  ["Curitiba", "PR", 4106902, "Sul", 8, 11],
  ["Florianópolis", "SC", 4205407, "Sul", 9, 12],
  ["Porto Alegre", "RS", 4314902, "Sul", 8, 13]
];

async function fetchRows(code) {
  const params = new URLSearchParams({
    an_exercicio: String(YEAR),
    no_anexo: "DCA-Anexo I-E",
    co_esfera: "M",
    id_ente: String(code)
  });
  const response = await fetch(`${BASE}?${params}`, {
    headers: { "User-Agent": "pulso-publico/1.0 (dados-abertos; portfolio)" }
  });
  if (!response.ok) throw new Error(`Siconfi respondeu ${response.status} para ${code}`);
  return (await response.json()).items ?? [];
}

function value(rows, account) {
  const row = rows.find((item) =>
    (item.conta === account || item.conta?.startsWith(account)) &&
    item.coluna === "Despesas Empenhadas" &&
    item.valor !== null
  );
  const number = Number(row?.valor);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`Indicador inválido: ${account}`);
  }
  return number;
}

const cities = [];
for (const [city, uf, ibgeCode, region, mapX, mapY] of capitals) {
  const rows = await fetchRows(ibgeCode);
  const totalExpense = value(rows, "Despesas Exceto Intra");
  const healthExpense = value(rows, "10 -");
  const educationExpense = value(rows, "12 -");
  const population = Number(rows[0]?.populacao);
  cities.push({
    city, uf, ibgeCode, region, population,
    totalExpense: Number(totalExpense.toFixed(2)),
    expensePerCapita: Number((totalExpense / population).toFixed(2)),
    healthExpense: Number(healthExpense.toFixed(2)),
    healthShare: Number((100 * healthExpense / totalExpense).toFixed(1)),
    educationExpense: Number(educationExpense.toFixed(2)),
    educationShare: Number((100 * educationExpense / totalExpense).toFixed(1)),
    mapX, mapY
  });
  await wait(1050);
}

if (cities.length !== capitals.length || new Set(cities.map((row) => row.ibgeCode)).size !== cities.length) {
  throw new Error("Falha de completude ou unicidade");
}

const payload = {
  meta: {
    title: "Pulso Público — Atlas do Dinheiro Municipal",
    referenceYear: YEAR,
    generatedAt: new Date().toISOString(),
    source: "Siconfi/STN — DCA, Anexo I-E",
    sourceUrl: "https://apidatalake.tesouro.gov.br/docs/siconfi/",
    scope: "15 capitais brasileiras",
    license: "Dados públicos; código MIT"
  },
  cities
};

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`${cities.length} capitais gravadas em ${OUT}`);
