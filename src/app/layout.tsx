import "./globals.css";

export const metadata = {
  title: "Plateforme CM66 Studio",
  description: "Studio de dimensionnement de structures métalliques selon les normes CM66 et NV65",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="layout">
          <aside className="sidebar">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">Ω</div>
              <div>
                <h2>CM66 Studio</h2>
                <span className="sidebar-logo-badge">v1.2 STABLE</span>
              </div>
            </div>
            
            <nav style={{ flexGrow: 1 }}>
              <ul className="sidebar-nav">
                <li>
                  <a href="/" className="sidebar-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="9" />
                      <rect x="14" y="3" width="7" height="5" />
                      <rect x="14" y="12" width="7" height="9" />
                      <rect x="3" y="16" width="7" height="5" />
                    </svg>
                    Tableau de bord
                  </a>
                </li>
                <li>
                  <a href="/vent" className="sidebar-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                    </svg>
                    Charges au Vent (NV65)
                  </a>
                </li>
                <li>
                  <a href="/pannes" className="sidebar-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Pannes Lisses (Flexion)
                  </a>
                </li>
                <li>
                  <a href="/potelets" className="sidebar-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    Potelets (Flambement)
                  </a>
                </li>
                <li>
                  <a href="/rapport" className="sidebar-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Rapport de Calcul
                  </a>
                </li>
              </ul>
            </nav>
            
            <div className="sidebar-footer">
              <p>Projet de Dimensionnement</p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Génie Civil S4 • CM66</p>
            </div>
          </aside>
          
          <main className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
