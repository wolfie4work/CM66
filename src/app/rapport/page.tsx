"use client";

import { useState } from 'react';

export default function RapportModule() {
  const [titre, setTitre] = useState('NOTE DE CALCUL - CHARPENTE DL');
  const [auteur, setAuteur] = useState('Oussama Bourhim');
  const [societe, setSociete] = useState('EST - Génie Civil S4');
  const [isCompiling, setIsCompiling] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [downloadReady, setDownloadReady] = useState(false);

  const handleCompile = () => {
    setIsCompiling(true);
    setDownloadReady(false);
    setLogs([
      "// Initializing Typst modern compilation pipeline...",
      "// Parsing NV65 Wind loads nodes...",
      "// Parsing CM66 Flexion Biaxiale tables for Pannes...",
      "// Parsing Stability and Buckling matrices for Potelets...",
    ]);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        "// Assembling PDF document elements...",
        "// Resolving fonts (Inter & Fira Code)...",
        "// Typst compilation completed successfully in 42ms!"
      ]);
      setIsCompiling(false);
      setDownloadReady(true);
    }, 1200);
  };

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Compilateur de Note de Calcul</h1>
        <p className="page-description">Compilez vos calculs climatiques et structurels en un rapport PDF propre et professionnel de qualité supérieure grâce au moteur Typst.</p>
      </header>

      <div className="studio-grid" style={{ gridTemplateColumns: '400px 1fr' }}>
        
        {/* Left Compiler Settings Panel */}
        <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Paramètres du Document
          </h3>

          {/* Title */}
          <div className="form-group">
            <span className="form-label">Titre du Rapport</span>
            <input 
              type="text" 
              value={titre} 
              onChange={e => setTitre(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Author */}
          <div className="form-group">
            <span className="form-label">Auteur / Ingénieur</span>
            <input 
              type="text" 
              value={auteur} 
              onChange={e => setAuteur(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Company */}
          <div className="form-group">
            <span className="form-label">Organisme / Université</span>
            <input 
              type="text" 
              value={societe} 
              onChange={e => setSociete(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Engine select */}
          <div className="form-group">
            <span className="form-label">Compilateur Document</span>
            <select className="form-select">
              <option value="typst">Typst Modern Solver (Recommandé)</option>
              <option value="latex">LaTeX Standard Engine</option>
              <option value="html">HTML Studio Viewport</option>
            </select>
          </div>

          {/* Sections Checkbox group */}
          <div className="form-group">
            <span className="form-label">Sections à Inclure</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
                <span>1. Actions Climatiques (NV65)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
                <span>2. Dimensionnement des Pannes (Flexion Déviée)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
                <span>3. Vérification des Potelets (Flambement)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-dark)' }}>
                <input type="checkbox" disabled style={{ accentColor: 'var(--primary)' }} />
                <span>4. Assemblages Boulonnés / Soudés (À venir)</span>
              </label>
            </div>
          </div>

          {/* Action Trigger */}
          <button 
            type="button" 
            onClick={handleCompile}
            disabled={isCompiling}
            className="btn-generate"
            style={{ marginTop: '0.5rem' }}
          >
            {isCompiling ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1.5s linear infinite' }}>
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
                COMPILATION...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                COMPILER RAPPORT
              </>
            )}
          </button>
        </section>

        {/* Right Preview Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <section className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem' }}>
              Prévisualisation de l'Asset (Feuille d'Impression)
            </h3>

            {/* Document sheet mockup */}
            <div style={{ 
              background: '#ffffff', 
              color: '#0f172a',
              borderRadius: '8px',
              padding: '2.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '350px',
              border: '1px solid rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {/* Header border */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', borderBottom: '1.5px solid #0f172a', paddingBottom: '0.5rem', color: '#64748b', fontWeight: '600' }}>
                <span>NOTE DE CALCUL TECHNIQUE</span>
                <span>CONFORME REGLÉMENT CM66</span>
              </div>

              {/* Title block */}
              <div style={{ margin: 'auto 0' }}>
                <span style={{ fontSize: '0.75rem', background: '#3b82f6', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>TYPST SOUPLE</span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.02em', marginTop: '0.5rem', color: '#1e293b', textTransform: 'uppercase', lineHeight: '1.2' }}>
                  {titre || "NOTE DE CALCUL"}
                </h1>
                <div style={{ width: '40px', height: '4px', backgroundColor: '#3b82f6', marginTop: '0.75rem' }}></div>
              </div>

              {/* Cover footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.75rem', color: '#475569', paddingTop: '1rem', borderTop: '0.5px solid #cbd5e1' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', color: '#94a3b8' }}>INGÉNIEUR CALCULS</span>
                  <strong>{auteur || "INGENIEUR"}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', color: '#94a3b8' }}>ORGANISME</span>
                  <strong>{societe || "ETABLISSEMENT"}</strong>
                </div>
              </div>
            </div>

            {/* Micro logs if compiling */}
            {logs.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div className="terminal-logs" style={{ height: '110px' }}>
                  {logs.map((log, index) => (
                    <div key={index} className="terminal-line">
                      <span className="terminal-prompt">$</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download Action */}
            {downloadReady && (
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="button" style={{ 
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  TÉLÉCHARGER LE DOCUMENT PDF
                </button>
                
                <button type="button" style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}>
                  Voir Code Typst
                </button>
              </div>
            )}

          </section>

        </div>

      </div>
    </div>
  );
}
