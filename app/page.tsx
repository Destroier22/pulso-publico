"use client";

import { useMemo, useState } from "react";
import snapshot from "@/data/snapshot.json";

type City = (typeof snapshot.cities)[number];
type Metric = "expensePerCapita" | "healthShare" | "educationShare";

const regionOrder = ["Todas", "Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
const metricLabels: Record<Metric, string> = {
  expensePerCapita: "Despesa por pessoa",
  healthShare: "Prioridade em saúde",
  educationShare: "Prioridade em educação"
};

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const compactMoney = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 });
const number = new Intl.NumberFormat("pt-BR");

function metricValue(city: City, metric: Metric) {
  return city[metric];
}

function displayMetric(city: City, metric: Metric) {
  return metric === "expensePerCapita"
    ? money.format(city.expensePerCapita)
    : `${city[metric].toFixed(1).replace(".", ",")}%`;
}

export default function Home() {
  const [region, setRegion] = useState("Todas");
  const [metric, setMetric] = useState<Metric>("expensePerCapita");
  const [selectedCode, setSelectedCode] = useState(3550308);

  const filtered = useMemo(
    () => snapshot.cities.filter((city) => region === "Todas" || city.region === region),
    [region]
  );
  const selected = snapshot.cities.find((city) => city.ibgeCode === selectedCode) ?? filtered[0];
  const max = Math.max(...snapshot.cities.map((city) => metricValue(city, metric)));
  const totalPeople = filtered.reduce((sum, city) => sum + city.population, 0);
  const totalExpense = filtered.reduce((sum, city) => sum + city.totalExpense, 0);
  const weightedHealth = filtered.reduce((sum, city) => sum + city.healthExpense, 0) / totalExpense * 100;
  const leader = [...filtered].sort((a, b) => metricValue(b, metric) - metricValue(a, metric))[0];

  function chooseRegion(next: string) {
    setRegion(next);
    const first = snapshot.cities.find((city) => next === "Todas" || city.region === next);
    if (first) setSelectedCode(first.ibgeCode);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Pulso Público, início">
          <span className="brand-mark">PP</span>
          <span>Pulso Público</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#atlas">Atlas</a>
          <a href="#leitura">Leitura</a>
          <a href="#metodo">Método</a>
        </nav>
        <a className="source-button" href={snapshot.meta.sourceUrl} target="_blank" rel="noreferrer">
          Dados abertos ↗
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="eyebrow"><span /> CONTAS PÚBLICAS, EM LINGUAGEM PÚBLICA</div>
        <h1>Do cofre <em>à rua.</em></h1>
        <p className="hero-copy">
          Quanto uma capital gasta por pessoa? Que parte do orçamento vira saúde e educação?
          O Pulso Público transforma contas anuais em perguntas que cabem na conversa.
        </p>
        <div className="hero-meta">
          <div><strong>{snapshot.meta.referenceYear}</strong><span>ano de referência</span></div>
          <div><strong>{snapshot.cities.length}</strong><span>capitais no recorte</span></div>
          <div><strong>1×/semana</strong><span>rotina de atualização</span></div>
        </div>
        <div className="hero-note">
          <span className="note-index">01</span>
          <p>Gastar mais não significa, sozinho, entregar melhor. Este atlas abre a comparação — não fecha o diagnóstico.</p>
        </div>
      </section>

      <section className="dashboard" id="atlas">
        <div className="section-heading">
          <div>
            <span className="kicker">ATLAS COMPARATIVO</span>
            <h2>O orçamento<br />muda de endereço.</h2>
          </div>
          <p>Selecione uma lente, filtre o território e toque em uma capital para ler sua composição fiscal.</p>
        </div>

        <div className="control-row">
          <div className="segmented" aria-label="Filtrar por região">
            {regionOrder.map((item) => (
              <button key={item} className={region === item ? "active" : ""} onClick={() => chooseRegion(item)}>
                {item}
              </button>
            ))}
          </div>
          <label className="select-wrap">
            <span>Lente</span>
            <select value={metric} onChange={(event) => setMetric(event.target.value as Metric)} aria-label="Escolher indicador do mapa">
              <option value="expensePerCapita">Despesa por pessoa</option>
              <option value="healthShare">Participação da saúde</option>
              <option value="educationShare">Participação da educação</option>
            </select>
          </label>
        </div>

        <div className="dashboard-grid">
          <div className="map-card">
            <div className="map-title">
              <div><span>BRASIL · CAPITAIS</span><strong>{metricLabels[metric]}</strong></div>
              <div className="legend"><i /> menor <b /> maior</div>
            </div>
            <div className="tile-map" role="group" aria-label={`Mapa esquemático das capitais por ${metricLabels[metric]}`}>
              <div className="brazil-word" aria-hidden="true">BR</div>
              {snapshot.cities.map((city) => {
                const visible = region === "Todas" || city.region === region;
                const intensity = 0.2 + 0.8 * metricValue(city, metric) / max;
                return (
                  <button
                    key={city.ibgeCode}
                    className={`map-dot ${selected?.ibgeCode === city.ibgeCode ? "selected" : ""} ${visible ? "" : "muted"}`}
                    style={{
                      left: `${city.mapX * 7}%`,
                      top: `${city.mapY * 6.5}%`,
                      "--intensity": intensity
                    } as React.CSSProperties}
                    onClick={() => { setSelectedCode(city.ibgeCode); if (!visible) setRegion("Todas"); }}
                    aria-label={`${city.city}, ${displayMetric(city, metric)}`}
                    title={`${city.city} · ${displayMetric(city, metric)}`}
                  >
                    <span>{city.uf}</span>
                  </button>
                );
              })}
            </div>
            <p className="map-caption">Mapa esquemático para comparação; posições aproximadas e sem uso cartográfico.</p>
          </div>

          {selected && (
            <aside className="city-card" aria-live="polite">
              <div className="city-head">
                <div><span>{selected.region}</span><h3>{selected.city}</h3><p>{selected.uf} · código IBGE {selected.ibgeCode}</p></div>
                <div className="rank-dot">{selected.uf}</div>
              </div>
              <div className="big-stat">
                <span>DESPESA EMPENHADA POR PESSOA</span>
                <strong>{money.format(selected.expensePerCapita)}</strong>
                <p>{compactMoney.format(selected.totalExpense)} em despesas · {number.format(selected.population)} habitantes</p>
              </div>
              <div className="share">
                <div><span>Saúde</span><strong>{selected.healthShare.toFixed(1).replace(".", ",")}%</strong></div>
                <div className="track"><i style={{ width: `${selected.healthShare}%` }} /></div>
                <small>{compactMoney.format(selected.healthExpense)} empenhados</small>
              </div>
              <div className="share education">
                <div><span>Educação</span><strong>{selected.educationShare.toFixed(1).replace(".", ",")}%</strong></div>
                <div className="track"><i style={{ width: `${selected.educationShare}%` }} /></div>
                <small>{compactMoney.format(selected.educationExpense)} empenhados</small>
              </div>
              <p className="city-caveat">Percentuais calculados sobre as despesas exceto intraorçamentárias.</p>
            </aside>
          )}
        </div>

        <div className="summary-strip">
          <div><span>POPULAÇÃO NO RECORTE</span><strong>{number.format(totalPeople)}</strong></div>
          <div><span>DESPESA SOMADA</span><strong>{compactMoney.format(totalExpense)}</strong></div>
          <div><span>SAÚDE, MÉDIA PONDERADA</span><strong>{weightedHealth.toFixed(1).replace(".", ",")}%</strong></div>
          <div><span>LÍDER NA LENTE</span><strong>{leader.city}</strong><small>{displayMetric(leader, metric)}</small></div>
        </div>
      </section>

      <section className="ranking" id="leitura">
        <div className="ranking-intro">
          <span className="kicker">COMPARAR SEM SIMPLIFICAR</span>
          <h2>Uma mesma conta.<br />Realidades diferentes.</h2>
          <p>Ordenação pela lente escolhida. As barras ajudam a enxergar distância, não desempenho de serviços.</p>
        </div>
        <div className="ranking-list">
          {[...filtered].sort((a, b) => metricValue(b, metric) - metricValue(a, metric)).map((city, index) => (
            <button key={city.ibgeCode} onClick={() => setSelectedCode(city.ibgeCode)}>
              <span className="rank">{String(index + 1).padStart(2, "0")}</span>
              <span className="rank-name">{city.city}<small>{city.uf} · {city.region}</small></span>
              <span className="bar"><i style={{ width: `${100 * metricValue(city, metric) / max}%` }} /></span>
              <strong>{displayMetric(city, metric)}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="method" id="metodo">
        <div className="method-title">
          <span className="kicker">METODOLOGIA ABERTA</span>
          <h2>O caminho do dado<br />também é público.</h2>
        </div>
        <div className="pipeline">
          <article><span>01</span><h3>Importar</h3><p>Consulta a DCA de cada capital pela API Siconfi, respeitando o limite oficial de requisições.</p></article>
          <article><span>02</span><h3>Limpar</h3><p>Seleciona despesas empenhadas, padroniza nomes e converte valores para tipos numéricos.</p></article>
          <article><span>03</span><h3>Validar</h3><p>Testa completude, códigos IBGE únicos, valores positivos e percentuais entre 0 e 100.</p></article>
          <article><span>04</span><h3>Publicar</h3><p>Uma rotina semanal atualiza o snapshot e registra a mudança no histórico do repositório.</p></article>
        </div>
        <div className="source-grid">
          <div className="source-callout">
            <span>FONTE PRIMÁRIA</span>
            <h3>Siconfi / Tesouro Nacional</h3>
            <p>Declaração das Contas Anuais, Anexo I-E — despesas por função. Exercício {snapshot.meta.referenceYear}.</p>
            <a href={snapshot.meta.sourceUrl} target="_blank" rel="noreferrer">Abrir documentação oficial ↗</a>
          </div>
          <div className="limits">
            <h3>Como ler sem tropeçar</h3>
            <ul>
              <li>Despesa empenhada é compromisso orçamentário, não pagamento realizado.</li>
              <li>Valores nominais não estão corrigidos pela inflação.</li>
              <li>O recorte cobre 15 capitais, não representa todos os municípios.</li>
              <li>Qualidade da política pública exige indicadores de resultado adicionais.</li>
            </ul>
          </div>
        </div>
      </section>

      <footer>
        <div><span className="brand-mark">PP</span><strong>Pulso Público</strong></div>
        <p>Um projeto de dados abertos para aproximar orçamento e cidadania.</p>
        <span>Snapshot gerado em {new Date(snapshot.meta.generatedAt).toLocaleDateString("pt-BR")}</span>
      </footer>
    </main>
  );
}
