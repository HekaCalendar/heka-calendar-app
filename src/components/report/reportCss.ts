/**
 * Natal Report Viewer CSS — LUXURY EDITION
 * Injected imperatively via useEffect
 */

export const REPORT_CSS = `
/* ═══════════════════════════════════════════════════════════════════════════ */
/* NATAL REPORT VIEWER — LUXURY EDITION                                       */
/* ═══════════════════════════════════════════════════════════════════════════ */

.natal-report {
  min-height: 100vh;
  background: #060607;
  color: #f0eeea;
  font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  position: relative;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Progress Bar ─────────────────────────────────────────────────────────── */
.report-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 200;
  background: rgba(212,175,55,0.08);
}
.report-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #f4d03f, #d4af37);
  transition: width 0.1s linear;
}

/* ── Header ───────────────────────────────────────────────────────────────── */
.report-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  padding-top: calc(10px + env(safe-area-inset-top, 0px));
  background: linear-gradient(180deg, rgba(6,6,7,0.98) 0%, rgba(6,6,7,0.85) 100%);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border-bottom: 1px solid rgba(212,175,55,0.06);
}

.report-back {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #8a8a8e;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.25s ease;
  font-family: 'Space Grotesk', sans-serif;
}
.report-back:hover {
  color: #d4af37;
  background: rgba(212,175,55,0.06);
}

.report-header-center {
  display: flex;
  align-items: center;
  gap: 10px;
}
.report-header-pro {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #d4af37;
  text-transform: uppercase;
}
.report-header-divider {
  color: rgba(212,175,55,0.3);
  font-size: 11px;
}
.report-header-title {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(240,238,234,0.7);
  letter-spacing: 0.05em;
}
.report-header-meta {
  font-size: 11px;
  color: #5a5a5e;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
}

/* ── TOC Toggle ───────────────────────────────────────────────────────────── */
.report-toc-toggle {
  position: fixed;
  right: 20px;
  top: calc(60px + env(safe-area-inset-top, 0px));
  z-index: 90;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(212,175,55,0.08);
  border: 1px solid rgba(212,175,55,0.15);
  color: #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}
.report-toc-toggle:hover {
  background: rgba(212,175,55,0.15);
  transform: scale(1.08);
  box-shadow: 0 0 20px rgba(212,175,55,0.1);
}

/* ── TOC Panel ────────────────────────────────────────────────────────────── */
.report-toc-panel {
  position: fixed;
  right: 20px;
  top: calc(112px + env(safe-area-inset-top, 0px));
  z-index: 90;
  width: 280px;
  max-height: 60vh;
  overflow-y: auto;
  background: rgba(12,12,14,0.96);
  border: 1px solid rgba(212,175,55,0.12);
  border-radius: 16px;
  padding: 18px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.04);
}
.report-toc-title {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  color: #d4af37;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(212,175,55,0.1);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.report-toc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: #8a8a8e;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.4;
  font-family: 'Space Grotesk', sans-serif;
}
.report-toc-item:hover {
  background: rgba(212,175,55,0.06);
  color: #f0eeea;
}
.report-toc-item.is-active {
  background: rgba(212,175,55,0.1);
  color: #d4af37;
  font-weight: 500;
}
.report-toc-icon {
  font-size: 14px;
  opacity: 0.7;
  width: 20px;
  text-align: center;
}

/* ── Loading ──────────────────────────────────────────────────────────────── */
.report-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 40px;
  background: radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 60%);
}
.report-loading-spinner {
  width: 48px;
  height: 48px;
  border: 1.5px solid rgba(212,175,55,0.08);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: report-spin 1.2s linear infinite;
  margin-bottom: 28px;
}
@keyframes report-spin {
  to { transform: rotate(360deg); }
}
.report-loading-text {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  color: #d4af37;
  margin-bottom: 10px;
  letter-spacing: 0.03em;
}
.report-loading-sub {
  font-size: 13px;
  color: #5a5a5e;
  max-width: 360px;
  line-height: 1.6;
}

/* ── Error ────────────────────────────────────────────────────────────────── */
.report-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 40px;
}
.report-error-title {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  color: #d4af37;
  margin-bottom: 10px;
}
.report-error-message {
  font-size: 14px;
  color: #8a8a8e;
  margin-bottom: 28px;
  max-width: 400px;
  line-height: 1.6;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* COVER PAGE                                                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

.report-cover {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  overflow-y: auto;
  background: #060607;
}

.report-cover-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(147,80,255,0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.015) 0%, transparent 70%);
}

.report-cover-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 60px 28px 80px;
  max-width: 540px;
  width: 100%;
  animation: report-cover-fade-in 1.2s ease-out;
}
@keyframes report-cover-fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.report-cover-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}
.report-cover-pro {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #d4af37;
  text-transform: uppercase;
}
.report-cover-confidential {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: rgba(212,175,55,0.4);
  text-transform: uppercase;
  border: 1px solid rgba(212,175,55,0.15);
  padding: 3px 10px;
  border-radius: 4px;
}

.report-cover-divider-top {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
  margin: 0 auto 36px;
}

.report-cover-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(32px, 7vw, 52px);
  font-weight: 400;
  color: #f0eeea;
  margin: 0 0 10px;
  line-height: 1.15;
  letter-spacing: 0.02em;
  text-wrap: balance;
}

.report-cover-subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(16px, 3vw, 20px);
  font-style: italic;
  color: rgba(212,175,55,0.6);
  margin-bottom: 32px;
  letter-spacing: 0.04em;
}

.report-cover-divider-mid {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent);
  margin: 0 auto 32px;
}

.report-cover-for {
  margin-bottom: 32px;
}
.report-cover-for-label {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #5a5a5e;
  margin-bottom: 8px;
  font-family: 'JetBrains Mono', monospace;
}
.report-cover-for-name {
  font-family: 'Cinzel', serif;
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 600;
  color: #f0eeea;
  letter-spacing: 0.03em;
}

.report-cover-data {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
  padding: 20px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 12px;
}
.report-cover-data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.report-cover-data-label {
  font-size: 11px;
  color: #5a5a5e;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
}
.report-cover-data-value {
  font-size: 13px;
  color: rgba(240,238,234,0.8);
  font-weight: 500;
}

.report-cover-big-three {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  margin-bottom: 28px;
}
.report-cover-bt-item {
  flex: 1;
  padding: 16px 12px;
}
.report-cover-bt-divider {
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(212,175,55,0.2), transparent);
  align-self: stretch;
  margin: 8px 0;
}
.report-cover-bt-label {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #5a5a5e;
  margin-bottom: 6px;
  font-family: 'JetBrains Mono', monospace;
}
.report-cover-bt-value {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  font-weight: 600;
  color: #f0eeea;
  margin-bottom: 4px;
}
.report-cover-bt-sidereal {
  font-size: 11px;
  color: rgba(212,175,55,0.5);
  font-family: 'JetBrains Mono', monospace;
}

.report-cover-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 11px;
  color: #5a5a5e;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 32px;
}

.report-cover-divider-bottom {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent);
  margin: 0 auto 32px;
}

.report-cover-enter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 36px;
  border-radius: 100px;
  background: linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.06));
  border: 1px solid rgba(212,175,55,0.25);
  color: #d4af37;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.4s ease;
  text-transform: uppercase;
}
.report-cover-enter:hover {
  background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1));
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(212,175,55,0.12);
}
.report-cover-enter svg {
  animation: report-bounce 2s ease-in-out infinite;
}
@keyframes report-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* REPORT CONTENT                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

.report-scroll {
  max-width: 760px;
  margin: 0 auto;
  padding: 100px 28px 80px;
}

/* ── Section Cards ────────────────────────────────────────────────────────── */
.report-section {
  position: relative;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(24px);
  animation: report-section-reveal 0.8s ease forwards;
}
@keyframes report-section-reveal {
  to { opacity: 1; transform: translateY(0); }
}

.report-section-accent {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: linear-gradient(180deg, rgba(212,175,55,0.5), rgba(212,175,55,0.1), rgba(212,175,55,0.5));
  border-radius: 2px;
}

.report-section-inner {
  padding-left: 28px;
}

.report-section--dual-nature .report-section-accent {
  background: linear-gradient(180deg, rgba(212,175,55,0.5), rgba(147,80,255,0.2), rgba(212,175,55,0.5));
}

.report-section-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.report-section-icon {
  font-size: 22px;
  line-height: 1;
  margin-top: 2px;
  opacity: 0.7;
}

.report-section-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(20px, 4vw, 26px);
  font-weight: 500;
  color: #f0eeea;
  margin: 0 0 6px;
  line-height: 1.25;
  letter-spacing: 0.01em;
}

.report-section-subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  font-style: italic;
  color: rgba(212,175,55,0.5);
  letter-spacing: 0.02em;
}

.report-section-body {
  line-height: 1.85;
  color: #b8b5b0;
  font-size: 15px;
}

.report-section-h3 {
  font-family: 'Cinzel', serif;
  font-size: 17px;
  font-weight: 500;
  color: #d4af37;
  margin: 28px 0 12px;
  line-height: 1.4;
  letter-spacing: 0.02em;
}

.report-section-h4 {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(212,175,55,0.7);
  margin: 22px 0 10px;
  letter-spacing: 0.03em;
}

.report-section-p {
  margin: 0 0 16px;
  text-wrap: pretty;
}
.report-section-p:last-child {
  margin-bottom: 0;
}

.report-section-p--bullet {
  padding-left: 18px;
  position: relative;
}
.report-section-p--bullet::before {
  content: '◆';
  position: absolute;
  left: 0;
  top: 7px;
  color: rgba(212,175,55,0.35);
  font-size: 7px;
}

.report-section-quote {
  margin: 24px 0;
  padding: 18px 24px;
  font-style: italic;
  color: rgba(212,175,55,0.85);
  background: rgba(212,175,55,0.03);
  border-radius: 12px;
  border-left: 2px solid rgba(212,175,55,0.25);
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  line-height: 1.6;
  letter-spacing: 0.01em;
}

/* ── Buttons ──────────────────────────────────────────────────────────────── */
.report-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-family: 'Space Grotesk', sans-serif;
}

.report-btn--primary {
  background: linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.05));
  color: #d4af37;
  border: 1px solid rgba(212,175,55,0.2);
}
.report-btn--primary:hover {
  background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08));
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(212,175,55,0.08);
}

.report-btn--secondary {
  background: rgba(255,255,255,0.03);
  color: #8a8a8e;
  border: 1px solid rgba(255,255,255,0.06);
}
.report-btn--secondary:hover {
  background: rgba(255,255,255,0.06);
  color: #f0eeea;
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
.report-footer {
  margin-top: 80px;
  padding-top: 48px;
  border-top: 1px solid rgba(255,255,255,0.04);
  text-align: center;
}

.report-footer-seal {
  margin-bottom: 32px;
}
.report-footer-seal-icon {
  font-size: 28px;
  color: rgba(212,175,55,0.3);
  margin-bottom: 8px;
}
.report-footer-seal-text {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(212,175,55,0.5);
  letter-spacing: 0.15em;
}
.report-footer-seal-sub {
  font-size: 11px;
  color: #5a5a5e;
  margin-top: 4px;
  letter-spacing: 0.05em;
}

.report-footer-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.report-footer-disclaimer {
  font-size: 12px;
  color: #4a4a4e;
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto;
  font-style: italic;
}

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .report-scroll {
    padding: 90px 18px 60px;
  }
  .report-section-inner {
    padding-left: 20px;
  }
  .report-section-title {
    font-size: 20px;
  }
  .report-section-body {
    font-size: 14px;
  }
  .report-cover-content {
    padding: 40px 20px 60px;
  }
  .report-cover-big-three {
    flex-direction: column;
    gap: 8px;
  }
  .report-cover-bt-divider {
    width: 40px;
    height: 1px;
    margin: 0 auto;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent);
  }
  .report-toc-panel {
    width: calc(100vw - 40px);
    right: 20px;
  }
  .report-header-center {
    display: none;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* SETUP SCREEN                                                               */
/* ═══════════════════════════════════════════════════════════════════════════ */

.report-setup {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 50;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #060607;
}

.report-setup-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(147,80,255,0.02) 0%, transparent 50%);
}

.report-setup-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 440px;
  padding: 24px 20px 40px;
  margin: auto 0;
  animation: report-cover-fade-in 0.8s ease-out;
}

.report-setup-eyebrow {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #d4af37;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 16px;
}

.report-setup-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(26px, 6vw, 34px);
  font-weight: 400;
  color: #f0eeea;
  text-align: center;
  margin: 0 0 8px;
  line-height: 1.2;
}

.report-setup-subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  font-style: italic;
  color: rgba(212,175,55,0.5);
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 0.02em;
}

/* Mode toggle */
.report-setup-mode {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 4px;
  border: 1px solid rgba(255,255,255,0.04);
}

.report-setup-mode-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: none;
  color: #8a8a8e;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Space Grotesk', sans-serif;
  text-align: center;
}

.report-setup-mode-btn:hover {
  color: #f0eeea;
}

.report-setup-mode-btn.is-active {
  background: rgba(212,175,55,0.1);
  color: #d4af37;
  font-weight: 600;
}

/* Fields */
.report-setup-field {
  margin-bottom: 16px;
}

.report-setup-field--half {
  flex: 1;
}

.report-setup-label {
  display: block;
  font-size: 11px;
  color: #8a8a8e;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-family: 'JetBrains Mono', monospace;
}

.report-setup-hint {
  color: #5a5a5e;
  font-size: 10px;
  text-transform: none;
  letter-spacing: 0.02em;
  font-family: 'Space Grotesk', sans-serif;
}

.report-setup-input,
.report-setup-select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: #f0eeea;
  font-size: 14px;
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.25s ease;
  outline: none;
}

/* Keep native appearance for date/time/number so mobile pickers work */
.report-setup-input[type="text"],
.report-setup-input[type="date"],
.report-setup-input[type="time"],
.report-setup-input[type="number"],
.report-setup-select {
  -webkit-appearance: none;
  appearance: none;
}

/* Fix iOS date/time inputs: they need height + min-height to be tappable */
.report-setup-input[type="date"],
.report-setup-input[type="time"] {
  min-height: 44px;
  line-height: 1.2;
}

/* Re-enable native appearance specifically for date/time so pickers open */
.report-setup-input[type="date"],
.report-setup-input[type="time"] {
  -webkit-appearance: auto;
  appearance: auto;
}

.report-setup-input:focus,
.report-setup-select:focus {
  border-color: rgba(212,175,55,0.3);
  background: rgba(212,175,55,0.03);
  box-shadow: 0 0 0 3px rgba(212,175,55,0.05);
}

.report-setup-input::placeholder {
  color: #4a4a4e;
}

.report-setup-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8a8e' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.report-setup-select option {
  background: #121214;
  color: #f0eeea;
}

.report-setup-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.report-setup-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #8a8a8e;
  cursor: pointer;
  font-family: 'Space Grotesk', sans-serif;
}

.report-setup-check input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #d4af37;
  cursor: pointer;
}

.report-setup-empty {
  padding: 14px;
  font-size: 13px;
  color: #5a5a5e;
  text-align: center;
  background: rgba(255,255,255,0.02);
  border-radius: 10px;
  border: 1px dashed rgba(255,255,255,0.06);
}

.report-setup-link {
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  font-size: 13px;
  font-family: 'Space Grotesk', sans-serif;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.report-setup-error {
  padding: 12px 16px;
  background: rgba(220,50,50,0.08);
  border: 1px solid rgba(220,50,50,0.15);
  border-radius: 10px;
  color: #e06060;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
}

.report-setup-generate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.06));
  border: 1px solid rgba(212,175,55,0.25);
  color: #d4af37;
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.35s ease;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.report-setup-generate:hover {
  background: linear-gradient(135deg, rgba(212,175,55,0.22), rgba(212,175,55,0.1));
  transform: translateY(-1px);
  box-shadow: 0 8px 32px rgba(212,175,55,0.1);
}

.report-setup-back {
  display: block;
  width: 100%;
  text-align: center;
  background: none;
  border: none;
  color: #5a5a5e;
  font-size: 13px;
  cursor: pointer;
  padding: 8px;
  font-family: 'Space Grotesk', sans-serif;
  transition: color 0.2s;
}

.report-setup-back:hover {
  color: #8a8a8e;
}

/* Error actions */
.report-error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive setup */
@media (max-width: 480px) {
  .report-setup-content {
    padding: 20px 16px 32px;
  }
  .report-setup-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .report-setup-mode {
    flex-direction: column;
  }
  .report-setup-title {
    font-size: 26px;
  }
  .report-setup-subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }
}
`;
