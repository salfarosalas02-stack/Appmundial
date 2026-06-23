export const metadata = { title: 'Metodología · Mundial 2026' };

export default function MetodologiaPage() {
  return (
    <div className="wrap">
      <div className="hero" style={{ paddingBottom: 6 }}>
        <h1>Cómo se calcula <span>todo</span></h1>
        <p>Transparencia total: cada número sale de un método explicable. Nada está inventado. No es asesoría de apuestas; son estimaciones estadísticas con su incertidumbre.</p>
      </div>
      <section style={{ paddingTop: 14 }}>
        <div className="method-grid">
          <div className="mt"><div className="ic">📊</div><h4>1 · Fuerza de cada selección</h4><p>Cuánto ataca y cuánto defiende cada equipo respecto al promedio del torneo. Más de 1 = mejor que la media.</p></div>
          <div className="mt"><div className="ic">🎯</div><h4>2 · Goles esperados (λ)</h4><p>Cruzamos el ataque de un equipo con la defensa del rival para estimar cuántos goles marcaría cada uno.</p></div>
          <div className="mt"><div className="ic">🔢</div><h4>3 · Modelo Poisson</h4><p>Con esos goles esperados calculamos la probabilidad de cada marcador posible.</p></div>
          <div className="mt"><div className="ic">⚖️</div><h4>4 · Ajustes</h4><p>Forma reciente, nivel del rival, fase del torneo y sede neutral (sin localía salvo anfitriones).</p></div>
        </div>
        <div className="mt" style={{ marginTop: 16 }}>
          <h4 style={{ fontSize: 15, marginBottom: 4 }}>Las fórmulas, sin misterio</h4>
          <div className="formula">{`FuerzaAtaque(A) = goles_a_favor(A) / promedio_torneo
FuerzaDefensa(B) = goles_en_contra(B) / promedio_torneo

λ(A) = FuerzaAtaque(A) × FuerzaDefensa(B) × μ    # μ ≈ 1.35

P(marcador i-j) = Poisson(i; λA) × Poisson(j; λB)`}</div>
          <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>De la matriz de marcadores se derivan <b style={{ color: 'var(--txt)' }}>todas</b> las estadísticas: 1X2, ambos anotan, valla cero, total de goles y marcador más probable.</p>
        </div>
        <div className="mt" style={{ marginTop: 16, borderColor: 'rgba(255,176,32,.3)' }}>
          <h4 style={{ fontSize: 15, marginBottom: 6, color: 'var(--amber)' }}>⚠️ Limitaciones honestas</h4>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>El modelo asume independencia entre los goles de ambos equipos y se alimenta de muestras pequeñas. Por eso cada predicción incluye un <b style={{ color: 'var(--txt)' }}>nivel de confianza</b> y se presenta como estimación, nunca como certeza.</p>
          <div className="legend">
            <div className="it"><span className="badge b-confirmado">Confirmado</span> dato oficial</div>
            <div className="it"><span className="badge b-estimado">Estimado</span> dato parcial</div>
            <div className="it"><span className="badge b-simulado">Simulado</span> demo</div>
            <div className="it"><span className="badge b-prediccion">Predicción</span> del modelo</div>
          </div>
        </div>
      </section>
    </div>
  );
}
