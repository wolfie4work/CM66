export default function Dashboard() {
  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Tableau de Bord CM66</h1>
        <p className="page-description">Plateforme de dimensionnement de structures métalliques selon les normes françaises CM66 et NV65.</p>
      </header>

      {/* Statistics Row */}
      <section className="stat-row">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div>
            <div className="stat-num">148</div>
            <div className="stat-lbl">Profilés Catalogue</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-purple)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </div>
          <div>
            <div className="stat-num">CM66 / NV65</div>
            <div className="stat-lbl">Normes Actives</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--success)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <div className="stat-num">100%</div>
            <div className="stat-lbl">Calculs Vérifiés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--warning)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <div className="stat-num">PDF / Typst</div>
            <div className="stat-lbl">Format Rapport</div>
          </div>
        </div>
      </section>

      {/* Main Workspace Cards */}
      <div className="dashboard-grid">
        
        {/* Module 1: Vent */}
        <div className="glass-panel dash-card" style={{ borderLeft: '3px solid var(--primary)' }}>
          <div className="dash-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
            </svg>
          </div>
          <h3 className="dash-card-title">1. Actions du Vent (NV65)</h3>
          <p className="dash-card-desc">
            Calculez les pressions dynamiques de base, les coefficients de traînée et les surcharges climatiques sur les versants de votre bâtiment.
          </p>
          <a href="/vent" className="dash-card-link">
            Calculer le vent &rarr;
          </a>
        </div>

        {/* Module 2: Pannes */}
        <div className="glass-panel dash-card" style={{ borderLeft: '3px solid var(--accent-purple)' }}>
          <div className="dash-card-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3 className="dash-card-title">2. Pannes Lisses (Flexion Biaxiale)</h3>
          <p className="dash-card-desc">
            Vérifiez et optimisez le profilé le plus économique (IPE, HEA, HEB, UPN) sous flexion déviée en respectant les limites de contrainte et de flèche.
          </p>
          <a href="/pannes" className="dash-card-link" style={{ color: 'var(--accent-purple)' }}>
            Dimensionner les pannes &rarr;
          </a>
        </div>

        {/* Module 3: Potelets */}
        <div className="glass-panel dash-card" style={{ borderLeft: '3px solid var(--warning)' }}>
          <div className="dash-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <h3 className="dash-card-title">3. Potelets (Compression & Flambement)</h3>
          <p className="dash-card-desc">
            Modélisez les potelets de pignon soumis au vent et au poids propre. Calculez les élancements critiques et effectuez les vérifications de stabilité.
          </p>
          <a href="/potelets" className="dash-card-link" style={{ color: 'var(--warning)' }}>
            Vérifier les potelets &rarr;
          </a>
        </div>

        {/* Module 4: Rapport */}
        <div className="glass-panel dash-card" style={{ borderLeft: '3px solid var(--success)' }}>
          <div className="dash-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 className="dash-card-title">4. Note de Calcul (PDF)</h3>
          <p className="dash-card-desc">
            Compilez instantanément l'ensemble de vos dimensionnements en une note de calcul structurée, intégrant les formules détaillées et vérifications.
          </p>
          <a href="/rapport" className="dash-card-link" style={{ color: 'var(--success)' }}>
            Générer le rapport &rarr;
          </a>
        </div>

      </div>

      {/* Extra Premium Info Panel */}
      <section className="glass-panel" style={{ marginTop: '2.5rem', backgroundImage: 'radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.08), transparent 60%)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></span>
          Module d'optimisation en temps réel actif
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Le moteur calcule dynamiquement les sollicitations ELU/ELS en flexion biaxiale pour les familles <strong>IPE</strong>, <strong>HEA</strong>, <strong>HEB</strong>, et <strong>UPN</strong>. Les profils sont automatiquement triés par poids propre (daN/ml) afin de vous proposer le choix le plus économique et écologiquement responsable qui valide l'intégralité des vérifications imposées par le code <strong>CM66</strong>.
        </p>
      </section>
    </div>
  );
}
