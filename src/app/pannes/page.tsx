"use client";

import { useState, useMemo } from 'react';
import { CatalogueProfils } from '../../lib/cm66/catalogue';
import { verifierProfilPanne, PannesInput, PannesResult } from '../../lib/cm66/pannes';
import { Profil } from '../../lib/types/profil';

export default function PannesModule() {
  const [famille, setFamille] = useState('IPE');
  const [input, setInput] = useState<PannesInput>({
    portee: 5,
    entraxe: 1.5,
    pente: 10,
    G: 20,
    Q_neige: 40,
    Q_vent: 50,
    fy: 235
  });

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  // Auto-calculate on every input change
  const { resultatOptimal, logs } = useMemo(() => {
    const stepLogs: string[] = [
      `// CM66 Dimensioning Engine v1.2`,
      `// Famille: ${famille} | fy=${input.fy} MPa | L=${input.portee}m | e=${input.entraxe}m | α=${input.pente}°`,
    ];

    try {
      const profils = CatalogueProfils.getFamille(famille);
      let profilGagnant: Profil | null = null;
      let resultatGagnant: PannesResult | null = null;

      for (const profil of profils) {
        const resultat = verifierProfilPanne(profil, input);
        const ratioSigma = Math.round((resultat.contrainte_max_MPa / input.fy) * 100);
        const ratioFleche = Math.round((resultat.fleche_mm / resultat.fleche_admissible_mm) * 100);

        if (resultat.verifie) {
          profilGagnant = profil;
          resultatGagnant = resultat;
          stepLogs.push(`🟢 ${profil.designation} : OK (σ=${ratioSigma}%, f=${ratioFleche}%) → Retenu!`);
          break;
        } else {
          stepLogs.push(`🔴 ${profil.designation} : Échec (${ratioSigma > 100 ? `σ=${ratioSigma}%` : `f=${ratioFleche}%`})`);
        }
      }

      if (profilGagnant && resultatGagnant) {
        stepLogs.push(`🎉 Profilé optimal : ${profilGagnant.designation}`);
        return { resultatOptimal: { profil: profilGagnant, resultat: resultatGagnant }, logs: stepLogs };
      } else {
        stepLogs.push(`⚠️ Aucun profilé ${famille} ne satisfait les critères.`);
        return { resultatOptimal: null, logs: stepLogs };
      }
    } catch {
      stepLogs.push(`⚠️ Erreur de calcul.`);
      return { resultatOptimal: null, logs: stepLogs };
    }
  }, [famille, input]);

  const getSvgContent = () => {
    if (!resultatOptimal) {
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 4" />
          <text x="100" y="105" fill="var(--text-dark)" fontSize="11" textAnchor="middle" fontFamily="var(--font-mono)">AUCUN RÉSULTAT</text>
        </svg>
      );
    }
    const { h_mm, b_mm, tw_mm, tf_mm } = resultatOptimal.profil.dimensions;
    const maxDim = Math.max(h_mm, b_mm);
    const scale = 130 / maxDim;
    const drawH = h_mm * scale;
    const drawW = b_mm * scale;
    const drawTw = Math.max(2.5, tw_mm * scale);
    const drawTf = Math.max(4.5, tf_mm * scale);
    const xCenter = 100;
    const yCenter = 100;
    const xStart = xCenter - drawW / 2;
    const yStart = yCenter - drawH / 2;
    const isUPN = famille.toUpperCase() === 'UPN';

    if (isUPN) {
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" style={{ filter: 'drop-shadow(0 0 8px var(--primary-glow))' }}>
          <rect x={xStart} y={yStart} width={drawW} height={drawTf} rx="1.5" fill="var(--primary)" />
          <rect x={xStart} y={yStart + drawH - drawTf} width={drawW} height={drawTf} rx="1.5" fill="var(--primary)" />
          <rect x={xStart} y={yStart + drawTf} width={drawTw} height={drawH - 2 * drawTf} fill="var(--primary)" opacity="0.85" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
          <text x={xStart - 12} y="104" fill="var(--text-secondary)" fontSize="9" textAnchor="end" fontFamily="var(--font-mono)">h={h_mm}mm</text>
          <text x="100" y={yStart - 10} fill="var(--text-secondary)" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">b={b_mm}mm</text>
          <text x="100" y="188" fill="var(--success)" fontSize="9" textAnchor="middle" fontWeight="bold">{resultatOptimal.profil.designation}</text>
        </svg>
      );
    } else {
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.35))' }}>
          <rect x={xStart} y={yStart} width={drawW} height={drawTf} rx="1.5" fill="var(--accent-purple)" />
          <rect x={xStart} y={yStart + drawH - drawTf} width={drawW} height={drawTf} rx="1.5" fill="var(--accent-purple)" />
          <rect x={xCenter - drawTw / 2} y={yStart + drawTf} width={drawTw} height={drawH - 2 * drawTf} fill="var(--accent-purple)" opacity="0.85" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
          <text x={xStart - 12} y="104" fill="var(--text-secondary)" fontSize="9" textAnchor="end" fontFamily="var(--font-mono)">h={h_mm}mm</text>
          <text x="100" y={yStart - 10} fill="var(--text-secondary)" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">b={b_mm}mm</text>
          <text x="100" y="188" fill="var(--success)" fontSize="9" textAnchor="middle" fontWeight="bold">{resultatOptimal.profil.designation}</text>
        </svg>
      );
    }
  };

  const getStressRatio = () => {
    if (!resultatOptimal) return 0;
    return Math.min(100, Math.round((resultatOptimal.resultat.contrainte_max_MPa / input.fy) * 100));
  };
  const getDeflectionRatio = () => {
    if (!resultatOptimal) return 0;
    return Math.min(100, Math.round((resultatOptimal.resultat.fleche_mm / resultatOptimal.resultat.fleche_admissible_mm) * 100));
  };

  // Hybrid input helper
  const HybridInput = ({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) => (
    <div className="form-group">
      <label className="form-label">
        <span>{label}</span>
        <span className="form-label-value">{value} {unit}</span>
      </label>
      <div className="hybrid-input-row">
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="range-slider" />
        <input type="number" min={min} max={max} step={step} value={value} onChange={e => onChange(clamp(Number(e.target.value), min, max))} className="form-input compact-number" />
      </div>
    </div>
  );

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Dimensionnement des Pannes</h1>
        <p className="page-description">Synthétisez et optimisez des profilés en acier sous flexion déviée selon la méthode réglementaire CM66.</p>
      </header>

      <div className="studio-grid">
        <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Paramètres du Générateur
          </h3>

          <div className="form-group">
            <span className="form-label">Modèle de Profilé (Famille)</span>
            <div className="model-selector">
              {['IPE', 'HEA', 'HEB', 'UPN', 'IPN'].map(fam => (
                <button key={fam} type="button" className={`model-tab ${famille === fam ? 'active' : ''}`} onClick={() => setFamille(fam)}>{fam}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Grade de l'Acier (fy)</span>
            <select value={input.fy} onChange={e => setInput({ ...input, fy: Number(e.target.value) })} className="form-select">
              <option value={235}>S235 (fy = 235 MPa)</option>
              <option value={355}>S355 (fy = 355 MPa)</option>
            </select>
          </div>

          <HybridInput label="Portée de la panne (L)" value={input.portee} min={2} max={12} step={0.1} unit="m" onChange={v => setInput({ ...input, portee: v })} />
          <HybridInput label="Entraxe pannes" value={input.entraxe} min={0.5} max={4} step={0.1} unit="m" onChange={v => setInput({ ...input, entraxe: v })} />
          <HybridInput label="Pente de la toiture (α)" value={input.pente} min={0} max={45} step={1} unit="°" onChange={v => setInput({ ...input, pente: v })} />
          <HybridInput label="Charges Permanentes (G)" value={input.G} min={10} max={150} step={5} unit="daN/m²" onChange={v => setInput({ ...input, G: v })} />
          <HybridInput label="Surcharge de Neige (Qn)" value={input.Q_neige} min={0} max={150} step={5} unit="daN/m²" onChange={v => setInput({ ...input, Q_neige: v })} />
          <HybridInput label="Surcharge de Vent (Qv)" value={input.Q_vent} min={0} max={200} step={5} unit="daN/m²" onChange={v => setInput({ ...input, Q_vent: v })} />
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section className={`glass-panel ${resultatOptimal ? (resultatOptimal.resultat.verifie ? 'success-glow' : 'error-glow') : ''}`}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Viewport de Rendu CAD</span>
              {resultatOptimal && (
                <span style={{ fontSize: '0.75rem', background: resultatOptimal.resultat.verifie ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: resultatOptimal.resultat.verifie ? 'var(--success)' : 'var(--error)', padding: '0.2rem 0.6rem', borderRadius: '20px', border: resultatOptimal.resultat.verifie ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)', fontWeight: '700' }}>
                  {resultatOptimal.resultat.verifie ? "CONFORME ✓" : "NON CONFORME ❌"}
                </span>
              )}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'center' }}>
              <div className="cad-viewport">
                <div className="cad-grid-pattern"></div>
                <div className="cad-badge">{famille} SECTION</div>
                {getSvgContent()}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {!resultatOptimal ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <p><strong>Aucun profilé trouvé.</strong></p>
                    <p style={{ marginTop: '0.5rem' }}>Ajustez vos paramètres (réduire la portée ou l'entraxe) pour trouver un profilé conforme.</p>
                  </div>
                ) : (
                  <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      {resultatOptimal.profil.designation}
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({resultatOptimal.profil.G_kg_ml} kg/ml)</span>
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem', fontSize: '0.85rem' }}>
                      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Moment Axe Fort (My)</span>
                        <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>{resultatOptimal.resultat.M_y_daNm}</strong> <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>daN.m</span>
                      </div>
                      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Moment Axe Faible (Mz)</span>
                        <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>{resultatOptimal.resultat.M_z_daNm}</strong> <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>daN.m</span>
                      </div>
                      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Inertie Axe Fort (Iy)</span>
                        <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>{resultatOptimal.profil.axe_fort_y.Iy_cm4}</strong> <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>cm⁴</span>
                      </div>
                      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Module de Flexion (Wely)</span>
                        <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>{resultatOptimal.profil.axe_fort_y.Wely_cm3}</strong> <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>cm³</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hud-meters">
              <div className="hud-card">
                <div className="hud-label">Taux d'utilisation en Contrainte</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div className="hud-value" style={{ color: getStressRatio() > 100 ? 'var(--error)' : 'var(--text-main)' }}>
                    {resultatOptimal ? `${resultatOptimal.resultat.contrainte_max_MPa} MPa` : '— MPa'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: getStressRatio() > 100 ? 'var(--error)' : 'var(--text-muted)' }}>
                    {getStressRatio()}% / 100%
                  </div>
                </div>
                <div className="hud-progress-track">
                  <div className="hud-progress-fill" style={{ width: `${getStressRatio()}%`, backgroundColor: getStressRatio() > 100 ? 'var(--error)' : (getStressRatio() > 80 ? 'var(--warning)' : 'var(--success)'), boxShadow: getStressRatio() > 100 ? '0 0 10px var(--error-glow)' : '0 0 10px var(--success-glow)' }}></div>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dark)', marginTop: '0.25rem', display: 'block' }}>Limite fy = {input.fy} MPa (Règles CM66 Section 3)</span>
              </div>

              <div className="hud-card">
                <div className="hud-label">Taux de Flèche Admissible</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div className="hud-value" style={{ color: getDeflectionRatio() > 100 ? 'var(--error)' : 'var(--text-main)' }}>
                    {resultatOptimal ? `${resultatOptimal.resultat.fleche_mm} mm` : '— mm'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: getDeflectionRatio() > 100 ? 'var(--error)' : 'var(--text-muted)' }}>
                    {getDeflectionRatio()}% / 100%
                  </div>
                </div>
                <div className="hud-progress-track">
                  <div className="hud-progress-fill" style={{ width: `${getDeflectionRatio()}%`, backgroundColor: getDeflectionRatio() > 100 ? 'var(--error)' : (getDeflectionRatio() > 85 ? 'var(--warning)' : 'var(--success)'), boxShadow: getDeflectionRatio() > 100 ? '0 0 10px var(--error-glow)' : '0 0 10px var(--success-glow)' }}></div>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dark)', marginTop: '0.25rem', display: 'block' }}>
                  Limite L/200 = {resultatOptimal ? `${resultatOptimal.resultat.fleche_admissible_mm} mm` : `${(input.portee * 1000) / 200} mm`}
                </span>
              </div>
            </div>
          </section>

          {/* Terminal logs */}
          <section className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="terminal-prompt">&gt;</span> Résolution de l'Optimiseur
            </h4>
            <div className="terminal-logs">
              {logs.map((log, index) => {
                let colorClass = "";
                if (log.includes("🟢") || log.includes("OK") || log.includes("🎉")) colorClass = "terminal-success";
                else if (log.includes("🔴") || log.includes("Échec")) colorClass = "terminal-error";
                else if (log.includes("⚠️")) colorClass = "terminal-warning";
                return (
                  <div key={index} className={`terminal-line ${colorClass}`}>
                    <span className="terminal-prompt">$</span>
                    <span>{log}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {resultatOptimal && (
            <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderLeft: '3px solid var(--success)' }}>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Note de Calcul Synthétisée</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Générez le rapport de structure au format PDF.</p>
              </div>
              <a href="/rapport" style={{ textDecoration: 'none', background: 'var(--success)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                Télécharger le Rapport
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
