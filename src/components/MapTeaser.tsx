import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
// Paths generated from real WGS84 coordinates via equirectangular projection
// ViewBox: 0 0 500 570

const REGIONS = [
  {
    id: "valle-daosta", name: "Valle d'Aosta",
    dot: { x: 31, y: 72 }, label: "AOSTA · 23",
    path: "M 8 62 L 24 58 L 57 63 L 57 85 L 42 91 L 21 84 L 8 73 Z"
  },
  {
    id: "piemonte", name: "Piemonte",
    dot: { x: 56, y: 111 }, label: "TORINO · 378",
    path: "M 1 152 L 1 131 L 8 73 L 21 84 L 42 91 L 57 85 L 97 63 L 105 84 L 101 110 L 92 136 L 76 157 L 50 170 L 25 174 L 8 163 Z"
  },
  {
    id: "liguria", name: "Liguria",
    dot: { x: 102, y: 141 }, label: "GENOVA · 198",
    path: "M 50 170 L 76 157 L 92 136 L 101 110 L 122 120 L 143 136 L 151 152 L 135 167 L 118 172 L 101 172 L 80 174 L 59 175 Z"
  },
  {
    id: "lombardia", name: "Lombardia",
    dot: { x: 139, y: 85 }, label: "MILANO · 890",
    path: "M 97 63 L 95 31 L 105 29 L 130 31 L 164 29 L 177 37 L 193 31 L 202 47 L 181 68 L 160 78 L 151 89 L 143 136 L 122 120 L 101 110 L 105 84 Z"
  },
  {
    id: "trentino-alto-adige", name: "Trentino-Alto Adige",
    dot: { x: 189, y: 31 }, label: "BOLZANO · 89",
    path: "M 164 29 L 164 0 L 185 5 L 210 3 L 235 11 L 248 21 L 235 42 L 202 47 L 193 31 L 177 37 Z"
  },
  {
    id: "veneto", name: "Veneto",
    dot: { x: 221, y: 78 }, label: "VENEZIA · 267",
    path: "M 193 31 L 202 47 L 235 42 L 248 21 L 269 31 L 277 58 L 261 84 L 248 94 L 235 105 L 219 110 L 193 99 L 181 68 Z"
  },
  {
    id: "friuli-venezia-giulia", name: "Friuli-Venezia Giulia",
    dot: { x: 273, y: 58 }, label: "TRIESTE · 145",
    path: "M 269 31 L 277 58 L 261 84 L 273 94 L 290 78 L 305 68 L 305 31 Z"
  },
  {
    id: "emilia-romagna", name: "Emilia-Romagna",
    dot: { x: 193, y: 136 }, label: "BOLOGNA · 289",
    path: "M 143 136 L 151 89 L 160 78 L 181 68 L 193 99 L 219 110 L 235 105 L 248 94 L 248 131 L 240 152 L 219 172 L 193 183 L 168 183 L 143 167 Z"
  },
  {
    id: "toscana", name: "Toscana",
    dot: { x: 189, y: 188 }, label: "FIRENZE · 312",
    path: "M 143 136 L 143 167 L 168 183 L 193 183 L 219 172 L 240 152 L 248 131 L 235 172 L 227 193 L 219 235 L 202 246 L 185 246 L 164 235 L 143 225 L 135 204 L 135 167 Z"
  },
  {
    id: "marche", name: "Marche",
    dot: { x: 269, y: 196 }, label: "ANCONA · 89",
    path: "M 240 152 L 248 131 L 248 94 L 269 120 L 290 172 L 294 193 L 286 214 L 269 225 L 252 220 L 240 204 L 227 193 L 235 172 Z"
  },
  {
    id: "umbria", name: "Umbria",
    dot: { x: 244, y: 220 }, label: "PERUGIA · 89",
    path: "M 227 193 L 240 204 L 252 220 L 269 225 L 286 214 L 273 246 L 261 267 L 244 272 L 227 261 L 219 235 Z"
  },
  {
    id: "lazio", name: "Lazio",
    dot: { x: 252, y: 272 }, label: "ROMA · 1.240",
    path: "M 227 261 L 244 272 L 261 267 L 273 246 L 286 214 L 294 193 L 303 225 L 303 267 L 294 293 L 269 308 L 248 314 L 227 303 L 210 287 L 202 267 L 219 235 Z"
  },
  {
    id: "abruzzo", name: "Abruzzo",
    dot: { x: 303, y: 256 }, label: "L'AQUILA · 78",
    path: "M 286 214 L 294 193 L 303 225 L 311 246 L 319 256 L 311 277 L 294 293 L 286 214 Z"
  },
  {
    id: "molise", name: "Molise",
    dot: { x: 336, y: 290 }, label: "CAMPOBASSO · 18",
    path: "M 303 267 L 311 277 L 319 256 L 345 272 L 353 287 L 345 303 L 328 314 L 311 303 L 294 293 Z"
  },
  {
    id: "campania", name: "Campania",
    dot: { x: 345, y: 329 }, label: "NAPOLI · 445",
    path: "M 294 293 L 303 267 L 328 314 L 345 303 L 353 287 L 378 319 L 387 350 L 370 371 L 353 371 L 336 366 L 319 361 L 303 340 L 294 319 Z"
  },
  {
    id: "basilicata", name: "Basilicata",
    dot: { x: 391, y: 345 }, label: "MATERA · 56",
    path: "M 378 319 L 387 350 L 370 371 L 382 381 L 403 376 L 420 366 L 429 350 L 420 329 L 395 319 Z"
  },
  {
    id: "puglia", name: "Puglia",
    dot: { x: 412, y: 314 }, label: "BARI · 198",
    path: "M 353 287 L 378 319 L 395 319 L 420 329 L 429 350 L 445 355 L 471 371 L 487 355 L 500 340 L 487 308 L 471 277 L 445 277 L 429 287 L 412 277 L 395 277 L 378 287 Z"
  },
  {
    id: "calabria", name: "Calabria",
    dot: { x: 412, y: 434 }, label: "REG. CALABRIA · 89",
    path: "M 370 371 L 353 371 L 357 392 L 370 413 L 382 434 L 378 465 L 391 481 L 403 481 L 416 470 L 420 444 L 412 423 L 403 376 L 382 381 Z"
  },
  {
    id: "sicilia", name: "Sicilia",
    dot: { x: 311, y: 517 }, label: "PALERMO · 567",
    path: "M 244 496 L 252 517 L 269 538 L 294 549 L 332 549 L 361 528 L 378 507 L 378 465 L 357 481 L 336 486 L 303 486 L 277 486 L 252 476 Z"
  },
  {
    id: "sardegna", name: "Sardegna",
    dot: { x: 105, y: 366 }, label: "CAGLIARI · 123",
    path: "M 67 308 L 59 329 L 63 361 L 67 392 L 84 423 L 101 429 L 126 418 L 135 392 L 135 366 L 122 329 L 101 308 L 84 298 Z"
  },
];

const HIGHLIGHTED = ["lazio", "lombardia", "sicilia", "campania", "veneto"];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ItalyMapTeaser() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = REGIONS.find(r => r.id === hoveredId);

  return (
    <section style={{
      background: "#FFFFFF",
      borderTop: "1px solid #DDDBD4",
      borderBottom: "1px solid #DDDBD4",
      padding: "80px 5%",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .vt-section * { box-sizing: border-box; margin: 0; padding: 0; }
        .vt-section { font-family: 'Inter', sans-serif; color: #1A1916; }

        .vt-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 80px;
          align-items: center;
        }

        .vt-text { width: 50%; flex-shrink: 0; }
        .vt-map  { width: 50%; flex-shrink: 0; position: relative; }

        .vt-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8A8880;
          display: block;
          margin-bottom: 12px;
        }

        .vt-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 400;
          color: #1A1916;
          line-height: 1.2;
          max-width: 440px;
        }

        .vt-rule {
          width: 40px; height: 2px;
          background: #1A1916;
          margin: 24px 0;
        }

        .vt-body {
          font-size: 16px;
          color: #8A8880;
          line-height: 1.85;
          max-width: 420px;
        }

        .vt-stats {
          display: flex;
          gap: 32px;
          align-items: center;
          border-top: 1px solid #DDDBD4;
          padding-top: 28px;
          margin-top: 36px;
        }
        .vt-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 700;
          color: #1A1916;
          line-height: 1;
        }
        .vt-stat-lbl {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8A8880;
          margin-top: 5px;
        }
        .vt-divider {
          width: 1px; height: 40px;
          background: #DDDBD4;
          flex-shrink: 0;
        }

        .vt-hover-box {
          background: #1A1916;
          padding: 16px 20px;
          margin-top: 24px;
          opacity: 0;
          transition: opacity 0.2s ease;
          min-height: 68px;
        }
        .vt-hover-box.active { opacity: 1; }
        .vt-hover-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 400;
          color: #FFFFFF;
        }
        .vt-hover-sub {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-top: 6px;
        }

        .vt-cta {
          display: inline-block;
          margin-top: 32px;
          background: #1A1916;
          color: #FFFFFF;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 16px 32px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .vt-cta:hover { background: #3D3C38; }

        .vt-cta-note {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-style: italic;
          font-weight: 300;
          color: #8A8880;
          margin-top: 12px;
        }

        .vt-badge {
          position: absolute;
          top: 0; right: 0;
          background: #1A1916;
          padding: 10px 14px;
          z-index: 10;
          text-align: center;
        }
        .vt-badge-top {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .vt-badge-date {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
          margin-top: 3px;
        }

        .vt-region {
          fill: #E4E2DC;
          stroke: #FFFFFF;
          stroke-width: 1.5;
          transition: fill 0.2s ease;
          cursor: default;
        }
        .vt-region.hl  { fill: #D0CEC8; }
        .vt-region:hover { fill: #B8B6B0; }

        .vt-caption {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8A8880;
          text-align: center;
          margin-top: 12px;
        }

        @media (max-width: 900px) {
          .vt-inner { flex-direction: column-reverse !important; gap: 40px; }
          .vt-text, .vt-map { width: 100%; }
          .vt-stats { flex-wrap: wrap; gap: 16px; }
          .vt-divider { display: none; }
        }
      `}</style>

      <div className="vt-section">
        <div className="vt-inner">

          {/* ── LEFT: TEXT ── */}
          <div className="vt-text">
            <span className="vt-label">Archivio per territorio</span>
            <h2 className="vt-h2">
              Ogni traccia ha un luogo. Esplora l'archivio regione per regione.
            </h2>
            <div className="vt-rule" />
            <p className="vt-body">
              L'archivio di VentennioOggi è organizzato geograficamente.
              Seleziona una regione, scegli il comune e sfoglia le fotografie
              per categoria tematica.
            </p>

            {/* Stats */}
            <div className="vt-stats">
              {[
                { n: "20",     l: "Regioni" },
                { n: "187",    l: "Comuni" },
                { n: "12.006", l: "Fotografie" },
              ].map((s, i) => (
                <>
                  {i > 0 && <div className="vt-divider" key={`d${i}`} />}
                  <div key={s.l}>
                    <div className="vt-stat-num">{s.n}</div>
                    <div className="vt-stat-lbl">{s.l}</div>
                  </div>
                </>
              ))}
            </div>

            {/* Hover info */}
            <div className={`vt-hover-box${hoveredId ? " active" : ""}`}>
              {hovered && (
                <>
                  <div className="vt-hover-name">{hovered.name}</div>
                  <div className="vt-hover-sub">
                    {hovered.label.split("·")[1]?.trim()} fotografie catalogate
                  </div>
                </>
              )}
            </div>

            {/* CTA */}
            <a href="/archivio" className="vt-cta">
              Esplora l'archivio per regione →
            </a>
            <p className="vt-cta-note">
              Naviga tra 20 regioni e 187 comuni documentati
            </p>
          </div>

          {/* ── RIGHT: MAP ── */}
          <div className="vt-map">

            {/* Badge */}
            <div className="vt-badge">
              <div className="vt-badge-top">Aggiornato</div>
              <div className="vt-badge-date">19.08.2025</div>
            </div>

            {/* SVG Map — viewBox matches the projection output */}
            <svg
              viewBox="0 0 500 570"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "auto", display: "block" }}
              aria-label="Mappa dell'Italia con regioni"
            >
              {REGIONS.map(r => (
                <g key={r.id}>
                  <path
                    d={r.path}
                    className={`vt-region${HIGHLIGHTED.includes(r.id) ? " hl" : ""}`}
                    onMouseEnter={() => setHoveredId(r.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-label={r.name}
                  />
                  {HIGHLIGHTED.includes(r.id) && (
                    <>
                      <circle
                        cx={r.dot.x} cy={r.dot.y} r={4}
                        fill="#1A1916"
                        style={{ pointerEvents: "none" }}
                      />
                      <text
                        x={r.dot.x + 8} y={r.dot.y + 4}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 9,
                          fontWeight: 500,
                          fill: "#1A1916",
                          letterSpacing: "0.06em",
                          pointerEvents: "none",
                        }}
                      >
                        {r.label}
                      </text>
                    </>
                  )}
                </g>
              ))}
            </svg>

            <p className="vt-caption">
              Passa il cursore sulle regioni · Clicca il bottone per esplorare
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
