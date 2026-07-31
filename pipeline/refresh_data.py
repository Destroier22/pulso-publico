#!/usr/bin/env python3
"""Extrai e normaliza dados fiscais oficiais de capitais brasileiras.

Fonte: API Siconfi / Secretaria do Tesouro Nacional.
Sem dependências externas; adequado para execução local e GitHub Actions.
"""
from __future__ import annotations

import json
import math
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

YEAR = 2024
BASE = "https://apidatalake.tesouro.gov.br/ords/cdwhprd/siconfi/tt/dca"
OUT = Path(__file__).resolve().parents[1] / "data" / "snapshot.json"

CAPITALS = [
    ("Manaus", "AM", 1302603, "Norte", 5, 2),
    ("Belém", "PA", 1501402, "Norte", 6, 3),
    ("Palmas", "TO", 1721000, "Norte", 6, 5),
    ("São Luís", "MA", 2111300, "Nordeste", 7, 4),
    ("Fortaleza", "CE", 2304400, "Nordeste", 8, 5),
    ("Recife", "PE", 2611606, "Nordeste", 9, 6),
    ("Salvador", "BA", 2927408, "Nordeste", 8, 7),
    ("Campo Grande", "MS", 5002704, "Centro-Oeste", 5, 9),
    ("Goiânia", "GO", 5208707, "Centro-Oeste", 7, 8),
    ("Belo Horizonte", "MG", 3106200, "Sudeste", 9, 9),
    ("Rio de Janeiro", "RJ", 3304557, "Sudeste", 10, 10),
    ("São Paulo", "SP", 3550308, "Sudeste", 9, 11),
    ("Curitiba", "PR", 4106902, "Sul", 8, 11),
    ("Florianópolis", "SC", 4205407, "Sul", 9, 12),
    ("Porto Alegre", "RS", 4314902, "Sul", 8, 13),
]


def fetch(anexo: str, code: int) -> list[dict]:
    query = urllib.parse.urlencode({
        "an_exercicio": YEAR,
        "no_anexo": anexo,
        "co_esfera": "M",
        "id_ente": code,
    })
    request = urllib.request.Request(
        f"{BASE}?{query}",
        headers={"User-Agent": "pulso-publico/1.0 (dados-abertos; portfolio)"},
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        return json.load(response).get("items", [])


def first_value(rows: list[dict], *, account: str, column: str) -> float:
    matches = [
        float(row["valor"]) for row in rows
        if row.get("conta") == account and row.get("coluna") == column
        and row.get("valor") is not None
    ]
    if not matches:
        raise ValueError(f"Indicador ausente: {account} / {column}")
    value = matches[0]
    if not math.isfinite(value) or value < 0:
        raise ValueError(f"Valor inválido: {value}")
    return value


def build_city(city: tuple) -> dict:
    name, uf, code, region, x, y = city
    detail = fetch("DCA-Anexo I-E", code)
    total = first_value(detail, account="Despesas Exceto Intraorçamentárias", column="Despesas Empenhadas")
    health = first_value(detail, account="10 - Saúde", column="Despesas Empenhadas")
    education = first_value(detail, account="12 - Educação", column="Despesas Empenhadas")
    population = int(detail[0]["populacao"])
    result = {
        "city": name,
        "uf": uf,
        "ibgeCode": code,
        "region": region,
        "population": population,
        "totalExpense": round(total, 2),
        "expensePerCapita": round(total / population, 2),
        "healthExpense": round(health, 2),
        "healthShare": round(100 * health / total, 1),
        "educationExpense": round(education, 2),
        "educationShare": round(100 * education / total, 1),
        "mapX": x,
        "mapY": y,
    }
    time.sleep(1.05)  # limite oficial: uma requisição por segundo
    return result


def validate(cities: list[dict]) -> None:
    codes = [city["ibgeCode"] for city in cities]
    assert len(cities) == len(CAPITALS), "Recorte incompleto"
    assert len(codes) == len(set(codes)), "Códigos IBGE duplicados"
    for city in cities:
        assert city["population"] > 0
        assert city["totalExpense"] > 0
        assert 0 <= city["healthShare"] <= 100
        assert 0 <= city["educationShare"] <= 100


def main() -> None:
    cities = [build_city(city) for city in CAPITALS]
    validate(cities)
    payload = {
        "meta": {
            "title": "Pulso Público — Atlas do Dinheiro Municipal",
            "referenceYear": YEAR,
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "source": "Siconfi/STN — DCA, Anexo I-E",
            "sourceUrl": "https://apidatalake.tesouro.gov.br/docs/siconfi/",
            "scope": "15 capitais brasileiras",
            "license": "Dados públicos; código MIT",
        },
        "cities": cities,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(cities)} capitais gravadas em {OUT}")


if __name__ == "__main__":
    main()
