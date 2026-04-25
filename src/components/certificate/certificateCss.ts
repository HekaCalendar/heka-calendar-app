/**
 * Certificate Builder UI CSS
 * Injected imperatively via useEffect (same pattern as StoreHub)
 */

export const CERTIFICATE_CSS = `
/* ═══════════════════════════════════════════════════════════════════════════ */
/* CERTIFICATE BUILDER — Enterprise Wizard Chrome                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

.cert-builder {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: linear-gradient(180deg, #070708 0%, #0a0a12 50%, #070708 100%);
  color: #f8f7f5;
  font-family: 'Inter', system-ui, sans-serif;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.cert-builder::-webkit-scrollbar { width: 4px; }
.cert-builder::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }

/* ── Header ───────────────────────────────────────────────────────────────── */
.cert-builder-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(180deg, rgba(7,7,8,0.95) 0%, rgba(7,7,8,0.8) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 16px 20px;
  padding-top: calc(16px + env(safe-area-inset-top, 0px));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cert-builder-back {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #a1a1aa;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.cert-builder-back:hover {
  background: rgba(255,255,255,0.1);
  color: #f8f7f5;
}

.cert-builder-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 600;
  color: #d4af37;
  letter-spacing: 1px;
}

.cert-builder-step-label {
  font-size: 11px;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* ── Step Indicator ───────────────────────────────────────────────────────── */
.cert-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.cert-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.cert-step-label-text {
  font-size: 9px;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
  text-align: center;
  white-space: nowrap;
}
.cert-step-label-text.is-active {
  color: #d4af37;
}

.cert-step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.15);
  transition: all 0.3s ease;
}
.cert-step-dot.is-active {
  background: #d4af37;
  border-color: #d4af37;
  box-shadow: 0 0 12px rgba(212,175,55,0.4);
}
.cert-step-dot.is-complete {
  background: #34d399;
  border-color: #34d399;
}

.cert-step-line {
  width: 32px;
  height: 2px;
  background: rgba(255,255,255,0.08);
  border-radius: 1px;
}
.cert-step-line.is-complete {
  background: linear-gradient(90deg, #34d399, #d4af37);
}

/* ── Main Content Area ────────────────────────────────────────────────────── */
.cert-builder-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: calc(20px + 80px + env(safe-area-inset-bottom, 0px));
}

/* ── Birth Data Form ──────────────────────────────────────────────────────── */
.cert-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cert-form-section {
  background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 24px;
}

.cert-form-section-title {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  color: #d4af37;
  letter-spacing: 1px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.cert-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 600px) {
  .cert-form-row { grid-template-columns: 1fr; }
}

.cert-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cert-form-field label {
  font-size: 12px;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.cert-form-field input,
.cert-form-field select {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 12px 14px;
  color: #f8f7f5;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  outline: none;
  transition: all 0.2s ease;
}
.cert-form-field input:focus,
.cert-form-field select:focus {
  border-color: rgba(212,175,55,0.4);
  box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
}
.cert-form-field input::placeholder {
  color: #52525b;
}

.cert-form-field--full {
  grid-column: 1 / -1;
}

.cert-form-error {
  font-size: 11px;
  color: #fca5a5;
  margin-top: 4px;
}

.cert-form-hint {
  font-size: 10px;
  color: #71717a;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
}

.cert-profile-select {
  width: 100%;
  padding: 12px 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 10px;
  color: #f8f7f5;
  font-size: 14px;
  font-family: 'Inter', system-ui, sans-serif;
  outline: none;
  cursor: pointer;
}
.cert-profile-select:focus {
  border-color: rgba(212,175,55,0.4);
  box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
}
.cert-profile-select option {
  background: #121214;
  color: #f8f7f5;
}

.cert-coord-readout {
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(212,175,55,0.05);
  border: 1px solid rgba(212,175,55,0.1);
  border-radius: 10px;
  font-size: 12px;
  color: #d4af37;
  font-family: 'JetBrains Mono', monospace;
}

/* ── Template Gallery ─────────────────────────────────────────────────────── */
.cert-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.cert-gallery-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  border: 2px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
}
.cert-gallery-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212,175,55,0.25);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(212,175,55,0.06);
}
.cert-gallery-card.is-selected {
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212,175,55,0.15), 0 12px 40px rgba(0,0,0,0.4);
}

.cert-gallery-card-thumb {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cert-gallery-card-icon {
  font-size: 36px;
  opacity: 0.8;
}

.cert-gallery-card-info {
  padding: 14px 16px;
}

.cert-gallery-card-name {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 600;
  color: #f8f7f5;
  margin-bottom: 4px;
}

.cert-gallery-card-desc {
  font-size: 11px;
  color: #71717a;
  line-height: 1.4;
}

/* ── Preview Area ─────────────────────────────────────────────────────────── */
.cert-preview-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.cert-preview-frame {
  position: relative;
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  overflow: hidden;
}

.cert-preview-scaler {
  transform-origin: top center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.cert-preview-data {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 20px;
}

.cert-preview-data-title {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  color: #d4af37;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.cert-preview-data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 13px;
}
.cert-preview-data-row:last-child { border-bottom: none; }

.cert-preview-data-label {
  color: #a1a1aa;
}

.cert-preview-data-value {
  color: #f8f7f5;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── Export Controls ──────────────────────────────────────────────────────── */
.cert-export {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
}

.cert-export-preview {
  margin-bottom: 20px;
}

.cert-export-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.cert-export-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.cert-export-btn--png {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  box-shadow: 0 8px 24px rgba(124,58,237,0.3);
}
.cert-export-btn--png:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(124,58,237,0.4);
}

.cert-export-btn--pdf {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  box-shadow: 0 8px 24px rgba(220,38,38,0.3);
}
.cert-export-btn--pdf:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(220,38,38,0.4);
}

.cert-export-btn--clipboard {
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
  color: #f8f7f5;
  border: 1px solid rgba(255,255,255,0.12);
}
.cert-export-btn--clipboard:hover {
  background: rgba(255,255,255,0.12);
}

.cert-export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.cert-export-progress {
  width: 100%;
  max-width: 300px;
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
}

.cert-export-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #f4d03f);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.cert-export-status {
  font-size: 13px;
  color: #a1a1aa;
}

.cert-export-success {
  text-align: center;
  padding: 30px;
}

.cert-export-success-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.cert-export-success-title {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  color: #d4af37;
  margin-bottom: 8px;
}

.cert-export-success-text {
  font-size: 13px;
  color: #a1a1aa;
  margin-bottom: 20px;
}

/* ── Navigation Buttons ───────────────────────────────────────────────────── */
.cert-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(0deg, rgba(7,7,8,0.98) 0%, rgba(7,7,8,0.85) 60%, transparent 100%);
  backdrop-filter: blur(12px);
}

.cert-nav-btn {
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: 'Inter', system-ui, sans-serif;
}

.cert-nav-btn--back {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #a1a1aa;
}
.cert-nav-btn--back:hover {
  background: rgba(255,255,255,0.1);
  color: #f8f7f5;
}

.cert-nav-btn--next {
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: #0a0a0c;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(212,175,55,0.2);
}
.cert-nav-btn--next:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(212,175,55,0.3);
}
.cert-nav-btn--next:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* ── Loading State ────────────────────────────────────────────────────────── */
.cert-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.cert-loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(212,175,55,0.15);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: certSpin 0.8s linear infinite;
}

@keyframes certSpin {
  to { transform: rotate(360deg); }
}

.cert-loading-text {
  font-size: 13px;
  color: #a1a1aa;
}

/* ── Error State ──────────────────────────────────────────────────────────── */
.cert-error {
  text-align: center;
  padding: 40px 20px;
}

.cert-error-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.cert-error-text {
  font-size: 14px;
  color: #fca5a5;
  margin-bottom: 16px;
}

/* ── Animations ───────────────────────────────────────────────────────────── */
@keyframes certFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.cert-fade-in {
  animation: certFadeIn 0.4s ease forwards;
}
`;
