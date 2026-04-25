/**
 * Routine Builder UI CSS
 * Injected imperatively via useEffect
 */

export const ROUTINE_CSS = `
/* ═══════════════════════════════════════════════════════════════════════════ */
/* ROUTINE BUILDER — Enterprise Wizard Chrome                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */

.routine-builder {
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
.routine-builder::-webkit-scrollbar { width: 4px; }
.routine-builder::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }

/* ── Header ───────────────────────────────────────────────────────────────── */
.routine-header {
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

.routine-back {
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
.routine-back:hover {
  background: rgba(255,255,255,0.1);
  color: #f8f7f5;
}

.routine-title {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 600;
  color: #d4af37;
  letter-spacing: 1px;
}

.routine-step-label {
  font-size: 11px;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* ── Step Indicator ───────────────────────────────────────────────────────── */
.routine-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.routine-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.routine-step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,255,255,0.15);
  transition: all 0.3s ease;
}
.routine-step-dot.is-active {
  background: #d4af37;
  border-color: #d4af37;
  box-shadow: 0 0 12px rgba(212,175,55,0.4);
}
.routine-step-dot.is-complete {
  background: #34d399;
  border-color: #34d399;
}

.routine-step-label-text {
  font-size: 9px;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
  text-align: center;
  white-space: nowrap;
}
.routine-step-label-text.is-active {
  color: #d4af37;
}

.routine-step-line {
  width: 24px;
  height: 2px;
  background: rgba(255,255,255,0.08);
  border-radius: 1px;
}
.routine-step-line.is-complete {
  background: linear-gradient(90deg, #34d399, #d4af37);
}

/* ── Content Area ─────────────────────────────────────────────────────────── */
.routine-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: calc(20px + 80px + env(safe-area-inset-bottom, 0px));
}

/* ── Form Sections ────────────────────────────────────────────────────────── */
.routine-section {
  background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}

.routine-section-title {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  color: #d4af37;
  letter-spacing: 1px;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.routine-section-subtitle {
  font-size: 13px;
  color: #a1a1aa;
  margin-bottom: 20px;
  line-height: 1.5;
}

.routine-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 600px) {
  .routine-form-row { grid-template-columns: 1fr; }
}

.routine-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.routine-field label {
  font-size: 12px;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.routine-field input,
.routine-field select,
.routine-field textarea {
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
.routine-field input:focus,
.routine-field select:focus,
.routine-field textarea:focus {
  border-color: rgba(212,175,55,0.4);
  box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
}

.routine-field textarea {
  width: 100%;
  box-sizing: border-box;
  min-height: 48px;
  resize: vertical;
}

.routine-field-hint {
  font-size: 11px;
  color: #71717a;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
}

/* ── Slider ───────────────────────────────────────────────────────────────── */
.routine-slider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.routine-slider input[type="range"] {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  outline: none;
}
.routine-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #d4af37;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(212,175,55,0.3);
}

.routine-slider-value {
  font-size: 18px;
  font-weight: 600;
  color: #d4af37;
  min-width: 40px;
  text-align: center;
}

/* ── Dynamic Lists (Tasks, Goals) ─────────────────────────────────────────── */
.routine-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.routine-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 16px;
  position: relative;
}

.routine-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.routine-item-name {
  font-size: 15px;
  font-weight: 600;
  color: #f8f7f5;
}

.routine-item-meta {
  font-size: 12px;
  color: #71717a;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.routine-item-delete {
  background: none;
  border: none;
  color: #71717a;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}
.routine-item-delete:hover {
  color: #ef4444;
}

.routine-item-edit {
  background: none;
  border: none;
  color: #71717a;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}
.routine-item-edit:hover {
  color: #d4af37;
}

.routine-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px dashed rgba(212,175,55,0.3);
  background: rgba(212,175,55,0.05);
  color: #d4af37;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.routine-add-btn:hover {
  background: rgba(212,175,55,0.1);
  border-style: solid;
}

/* ── Inline Form (for adding items) ───────────────────────────────────────── */
.routine-inline-form {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.routine-inline-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* ── Goal Sections ────────────────────────────────────────────────────────── */
.routine-goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.routine-goal-column {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 16px;
}

.routine-goal-column-title {
  font-size: 12px;
  color: #d4af37;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
  font-weight: 600;
}

/* ── Review Stats ─────────────────────────────────────────────────────────── */
.routine-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.routine-stat-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.routine-stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #d4af37;
  line-height: 1;
  margin-bottom: 4px;
}

.routine-stat-value.is-warning {
  color: #ef4444;
}

.routine-stat-label {
  font-size: 11px;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.routine-warning {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: #fca5a5;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

/* ── Schedule Grid ────────────────────────────────────────────────────────── */
.routine-schedule {
  display: grid;
  grid-template-columns: 50px repeat(7, 1fr);
  gap: 2px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  overflow: hidden;
  font-size: 11px;
}

.routine-schedule-header {
  background: rgba(255,255,255,0.04);
  padding: 8px 4px;
  text-align: center;
  font-weight: 600;
  color: #a1a1aa;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.routine-schedule-time {
  background: rgba(255,255,255,0.02);
  padding: 4px;
  text-align: center;
  color: #71717a;
  font-size: 9px;
  font-family: 'JetBrains Mono', monospace;
}

.routine-schedule-cell {
  background: rgba(255,255,255,0.01);
  min-height: 28px;
  position: relative;
}

.routine-schedule-block {
  position: absolute;
  inset: 1px;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 9px;
  font-weight: 500;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

/* ── Output Buttons ───────────────────────────────────────────────────────── */
.routine-output {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
}

.routine-output-btn {
  width: 100%;
  max-width: 320px;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.routine-output-btn--apply {
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: #0a0a0c;
  box-shadow: 0 8px 24px rgba(212,175,55,0.2);
}
.routine-output-btn--apply:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,0.3);
}

.routine-output-btn--download {
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
  color: #f8f7f5;
  border: 1px solid rgba(255,255,255,0.12);
}
.routine-output-btn--download:hover {
  background: rgba(255,255,255,0.12);
}

.routine-output-btn--restart {
  background: none;
  color: #71717a;
  border: 1px solid rgba(255,255,255,0.06);
}
.routine-output-btn--restart:hover {
  color: #f8f7f5;
  border-color: rgba(255,255,255,0.12);
}

/* ── Navigation ───────────────────────────────────────────────────────────── */
.routine-nav {
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
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(0deg, rgba(7,7,8,0.98) 0%, rgba(7,7,8,0.85) 60%, transparent 100%);
  backdrop-filter: blur(12px);
}

.routine-nav-btn {
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: 'Inter', system-ui, sans-serif;
}

.routine-nav-btn--back {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #a1a1aa;
}
.routine-nav-btn--back:hover {
  background: rgba(255,255,255,0.1);
  color: #f8f7f5;
}

.routine-nav-btn--next {
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: #0a0a0c;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(212,175,55,0.2);
}
.routine-nav-btn--next:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(212,175,55,0.3);
}
.routine-nav-btn--next:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* ── Animations ───────────────────────────────────────────────────────────── */
@keyframes routineFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.routine-fade-in {
  animation: routineFadeIn 0.4s ease forwards;
}

/* ── Uploader Modal ───────────────────────────────────────────────────────── */
.routine-uploader-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.routine-uploader-panel {
  background: linear-gradient(180deg, #12121a 0%, #0a0a12 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  text-align: center;
}

.routine-uploader-drop {
  border: 2px dashed rgba(212,175,55,0.2);
  border-radius: 14px;
  padding: 40px 20px;
  margin: 20px 0;
  color: #a1a1aa;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.routine-uploader-drop:hover {
  border-color: rgba(212,175,55,0.4);
  background: rgba(212,175,55,0.03);
}
`;
