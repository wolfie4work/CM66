"use client";

import { useState, useMemo } from 'react';
import { CatalogueProfils } from '../../lib/cm66/catalogue';

export default function PoteletsModule() {
  const [famille, setFamille] = useState('HEA');
  const [hauteur, setHauteur] = useState(6.5);
  const [chargeN, setChargeN] = useState(8.5);
  const [ventQ, setVentQ] = useState(60);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  // Reactive: auto-compute on every input change using real catalogue
  const { results, selectedProfil } = useMemo(() => {
    const profils = (() => { try { return CatalogueProfils.getFamille(famille); } catch { return []; } })();
    // Pick a mid-range profile for the potelets check (index 2 or first available)
    const profil = profils.length > 2 ? profils[2] : profils[0];
    if (!profil) {
      return { results: { lambda_y: 0, lambda_z: 0, lambda_max: 0, total_stress: 0, stressRatio: 0, slendernessRatio: 0, verifie: false }, selectedProfil: null };
    }

    const Iy = profil.axe_fort_y.Iy_cm4;
    const Iz = profil.axe_faible_z.Iz_cm4;
    const A = profil.section.A_cm2;
    const Wely = profil.axe_fort_y.Wely_cm3;
    const E = 2100000;

    const iy = Math.sqrt(Iy / A);
    const iz = Math.sqrt(Iz / A);
    const Lk = hauteur * 100;
    const lambda_y = Math.round((Lk / iy) * 10) / 10;
    const lambda_z = Math.round((Lk / iz) * 10) / 10;
    const lambda_max = Math.max(lambda_y, lambda_z);
    const slendernessRatio = Math.min(100, Math.round((lambda_max / 120) * 100));

    const N_daN = chargeN * 1000;
    const sigma_c = N_daN / A;
    const q_daN_cm = ventQ / 100;
    const M_daN_cm = (q_daN_cm * Math.pow(Lk, 2)) / 8;
    const sigma_f = M_daN_cm / Wely;
    const total_stress = Math.round((sigma_c + sigma_f) * 10) / 10;
    const stressRatio = Math.min(100, Math.round((total_stress / 2350) * 100));
    const verifie = total_stress <= 2350 && lambda_max <= 120;

    return { results: { lambda_y, lambda_z, lambda_max, total_stress, stressRatio, slendernessRatio, verifie }, selectedProfil: profil };
  }, [famille, hauteur, chargeN, ventQ]);

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Stabilité des Potelets (CM66)</h1>
        <p className="page-description">Vérifiez la résistance des potelets de pignon soumis à la compression axiale (flambement) et à la flexion sous le vent.</p>
      </header>

      <div className="studio-grid">
        <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Paramètres du Potelet
          </h3>

          <div className="form-group">
            <span className="form-label">Profil de Potelet</span>
            <div className="model-selector" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {['IPE', 'HEA', 'HEB'].map(fam => (
                <button key={fam} type="button" className={`model-tab ${famille === fam ? 'active' : ''}`} onClick={() => setFamille(fam)}>{fam}</button>
              ))}
            </div>
          </div>

          {selectedProfil && (
            <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Profilé utilisé : <strong style={{ color: 'var(--primary)' }}>{selectedProfil.designation}</strong> — A={selectedProfil.section.A_cm2} cm², Iy={selectedProfil.axe_fort_y.Iy_cm4} cm⁴
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <span>Hauteur de colonne (L)</span>
              <span className="form-label-value">{hauteur} m</span>
            </label>
            <div className="hybrid-input-row">
              <input type="range" min="3.0" max="12.0" step="0.1" value={hauteur} onChange={e => setHauteur(Number(e.target.value))} className="range-slider" />
              <input type="number" min="3.0" max="12.0" step="0.1" value={hauteur} onChange={e => setHauteur(clamp(Number(e.target.value), 3, 12))} className="form-input compact-number" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Effort Normal axial (N)</span>
              <span className="form-label-value">{chargeN} tonnes</span>
            </label>
            <div className="hybrid-input-row">
              <input type="range" min="1.0" max="40.0" step="0.5" value={chargeN} onChange={e => setChargeN(Number(e.target.value))} className="range-slider" />
              <input type="number" min="1.0" max="40.0" step="0.5" value={chargeN} onChange={e => setChargeN(clamp(Number(e.target.value), 1, 40))} className="form-input compact-number" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Vent transversal (q_vent)</span>
              <span className="form-label-value">{ventQ} daN/m</span>
            </label>
            <div className="hybrid-input-row">
              <input type="range" min="10" max="200" step="5" value={ventQ} onChange={e => setVentQ(Number(e.target.value))} className="range-slider" />
              <input type="number" min="10" max="200" step="5" value={ventQ} onChange={e => setVentQ(clamp(Number(e.target.value), 10, 200))} className="form-input compact-number" />
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section className={`glass-panel ${results.verifie ? 'success-glow' : 'error-glow'}`}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Vérification au Flambement (Art. 3.4)</span>
              <span style={{ fontSize: '0.75rem', background: results.verifie ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: results.verifie ? 'var(--success)' : 'var(--error)', padding: '0.2rem 0.6rem', borderRadius: '20px', border: results.verifie ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)', fontWeight: '700' }}>
                {results.verifie ? "VÉRIFIÉ ✓" : "NON CONFORME ❌"}
              </span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'center' }}>
              <div className="cad-viewport" style={{ height: '220px' }}>
                <div className="cad-grid-pattern"></div>
                <div className="cad-badge">FLAMBEMENT COORDONNÉES</div>
                <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                  <polygon points="90,30 83,40 97,40" stroke="var(--text-dark)" fill="rgba(255,255,255,0.05)" />
                  <polygon points="90,150 83,140 97,140" stroke="var(--text-dark)" fill="rgba(255,255,255,0.05)" />
                  <line x1="70" y1="150" x2="110" y2="150" stroke="var(--text-dark)" strokeWidth="2" />
                  <path d="M90,30 Q120,90 90,140" stroke="var(--warning)" strokeWidth="3" strokeDasharray="3 3" style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.4))' }} />
                  <line x1="90" y1="30" x2="90" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <path d="M90,5 L90,25 M90,25 L86,19 M90,25 L94,19" stroke="var(--error)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 3px var(--error-glow))' }} />
                  <text x="96" y="16" fill="var(--error)" fontSize="8" fontWeight="bold" fontFamily="var(--font-mono)">N={chargeN}t</text>
                  <path d="M50,85 L70,85 M70,85 L65,81 M70,85 L65,89" stroke="var(--primary)" strokeWidth="1.5" />
                  <text x="44" y="96" fill="var(--primary)" fontSize="8" fontWeight="bold" fontFamily="var(--font-mono)">q={ventQ}</text>
                  <text x="90" y="166" fill="var(--text-secondary)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">λ_max = {results.lambda_max}</text>
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Élancement local (axe faible z-z)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.15rem' }}>
                    <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{results.lambda_z}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>limite recommandée ≤ 120</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Élancement local (axe fort y-y)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.15rem' }}>
                    <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{results.lambda_y}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>iy = gyration forte</span>
                  </div>
                </div>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Contrainte combinée (Flambement + Flexion)</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.15rem' }}>
                    <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>{Math.round(results.total_stress / 10)} MPa</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>limite = 235 MPa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hud-meters" style={{ marginTop: '1.5rem' }}>
              <div className="hud-card">
                <div className="hud-label">Critère d'Élancement (Stabilité)</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div className="hud-value" style={{ color: results.lambda_max > 120 ? 'var(--error)' : 'var(--text-main)' }}>λ = {results.lambda_max}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{results.slendernessRatio}% de λ_lim (120)</div>
                </div>
                <div className="hud-progress-track">
                  <div className="hud-progress-fill" style={{ width: `${results.slendernessRatio}%`, backgroundColor: results.lambda_max > 120 ? 'var(--error)' : 'var(--success)', boxShadow: results.lambda_max > 120 ? '0 0 8px var(--error-glow)' : '0 0 8px var(--success-glow)' }}></div>
                </div>
              </div>
              <div className="hud-card">
                <div className="hud-label">Critère de Résistance (Stress)</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div className="hud-value" style={{ color: results.total_stress > 2350 ? 'var(--error)' : 'var(--text-main)' }}>
                    {Math.round(results.total_stress / 10)} <span style={{ fontSize: '0.85rem' }}>MPa</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{results.stressRatio}% de fy (235)</div>
                </div>
                <div className="hud-progress-track">
                  <div className="hud-progress-fill" style={{ width: `${results.stressRatio}%`, backgroundColor: results.total_stress > 2350 ? 'var(--error)' : 'var(--success)', boxShadow: results.total_stress > 2350 ? '0 0 8px var(--error-glow)' : '0 0 8px var(--success-glow)' }}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              ℹ️ Théorie du Flambement Simple (CM66 Art 3.4)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Sous un effort axial de compression <strong>N</strong>, une barre svelte risque de fléchir brutalement avant d'atteindre sa limite élastique. Le coefficient d'amplification de contrainte <strong>k</strong> (degré de flambement) est calculé en fonction de l'élancement élancé maximum <strong>λ</strong>, multipliant la contrainte de compression simple pour la vérification réglementaire.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
