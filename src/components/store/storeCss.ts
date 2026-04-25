export const STORE_CSS = `
/* ═══════════════════════════════════════════════════════════════════════════════
   HEKA PRO STORE — Cinematic Enterprise Dark Theme
   Complete redesign with cosmic hero, glass panels, dramatic pricing
   ═══════════════════════════════════════════════════════════════════════════════ */

.store-enterprise {
  min-height: 100vh;
  background: #05040a;
  color: #f1f5f9;
  font-family: inherit;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 80px;
}

/* ── Ambient Background ─────────────────────────────────────────────────────── */
.store-enterprise::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 50% -20%, rgba(168, 85, 247, 0.12) 0%, transparent 55%),
    radial-gradient(ellipse 80% 60% at 80% 100%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 10% 60%, rgba(34, 211, 238, 0.05) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.store-enterprise-main {
  position: relative;
  z-index: 1;
}

/* ── Section Typography ─────────────────────────────────────────────────────── */
.store-section-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #a855f7;
  margin-bottom: 10px;
}

.store-section-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 28px;
  background: linear-gradient(135deg, #f1f5f9 0%, #c4b5fd 50%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Floating Header ────────────────────────────────────────────────────────── */
.store-float-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(12px + env(safe-area-inset-top)) 20px 12px;
  background: rgba(5, 4, 10, 0.72);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.store-float-back {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.25s ease;
}

.store-float-back:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #f1f5f9;
  transform: translateX(-2px);
}

.store-float-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.store-float-diamond {
  font-size: 20px;
  color: #fbbf24;
  filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.5));
}

.store-float-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f1f5f9;
}

.store-float-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.25);
  padding: 6px 14px;
  border-radius: 20px;
}

.store-float-pulse {
  width: 7px;
  height: 7px;
  background: #34d399;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5);
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5); }
  50% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0); }
}

.store-float-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #05040a;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  padding: 7px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.3);
}

/* ── Cosmic Rings (Hero Background) ─────────────────────────────────────────── */
.store-cosmic-rings {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.store-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid transparent;
  background: linear-gradient(#05040a, #05040a) padding-box,
    conic-gradient(from 0deg, transparent 0%, rgba(168, 85, 247, 0.4) 25%, transparent 50%, rgba(251, 191, 36, 0.3) 75%, transparent 100%) border-box;
  opacity: 0.5;
}

.store-ring--1 {
  width: 500px;
  height: 500px;
  top: -120px;
  right: -120px;
  animation: ringSpin 20s linear infinite;
}

.store-ring--2 {
  width: 380px;
  height: 380px;
  top: -60px;
  right: -60px;
  animation: ringSpin 15s linear infinite reverse;
}

.store-ring--3 {
  width: 260px;
  height: 260px;
  top: 0;
  right: 0;
  animation: ringSpin 10s linear infinite;
}

@keyframes ringSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.store-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
}

.store-orb--1 {
  width: 200px;
  height: 200px;
  background: rgba(168, 85, 247, 0.5);
  top: 20%;
  left: -60px;
  animation: orbFloat 8s ease-in-out infinite;
}

.store-orb--2 {
  width: 160px;
  height: 160px;
  background: rgba(251, 191, 36, 0.35);
  bottom: 10%;
  right: -40px;
  animation: orbFloat 10s ease-in-out infinite reverse;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.1); }
  66% { transform: translate(-10px, 15px) scale(0.95); }
}

/* ── Cinematic Hero ─────────────────────────────────────────────────────────── */
.store-hero-cinematic {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: flex-end;
  padding: 120px 24px 48px;
  overflow: hidden;
}

.store-hero-content {
  position: relative;
  z-index: 2;
  max-width: 520px;
}

.store-hero-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #a855f7;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.25);
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.store-hero-headline {
  font-size: 42px;
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.04em;
  margin: 0 0 18px;
  color: #f1f5f9;
  text-shadow: 0 2px 40px rgba(0, 0, 0, 0.5);
}

.store-hero-headline span {
  background: linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.store-hero-body {
  font-size: 16px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0 0 28px;
  max-width: 400px;
}

.store-hero-cta-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.store-hero-cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #05040a;
  font-size: 15px;
  font-weight: 800;
  text-decoration: none;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
}

.store-hero-cta-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(251, 191, 36, 0.5);
}

.store-hero-cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.store-hero-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
}

/* ── Pro Status Panel ───────────────────────────────────────────────────────── */
.store-pro-panel {
  position: relative;
  margin: 0 20px 40px;
  padding: 1px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(251, 191, 36, 0.3), rgba(52, 211, 153, 0.4));
  overflow: hidden;
}

.store-pro-panel-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(251, 191, 36, 0.1));
  filter: blur(20px);
  opacity: 0.6;
}

.store-pro-panel-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(5, 4, 10, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 19px;
}

.store-pro-panel-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 12px rgba(52, 211, 153, 0.4));
}

.store-pro-panel-label {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.01em;
}

.store-pro-panel-tier {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 2px;
}

.store-pro-panel-check {
  margin-left: auto;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 50%;
}

/* ── Pricing Section ────────────────────────────────────────────────────────── */
.store-pricing {
  padding: 0 20px 48px;
}

.store-pricing-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.store-pricing-card {
  position: relative;
  padding: 28px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.store-pricing-card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
  transition: left 0.6s ease;
}

.store-pricing-card:hover .store-pricing-card-shine {
  left: 100%;
}

.store-pricing-card--primary {
  background: linear-gradient(145deg, rgba(168, 85, 247, 0.12), rgba(251, 191, 36, 0.06));
  border: 2px solid rgba(168, 85, 247, 0.35);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.store-pricing-card--primary:hover,
.store-pricing-card--primary.is-selected {
  transform: translateY(-4px) scale(1.01);
  border-color: rgba(168, 85, 247, 0.6);
  box-shadow: 0 16px 48px rgba(168, 85, 247, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.store-pricing-card--secondary {
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
}

.store-pricing-card--secondary:hover,
.store-pricing-card--secondary.is-selected {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.05);
}

.store-pricing-card-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #05040a;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.store-pricing-card-name {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.02em;
  margin-bottom: 8px;
}

.store-pricing-card-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.store-pricing-card-currency {
  font-size: 22px;
  font-weight: 700;
  color: #f1f5f9;
}

.store-pricing-card-amount {
  font-size: 48px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #f1f5f9 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.store-pricing-card-period {
  font-size: 16px;
  font-weight: 500;
  color: #94a3b8;
}

.store-pricing-card-equiv {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
}

.store-pricing-card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.store-pricing-card-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #cbd5e1;
}

.store-check {
  color: #fbbf24;
  font-size: 12px;
  flex-shrink: 0;
}

.store-pricing-card-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
}

.store-pricing-card--primary .store-pricing-card-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #05040a;
  box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
}

.store-pricing-card--primary .store-pricing-card-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(251, 191, 36, 0.45);
}

.store-pricing-card-btn--outline {
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
}

.store-pricing-card-btn--outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.22);
}

.store-checkout-bar {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.store-checkout-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(90deg, #a855f7, #7c3aed, #a855f7);
  background-size: 200% 100%;
  border: none;
  border-radius: 18px;
  color: #f1f5f9;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.35);
  animation: shimmerSlide 3s linear infinite;
  transition: all 0.3s ease;
}

.store-checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(168, 85, 247, 0.5);
}

@keyframes shimmerSlide {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.store-checkout-btn-price {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.85;
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 12px;
  border-radius: 10px;
}

.store-checkout-hint {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin-top: 10px;
}

/* ── Features Section ───────────────────────────────────────────────────────── */
.store-features {
  padding: 0 20px 48px;
}

.store-features-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.store-feature-block {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.store-feature-block:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateX(4px);
}

.store-feature-block-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  flex-shrink: 0;
}

.store-feature-block-title {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 4px;
}

.store-feature-block-desc {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 10px;
  line-height: 1.4;
}

.store-feature-block-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.store-feature-tag {
  font-size: 11px;
  font-weight: 600;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4px 10px;
  border-radius: 8px;
}

/* ── Product Gallery ────────────────────────────────────────────────────────── */
.store-gallery {
  padding: 0 0 48px;
}

.store-gallery--physical {
  padding-top: 8px;
}

.store-gallery .store-section-eyebrow,
.store-gallery .store-section-title,
.store-gallery-subtitle {
  padding: 0 20px;
}

.store-gallery-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: -18px 0 20px;
}

.store-gallery-scroll {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 4px 20px 20px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.store-gallery-scroll::-webkit-scrollbar {
  display: none;
}

.store-gallery-card {
  position: relative;
  flex: 0 0 260px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  scroll-snap-align: start;
  overflow: hidden;
}

.store-gallery-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.store-gallery-card.is-locked {
  opacity: 0.6;
}

.store-gallery-card-accent {
  position: absolute;
  top: 0;
  left: 24px;
  right: 24px;
  height: 3px;
  border-radius: 0 0 4px 4px;
}

.store-gallery-card-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  border-radius: 18px;
  margin-bottom: 16px;
}

.store-gallery-card-name {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.store-gallery-card-desc {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.45;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.store-gallery-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.store-gallery-card-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 10px;
}

.store-gallery-card-badge--pro {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.store-gallery-card-badge--price {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.store-gallery-card-preview {
  font-size: 12px;
  font-weight: 600;
  color: #a855f7;
}

.store-gallery-card-lock {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 18px;
  opacity: 0.6;
}

/* ── Cinematic Modal ────────────────────────────────────────────────────────── */
.store-modal-cinematic {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: modalBackdropIn 0.35s ease forwards;
}

.store-modal-cinematic-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(5, 4, 10, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.store-modal-cinematic-panel {
  position: relative;
  width: 100%;
  max-height: 88vh;
  background: linear-gradient(180deg, #0c0b14 0%, #08070f 100%);
  border-top: 2px solid rgba(168, 85, 247, 0.4);
  border-radius: 32px 32px 0 0;
  padding: 32px 24px 40px;
  overflow-y: auto;
  animation: modalPanelIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  box-shadow: 0 -20px 60px rgba(168, 85, 247, 0.2);
}

@keyframes modalBackdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalPanelIn {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.store-modal-cinematic-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 2;
}

.store-modal-cinematic-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  transform: rotate(90deg);
}

.store-modal-cinematic-hero {
  text-align: center;
  margin-bottom: 28px;
}

.store-modal-cinematic-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  border-radius: 24px;
  margin: 0 auto 16px;
}

.store-modal-cinematic-title {
  font-size: 26px;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.03em;
  margin: 0 0 8px;
}

.store-modal-cinematic-desc {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.55;
  max-width: 380px;
  margin: 0 auto;
}

.store-modal-cinematic-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.store-modal-cinematic-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  font-size: 14px;
  color: #e2e8f0;
}

.store-modal-cinematic-check {
  font-size: 13px;
  flex-shrink: 0;
}

.store-modal-cinematic-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.store-modal-cinematic-btn {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
}

.store-modal-cinematic-btn--active {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #05040a;
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.35);
}

.store-modal-cinematic-btn--active:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(251, 191, 36, 0.5);
}

.store-modal-cinematic-btn--upgrade {
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  color: #f1f5f9;
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.35);
}

.store-modal-cinematic-btn--upgrade:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(168, 85, 247, 0.5);
}

.store-modal-cinematic-hint {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0;
}

/* ── Responsive ─────────────────────────────────────────────────────────────── */
@media (min-width: 768px) {
  .store-hero-cinematic {
    padding-top: 160px;
    padding-left: 48px;
    padding-right: 48px;
  }
  .store-hero-headline {
    font-size: 56px;
  }
  .store-pricing,
  .store-features {
    padding-left: 48px;
    padding-right: 48px;
  }
  .store-gallery-scroll {
    padding-left: 48px;
    padding-right: 48px;
  }
  .store-gallery .store-section-eyebrow,
  .store-gallery .store-section-title,
  .store-gallery-subtitle {
    padding-left: 48px;
    padding-right: 48px;
  }
}
`;
