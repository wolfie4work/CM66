"use client";

import { useState, useMemo } from 'react';

export default function VentModule() {
  const [zone, setZone] = useState('Zone II');
  const [site, setSite] = useState('Normal');
  const [hauteur, setHauteur] = useState(8);
  const [longueur, setLongueur] = useState(20);
  const [largeur, setLargeur] = useState(12);

  // Clamp helper
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  // Reactive computation — recalculates on every input change
  const results = useMemo(() => {
    let qBase = 50; // Zone I
    if (zone === 'Zone II') qBase = 70;
    else if (zone === 'Zone III') qBase = 90;
    else if (zone === 'Zone IV') qBase = 115;

    let kSite = 1.0;
    if (site === 'Exposé') kSite = 1.25;
    else if (site === 'Protégé') kSite = 0.8;

    // Height modifier ks = 2.5 * (h + 18) / (h + 60) for h <= 30m
    const kHauteur = Number((2.5 * (hauteur + 18) / (hauteur + 60)).toFixed(3));
    const qDyn = Math.round(qBase * kSite * kHauteur * 10) / 10;
    const extremeWind = Math.round(qDyn * 1.75 * 10) / 10;

    return { qBase, kSite, kHauteur, qDyn, extremeWind };
  }, [zone, site, hauteur, longueur, largeur]);

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Actions du Vent (NV65)</h1>
        <p className="page-description">Déterminez les pressions dynamiques de base, normales et extrêmes agissant sur les parois de votre structure.</p>
      </header>

      <div className="studio-grid">
        {/* Parameters input card */}
        <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Paramètres d'Implantation
          </h3>

          {/* Zone Selector */}
          <div className="form-group">
            <span className="form-label">Zone de Vent (Région)</span>
            <select 
              value={zone} 
              onChange={e => setZone(e.target.value)}
              className="form-select"
            >
              <option value="Zone I">Zone I (q = 50 daN/m²)</option>
              <option value="Zone II">Zone II (q = 70 daN/m²)</option>
              <option value="Zone III">Zone III (q = 90 daN/m²)</option>
              <option value="Zone IV">Zone IV (q = 115 daN/m²)</option>
            </select>
          </div>

          {/* Nature du Site */}
          <div className="form-group">
            <span className="form-label">Nature du Site</span>
            <select 
              value={site} 
              onChange={e => setSite(e.target.value)}
              className="form-select"
            >
              <option value="Protégé">Protégé (kS = 0.80)</option>
              <option value="Normal">Normal (kS = 1.00)</option>
              <option value="Exposé">Exposé (kS = 1.25)</option>
            </select>
          </div>

          {/* Hauteur building */}
          <div className="form-group">
            <label className="form-label">
              <span>Hauteur au faîtage (H)</span>
              <span className="form-label-value">{hauteur} m</span>
            </label>
            <div className="hybrid-input-row">
              <input 
                type="range" 
                min="4" 
                max="25" 
                step="0.5" 
                value={hauteur} 
                onChange={e => setHauteur(Number(e.target.value))}
                className="range-slider"
              />
              <input
                type="number"
                min="4"
                max="25"
                step="0.5"
                value={hauteur}
                onChange={e => setHauteur(clamp(Number(e.target.value), 4, 25))}
                className="form-input compact-number"
              />
            </div>
          </div>

          {/* Longueur building */}
          <div className="form-group">
            <label className="form-label">
              <span>Longueur totale (L)</span>
              <span className="form-label-value">{longueur} m</span>
            </label>
            <div className="hybrid-input-row">
              <input 
                type="range" 
                min="10" 
                max="60" 
                step="1" 
                value={longueur} 
                onChange={e => setLongueur(Number(e.target.value))}
                className="range-slider"
              />
              <input
                type="number"
                min="10"
                max="60"
                step="1"
                value={longueur}
                onChange={e => setLongueur(clamp(Number(e.target.value), 10, 60))}
                className="form-input compact-number"
              />
            </div>
          </div>

          {/* Largeur building */}
          <div className="form-group">
            <label className="form-label">
              <span>Largeur de pignon (l)</span>
              <span className="form-label-value">{largeur} m</span>
            </label>
            <div className="hybrid-input-row">
              <input 
                type="range" 
                min="6" 
                max="30" 
                step="0.5" 
                value={largeur} 
                onChange={e => setLargeur(Number(e.target.value))}
                className="range-slider"
              />
              <input
                type="number"
                min="6"
                max="30"
                step="0.5"
                value={largeur}
                onChange={e => setLargeur(clamp(Number(e.target.value), 6, 30))}
                className="form-input compact-number"
              />
            </div>
          </div>
        </section>

        {/* Output visualization and values card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <section className="glass-panel" style={{ borderLeft: '3px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem' }}>
              Bilan des Actions Climat (NV65)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'center' }}>
              {/* Dynamic CAD profile graphic representing wind loads */}
              <div className="cad-viewport" style={{ height: '220px' }}>
                <div className="cad-grid-pattern"></div>
                <div className="cad-badge">VENT GÉOMÉTRIE</div>
                
                {/* Visual SVG house under wind pressure */}
                <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                  {/* Soil line */}
                  <line x1="10" y1="140" x2="170" y2="140" stroke="var(--text-dark)" strokeWidth="2" />
                  
                  {/* Building outline */}
                  <polygon points="50,140 50,90 90,60 130,90 130,140" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
                  
                  {/* Dimension markers */}
                  <line x1="142" y1="60" x2="142" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                  <circle cx="142" cy="60" r="1.5" fill="rgba(255,255,255,0.5)" />
                  <circle cx="142" cy="140" r="1.5" fill="rgba(255,255,255,0.5)" />
                  <text x="148" y="104" fill="var(--text-secondary)" fontSize="8" fontFamily="var(--font-mono)">H={hauteur}m</text>

                  {/* Wind Arrow animations */}
                  <g style={{ filter: 'drop-shadow(0 0 4px var(--primary-glow))' }}>
                    <path d="M15,80 L35,80 M35,80 L29,75 M35,80 L29,85" stroke="var(--primary)" strokeWidth="2" />
                    <path d="M15,110 L35,110 M35,110 L29,105 M35,110 L29,115" stroke="var(--primary)" strokeWidth="2" />
                    <path d="M20,50 L40,65 M40,65 L33,60 M40,65 L37,71" stroke="var(--primary)" strokeWidth="2" />
                  </g>
                  
                  <text x="90" y="152" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Portique l = {largeur}m</text>
                  <text x="90" y="164" fill="var(--primary)" fontSize="8" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-mono)">q_dyn = {results.qDyn} daN/m²</text>
                </svg>
              </div>

              {/* Solved values */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Rapport géométrique (Coefficient de hauteur ks)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.15rem' }}>
                    <strong style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>{results.kHauteur}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>déterminé à {hauteur}m du sol</span>
                  </div>
                </div>

                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Pression Dynamique de Base</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.15rem' }}>
                    <strong style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>{results.qBase}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>daN/m² (Région {zone})</span>
                  </div>
                </div>

                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Coefficient global de site (ksite)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.15rem' }}>
                    <strong style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>{results.kSite}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>({site})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing progress visual meters */}
            <div className="hud-meters" style={{ marginTop: '1.5rem' }}>
              <div className="hud-card">
                <div className="hud-label">Pression Dynamique Normale</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div className="hud-value" style={{ color: 'var(--primary)' }}>
                    {results.qDyn} <span style={{ fontSize: '0.85rem' }}>daN/m²</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>q = q_base × ks × ksite</div>
                </div>
                <div className="hud-progress-track">
                  <div className="hud-progress-fill" style={{ width: `${Math.min(100, (results.qDyn / 180) * 100)}%`, backgroundColor: 'var(--primary)', boxShadow: '0 0 8px var(--primary-glow)' }}></div>
                </div>
              </div>

              <div className="hud-card">
                <div className="hud-label">Pression Dynamique Extrême</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div className="hud-value" style={{ color: 'var(--accent-purple)' }}>
                    {results.extremeWind} <span style={{ fontSize: '0.85rem' }}>daN/m²</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>q_ext = q_norm × 1.75</div>
                </div>
                <div className="hud-progress-track">
                  <div className="hud-progress-fill" style={{ width: `${Math.min(100, (results.extremeWind / 300) * 100)}%`, backgroundColor: 'var(--accent-purple)', boxShadow: '0 0 8px var(--accent-purple-glow)' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick instructions card */}
          <section className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              ⚙️ Règlements NV65 Section III
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Les pressions de base sont calculées à une hauteur conventionnelle de 10 mètres. Le coefficient de hauteur <strong>ks</strong> modélise le profil de vitesse du vent dans les basses couches atmosphériques. Ces valeurs servent ensuite de charges d'entrée pour le dimensionnement des pannes et des potelets.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
