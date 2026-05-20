import { Hono } from 'hono';
import { html } from 'hono/html';

export const dashboard = new Hono();

dashboard.get('/', async (c) => {
  return c.html(
    html`<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>🛡️ SentinelMod</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', sans-serif;
              background: #0d1117;
              color: #ffffff;
              min-height: 100vh;
              padding: 24px;
            }

            /* HEADER */
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 32px;
              padding-bottom: 20px;
              border-bottom: 1px solid #21262d;
            }
            .header-left {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .logo {
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #ff4500, #ff6534);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
            }
            .header h1 {
              font-size: 24px;
              font-weight: 800;
            }
            .header p {
              color: #8b949e;
              font-size: 13px;
              margin-top: 2px;
            }
            .live-badge {
              display: flex;
              align-items: center;
              gap: 6px;
              background: #1a2f1a;
              border: 1px solid #2ea04326;
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 12px;
              color: #3fb950;
              font-weight: 600;
            }
            .live-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #3fb950;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.4;
              }
            }

            /* STATS GRID */
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-bottom: 28px;
            }
            .stat-card {
              background: #161b22;
              border: 1px solid #21262d;
              border-radius: 16px;
              padding: 20px;
              transition: transform 0.2s;
            }
            .stat-card:hover {
              transform: translateY(-2px);
            }
            .stat-label {
              font-size: 12px;
              color: #8b949e;
              text-transform: uppercase;
              letter-spacing: 0.8px;
            }
            .stat-value {
              font-size: 32px;
              font-weight: 800;
              margin-top: 8px;
            }
            .stat-sub {
              font-size: 12px;
              color: #8b949e;
              margin-top: 4px;
            }
            .green {
              color: #3fb950;
            }
            .yellow {
              color: #d29922;
            }
            .red {
              color: #f85149;
            }
            .blue {
              color: #58a6ff;
            }

            /* SECTION */
            .section {
              margin-bottom: 28px;
            }
            .section-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 16px;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
            }
            .section-sub {
              font-size: 12px;
              color: #8b949e;
            }

            /* ALERT */
            .alert {
              background: #1a1a0e;
              border: 1px solid #d2992244;
              border-left: 4px solid #d29922;
              border-radius: 12px;
              padding: 14px 18px;
              margin-bottom: 10px;
              display: flex;
              gap: 12px;
              align-items: center;
            }
            .alert.danger {
              background: #1a0e0e;
              border-color: #f8514944;
              border-left-color: #f85149;
            }
            .alert.success {
              background: #0e1a0e;
              border-color: #3fb95044;
              border-left-color: #3fb950;
            }
            .alert-icon {
              font-size: 20px;
              flex-shrink: 0;
            }
            .alert-content {
            }
            .alert-title {
              font-size: 13px;
              font-weight: 600;
            }
            .alert-desc {
              font-size: 12px;
              color: #8b949e;
              margin-top: 2px;
            }

            /* MOD CARDS */
            .mod-card {
              background: #161b22;
              border: 1px solid #21262d;
              border-radius: 16px;
              padding: 20px;
              margin-bottom: 12px;
              transition: all 0.2s;
            }
            .mod-card:hover {
              border-color: #388bfd44;
              transform: translateX(4px);
            }
            .mod-top {
              display: flex;
              align-items: center;
              gap: 14px;
              margin-bottom: 14px;
            }
            .mod-avatar {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: linear-gradient(135deg, #ff4500, #ff6534);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              font-weight: 800;
              flex-shrink: 0;
            }
            .mod-avatar.blue-grad {
              background: linear-gradient(135deg, #1f6feb, #388bfd);
            }
            .mod-avatar.green-grad {
              background: linear-gradient(135deg, #238636, #3fb950);
            }
            .mod-info {
              flex: 1;
            }
            .mod-name {
              font-size: 15px;
              font-weight: 700;
            }
            .mod-meta {
              font-size: 12px;
              color: #8b949e;
              margin-top: 2px;
            }
            .mod-badge {
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              flex-shrink: 0;
            }
            .badge-safe {
              background: #1a2f1a;
              color: #3fb950;
              border: 1px solid #3fb95033;
            }
            .badge-warn {
              background: #2d2200;
              color: #d29922;
              border: 1px solid #d2992233;
            }
            .badge-danger {
              background: #2d0f0f;
              color: #f85149;
              border: 1px solid #f8514933;
            }

            /* HEALTH BAR */
            .health-row {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .health-label {
              font-size: 12px;
              color: #8b949e;
              width: 60px;
              flex-shrink: 0;
            }
            .health-bar-bg {
              flex: 1;
              height: 8px;
              background: #21262d;
              border-radius: 4px;
              overflow: hidden;
            }
            .health-bar-fill {
              height: 100%;
              border-radius: 4px;
              transition: width 1s ease;
            }
            .fill-green {
              background: linear-gradient(90deg, #238636, #3fb950);
            }
            .fill-yellow {
              background: linear-gradient(90deg, #9e6a03, #d29922);
            }
            .fill-red {
              background: linear-gradient(90deg, #b91c1c, #f85149);
            }
            .health-pct {
              font-size: 13px;
              font-weight: 700;
              width: 36px;
              text-align: right;
              flex-shrink: 0;
            }

            /* STATS ROW */
            .mod-stats-row {
              display: flex;
              gap: 16px;
              margin-top: 12px;
            }
            .mod-stat {
              background: #0d1117;
              border-radius: 8px;
              padding: 8px 14px;
              flex: 1;
              text-align: center;
            }
            .mod-stat-val {
              font-size: 18px;
              font-weight: 800;
            }
            .mod-stat-lbl {
              font-size: 10px;
              color: #8b949e;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            /* FOOTER */
            .footer {
              text-align: center;
              color: #8b949e;
              font-size: 12px;
              margin-top: 32px;
              padding-top: 20px;
              border-top: 1px solid #21262d;
            }
          </style>
        </head>
        <body>
          <!-- HEADER -->
          <div class="header">
            <div class="header-left">
              <div class="logo">🛡️</div>
              <div>
                <h1>SentinelMod</h1>
                <p>Panel de salud del equipo moderador</p>
              </div>
            </div>
            <div class="live-badge">
              <div class="live-dot"></div>
              Monitoreo activo
            </div>
          </div>

          <!-- STATS GENERALES -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Mods activos</div>
              <div class="stat-value green">3</div>
              <div class="stat-sub">En línea esta semana</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">En vigilancia</div>
              <div class="stat-value yellow">1</div>
              <div class="stat-sub">Señales de estrés</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Burnout crítico</div>
              <div class="stat-value red">0</div>
              <div class="stat-sub">Sin casos críticos</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Acciones totales</div>
              <div class="stat-value blue">247</div>
              <div class="stat-sub">Últimos 7 días</div>
            </div>
          </div>

          <!-- ALERTAS -->
          <div class="section">
            <div class="section-header">
              <div class="section-title">⚠️ Alertas del equipo</div>
              <div class="section-sub">Última actualización: hace 2 min</div>
            </div>

            <div class="alert">
              <div class="alert-icon">🌙</div>
              <div class="alert-content">
                <div class="alert-title">
                  u/Square-Efficiency356 moderando de madrugada
                </div>
                <div class="alert-desc">
                  Actividad detectada entre 23:00 - 04:00 por 3 noches seguidas.
                  Considera descansar.
                </div>
              </div>
            </div>

            <div class="alert success">
              <div class="alert-icon">✅</div>
              <div class="alert-content">
                <div class="alert-title">Equipo en buen estado general</div>
                <div class="alert-desc">
                  No hay casos críticos de burnout esta semana.
                </div>
              </div>
            </div>
          </div>

          <!-- MOD CARDS -->
          <div class="section">
            <div class="section-header">
              <div class="section-title">👥 Estado del equipo</div>
            </div>

            <!-- Mod 1 -->
            <div class="mod-card">
              <div class="mod-top">
                <div class="mod-avatar">S</div>
                <div class="mod-info">
                  <div class="mod-name">u/Square-Efficiency356</div>
                  <div class="mod-meta">
                    Moderador principal · Activo hace 2 horas
                  </div>
                </div>
                <div class="mod-badge badge-warn">⚠️ Vigilar</div>
              </div>
              <div class="health-row">
                <div class="health-label">Salud</div>
                <div class="health-bar-bg">
                  <div
                    class="health-bar-fill fill-yellow"
                    style="width:65%"
                  ></div>
                </div>
                <div class="health-pct yellow">65%</div>
              </div>
              <div class="mod-stats-row">
                <div class="mod-stat">
                  <div class="mod-stat-val blue">87</div>
                  <div class="mod-stat-lbl">Acciones</div>
                </div>
                <div class="mod-stat">
                  <div class="mod-stat-val yellow">3</div>
                  <div class="mod-stat-lbl">Noches tardías</div>
                </div>
                <div class="mod-stat">
                  <div class="mod-stat-val green">2h</div>
                  <div class="mod-stat-lbl">Último activo</div>
                </div>
              </div>
            </div>

            <!-- Mod 2 -->
            <div class="mod-card">
              <div class="mod-top">
                <div class="mod-avatar blue-grad">D</div>
                <div class="mod-info">
                  <div class="mod-name">u/devvit-dev-bot</div>
                  <div class="mod-meta">Moderador · Activo hace 1 día</div>
                </div>
                <div class="mod-badge badge-safe">✅ Saludable</div>
              </div>
              <div class="health-row">
                <div class="health-label">Salud</div>
                <div class="health-bar-bg">
                  <div
                    class="health-bar-fill fill-green"
                    style="width:95%"
                  ></div>
                </div>
                <div class="health-pct green">95%</div>
              </div>
              <div class="mod-stats-row">
                <div class="mod-stat">
                  <div class="mod-stat-val blue">42</div>
                  <div class="mod-stat-lbl">Acciones</div>
                </div>
                <div class="mod-stat">
                  <div class="mod-stat-val green">0</div>
                  <div class="mod-stat-lbl">Noches tardías</div>
                </div>
                <div class="mod-stat">
                  <div class="mod-stat-val green">1d</div>
                  <div class="mod-stat-lbl">Último activo</div>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            🛡️ SentinelMod · Protegiendo a quienes protegen Reddit
          </div>

          <script>
            // Animación de barras al cargar
            window.onload = () => {
              document.querySelectorAll('.health-bar-fill').forEach((bar) => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                  bar.style.width = width;
                }, 100);
              });
            };
          </script>
        </body>
      </html>`
  );
});
