import { useState } from "react";

// SVG paths for all 20 Italian regions (simplified but geographically accurate)
const regions = [
  { id: "valle-daosta", name: "Valle d'Aosta", d: "M95,115 L105,108 L115,112 L118,120 L110,128 L98,125Z" },
  { id: "piemonte", name: "Piemonte", d: "M80,130 L98,125 L110,128 L118,120 L130,118 L140,125 L145,140 L150,160 L142,175 L130,185 L115,188 L100,180 L85,170 L75,155 L78,140Z" },
  { id: "lombardia", name: "Lombardia", d: "M140,125 L155,110 L170,105 L185,108 L200,112 L210,120 L215,130 L210,145 L200,155 L190,160 L175,158 L160,162 L150,160 L145,140Z", highlight: true, cx: 178, cy: 135, label: "MILANO · 890" },
  { id: "trentino", name: "Trentino-Alto Adige", d: "M200,70 L215,65 L230,68 L240,78 L235,90 L225,98 L215,100 L205,95 L200,85Z" },
  { id: "veneto", name: "Veneto", d: "M215,100 L225,98 L235,90 L245,92 L255,100 L260,115 L255,130 L245,138 L230,142 L220,140 L215,130 L210,120Z", highlight: true, cx: 238, cy: 118, label: "VENEZIA · 267" },
  { id: "friuli", name: "Friuli Venezia Giulia", d: "M255,100 L265,92 L280,90 L290,95 L288,108 L280,118 L268,120 L260,115Z" },
  { id: "liguria", name: "Liguria", d: "M85,170 L100,180 L115,188 L130,185 L148,188 L160,195 L150,200 L135,198 L115,200 L100,195 L88,185Z" },
  { id: "emilia", name: "Emilia-Romagna", d: "M150,160 L160,162 L175,158 L190,160 L200,155 L210,145 L215,130 L220,140 L230,142 L240,148 L245,160 L240,172 L225,178 L205,182 L185,185 L165,188 L148,188 L130,185 L142,175Z" },
  { id: "toscana", name: "Toscana", d: "M148,188 L165,188 L185,185 L205,182 L210,195 L215,210 L210,228 L200,240 L188,248 L175,245 L168,238 L160,225 L155,210 L150,200Z" },
  { id: "umbria", name: "Umbria", d: "M210,228 L215,210 L225,205 L235,210 L240,222 L238,235 L228,242 L218,240Z" },
  { id: "marche", name: "Marche", d: "M225,178 L240,172 L245,160 L255,165 L260,178 L258,195 L250,208 L240,215 L235,210 L225,205 L215,210 L205,182Z" },
  { id: "lazio", name: "Lazio", d: "M188,248 L200,240 L210,228 L218,240 L228,242 L238,235 L240,250 L235,268 L225,280 L215,285 L200,282 L190,275 L182,262Z", highlight: true, cx: 215, cy: 260, label: "ROMA · 1.240" },
  { id: "abruzzo", name: "Abruzzo", d: "M240,222 L250,208 L258,195 L268,200 L275,212 L272,228 L262,238 L250,240 L242,235Z" },
  { id: "molise", name: "Molise", d: "M262,238 L272,228 L280,232 L285,242 L280,252 L270,255 L262,250Z" },
  { id: "campania", name: "Campania", d: "M235,268 L240,250 L250,240 L262,250 L270,255 L280,252 L282,265 L278,280 L268,290 L255,295 L245,292 L238,282Z", highlight: true, cx: 260, cy: 272, label: "NAPOLI · 445" },
  { id: "puglia", name: "Puglia", d: "M280,232 L290,225 L302,228 L315,238 L325,250 L332,265 L335,280 L330,295 L320,302 L308,298 L295,290 L285,282 L278,280 L282,265 L280,252 L285,242Z" },
  { id: "basilicata", name: "Basilicata", d: "M268,290 L278,280 L285,282 L295,290 L298,302 L290,310 L278,308 L270,300Z" },
  { id: "calabria", name: "Calabria", d: "M270,300 L278,308 L290,310 L298,302 L305,310 L308,325 L305,342 L298,358 L288,368 L278,365 L272,350 L268,335 L265,320 L268,308Z" },
  { id: "sicilia", name: "Sicilia", d: "M218,375 L235,368 L255,365 L270,368 L285,372 L295,380 L290,390 L275,398 L258,402 L240,400 L225,395 L215,388 L212,380Z", highlight: true, cx: 255, cy: 385, label: "PALERMO · 567" },
  { id: "sardegna", name: "Sardegna", d: "M120,260 L135,252 L148,255 L155,268 L158,285 L155,305 L150,322 L142,335 L130,340 L118,335 L112,320 L110,300 L112,280 L115,268Z" },
];

const MapTeaser = () => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <section
      style={{
        width: "100%",
        background: "#FFFFFF",
        borderTop: "1px solid #DDDBD4",
        borderBottom: "1px solid #DDDBD4",
        padding: "80px 5%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "80px",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
          flexWrap: "wrap",
        }}
        className="map-teaser-inner"
      >
        {/* LEFT COLUMN */}
        <div style={{ flex: "1 1 440px", minWidth: "300px" }} className="map-teaser-text">
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "#8A8880",
            }}
          >
            ARCHIVIO PER TERRITORIO
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontSize: "38px",
              color: "#1A1916",
              marginTop: "10px",
              lineHeight: 1.2,
              maxWidth: "440px",
            }}
          >
            Ogni traccia ha un luogo. Esplora l'archivio regione per regione.
          </h2>

          <div
            style={{
              width: "40px",
              height: "2px",
              background: "#1A1916",
              margin: "24px 0",
            }}
          />

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              color: "#8A8880",
              lineHeight: 1.85,
              maxWidth: "420px",
              margin: 0,
            }}
          >
            L'archivio di VentennioOggi è organizzato geograficamente. Seleziona una regione,
            scegli il comune e sfoglia le fotografie per categoria tematica.
          </p>

          {/* STATS ROW */}
          <div
            style={{
              marginTop: "36px",
              display: "flex",
              gap: "32px",
              borderTop: "1px solid #DDDBD4",
              paddingTop: "28px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
            className="map-teaser-stats"
          >
            <StatItem number="20" label="REGIONI" />
            <div style={{ width: "1px", height: "40px", background: "#DDDBD4", alignSelf: "center" }} className="stat-divider" />
            <StatItem number="187" label="COMUNI" />
            <div style={{ width: "1px", height: "40px", background: "#DDDBD4", alignSelf: "center" }} className="stat-divider" />
            <StatItem number="12.006" label="FOTOGRAFIE" />
          </div>

          {/* CTA */}
          <a
            href="/archivio"
            style={{
              display: "inline-block",
              marginTop: "40px",
              background: "#1A1916",
              color: "#FFFFFF",
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 400,
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              padding: "16px 32px",
              borderRadius: 0,
              border: "none",
              textDecoration: "none",
              transition: "background 0.2s ease",
              cursor: "pointer",
            }}
            className="map-teaser-cta"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#3D3C38")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1A1916")}
          >
            ESPLORA L'ARCHIVIO PER REGIONE →
          </a>

          <p
            style={{
              marginTop: "14px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "12px",
              color: "#8A8880",
            }}
          >
            Naviga tra 20 regioni e 187 comuni documentati
          </p>
        </div>

        {/* RIGHT COLUMN — MAP */}
        <div
          style={{
            flex: "1 1 440px",
            minWidth: "300px",
            position: "relative",
          }}
          className="map-teaser-map"
        >
          {/* OVERLAY BADGE */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "#1A1916",
              padding: "10px 14px",
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#FFFFFF",
                display: "block",
              }}
            >
              AGGIORNATO
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "#FFFFFF",
                marginTop: "2px",
                display: "block",
              }}
            >
              19.08.2025
            </span>
          </div>

          <svg
            viewBox="60 50 290 370"
            style={{ width: "100%", height: "auto", cursor: "default" }}
          >
            {regions.map((region) => (
              <path
                key={region.id}
                d={region.d}
                fill={hoveredRegion === region.id ? "#1A1916" : "#E4E2DC"}
                stroke="#FFFFFF"
                strokeWidth={1.5}
                style={{ transition: "fill 0.2s ease", cursor: "default" }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
            ))}

            {/* Highlight dots and labels */}
            {regions
              .filter((r) => r.highlight)
              .map((region) => (
                <g key={`label-${region.id}`}>
                  <circle cx={region.cx} cy={region.cy} r={4} fill="#1A1916" />
                  <text
                    x={(region.cx ?? 0) + 8}
                    y={(region.cy ?? 0) + 3}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      fill: "#1A1916",
                    }}
                  >
                    {region.label}
                  </text>
                </g>
              ))}
          </svg>

          {/* CAPTION */}
          <p
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#8A8880",
            }}
          >
            PASSA IL CURSORE SULLE REGIONI · CLICCA IL BOTTONE PER ESPLORARE
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .map-teaser-inner { gap: 40px !important; }
        }
        @media (max-width: 767px) {
          .map-teaser-inner {
            flex-direction: column-reverse !important;
            gap: 40px !important;
          }
          .map-teaser-map {
            max-height: 320px;
            overflow: hidden;
          }
          .map-teaser-stats {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 20px !important;
          }
          .map-teaser-stats .stat-divider {
            display: none !important;
          }
          .map-teaser-cta {
            display: block !important;
            text-align: center;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div>
    <span
      style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
        fontSize: "30px",
        color: "#1A1916",
        display: "block",
      }}
    >
      {number}
    </span>
    <span
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "9px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "#8A8880",
        marginTop: "4px",
        display: "block",
      }}
    >
      {label}
    </span>
  </div>
);

export default MapTeaser;
