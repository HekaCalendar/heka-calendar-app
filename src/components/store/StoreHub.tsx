/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * HEKA PRO STORE — Cinematic Enterprise Experience
 * Complete redesign: cosmic hero, glass panels, dramatic pricing, feature rows
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  SUBSCRIPTION_TIERS,
  STORE_PRODUCTS,
  type StoreProduct,
  type SubscriptionTier,
} from './storeData';
import { STORE_CSS } from './storeCss';

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  certificate: { icon: '📜', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.08)' },
  report: { icon: '🔮', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)' },
  routine: { icon: '⏰', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.08)' },
  physical: { icon: '📦', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.08)' },
};

/* ── Animated Background Rings (CSS-driven) ─────────────────────────────────── */
const CosmicRings: React.FC = () => (
  <div className="store-cosmic-rings" aria-hidden="true">
    <div className="store-ring store-ring--1" />
    <div className="store-ring store-ring--2" />
    <div className="store-ring store-ring--3" />
    <div className="store-orb store-orb--1" />
    <div className="store-orb store-orb--2" />
  </div>
);

/* ── Floating Header ────────────────────────────────────────────────────────── */
const StoreHeader: React.FC<{ isPro: boolean; onBack: () => void }> = ({
  isPro,
  onBack,
}) => (
  <header className="store-float-header">
    <button className="store-float-back" onClick={onBack} aria-label="Back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="store-float-brand">
      <span className="store-float-diamond">◈</span>
      <span className="store-float-title">HEKA Pro</span>
    </div>
    {isPro ? (
      <div className="store-float-status">
        <span className="store-float-pulse" />
        <span>Active</span>
      </div>
    ) : (
      <div className="store-float-badge">Upgrade</div>
    )}
  </header>
);

/* ── Cinematic Hero ─────────────────────────────────────────────────────────── */
const HeroSection: React.FC<{ isPro: boolean }> = ({ isPro }) => (
  <section className="store-hero-cinematic">
    <CosmicRings />
    <div className="store-hero-content">
      <div className="store-hero-eyebrow">{isPro ? 'Your Subscription' : 'Premium Access'}</div>
      <h1 className="store-hero-headline">
        {isPro ? (
          <>Your Cosmic<br />Universe Awaits</>
        ) : (
          <>Unlock Your<br />Cosmic Potential</>
        )}
      </h1>
      <p className="store-hero-body">
        {isPro
          ? 'Every digital feature is yours. Explore physical artifacts to complete your collection.'
          : 'One subscription. Every digital feature. Birth certificates, deep charts, compatibility, AI routines — all included.'}
      </p>
      {!isPro && (
        <div className="store-hero-cta-row">
          <a href="#pricing" className="store-hero-cta-primary">Choose Your Path</a>
          <a href="#features" className="store-hero-cta-secondary">Explore Features</a>
        </div>
      )}
    </div>
  </section>
);

/* ── Pro Status Panel ───────────────────────────────────────────────────────── */
const ProPanel: React.FC<{ tier: string | null }> = ({ tier }) => (
  <div className="store-pro-panel">
    <div className="store-pro-panel-glow" />
    <div className="store-pro-panel-content">
      <div className="store-pro-panel-icon">💎</div>
      <div className="store-pro-panel-text">
        <div className="store-pro-panel-label">HEKA Pro Active</div>
        <div className="store-pro-panel-tier">{tier === 'yearly' ? 'Yearly Plan' : 'Monthly Plan'}</div>
      </div>
      <div className="store-pro-panel-check">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  </div>
);

/* ── Pricing Section ────────────────────────────────────────────────────────── */
const PricingSection: React.FC<{
  tiers: SubscriptionTier[];
  selected: SubscriptionTier | null;
  onSelect: (t: SubscriptionTier) => void;
}> = ({ tiers, selected, onSelect }) => {
  const yearly = tiers.find(t => t.id === 'yearly');
  const monthly = tiers.find(t => t.id === 'monthly');

  return (
    <section id="pricing" className="store-pricing">
      <div className="store-section-eyebrow">Pricing</div>
      <h2 className="store-section-title">Choose Your Path</h2>

      <div className="store-pricing-stack">
        {yearly && (
          <div
            className={`store-pricing-card store-pricing-card--primary ${selected?.id === 'yearly' ? 'is-selected' : ''}`}
            onClick={() => onSelect(yearly)}
          >
            <div className="store-pricing-card-shine" />
            <div className="store-pricing-card-badge">Best Value · {yearly.savings}</div>
            <div className="store-pricing-card-name">{yearly.name}</div>
            <div className="store-pricing-card-price">
              <span className="store-pricing-card-currency">$</span>
              <span className="store-pricing-card-amount">{yearly.price}</span>
              <span className="store-pricing-card-period">{yearly.period}</span>
            </div>
            <div className="store-pricing-card-equiv">≈ $10.83 / month</div>
            <ul className="store-pricing-card-features">
              {yearly.features.map((f, i) => (
                <li key={i}><span className="store-check">✦</span>{f}</li>
              ))}
            </ul>
            <button className="store-pricing-card-btn">
              {selected?.id === 'yearly' ? 'Selected →' : 'Select Yearly'}
            </button>
          </div>
        )}

        {monthly && (
          <div
            className={`store-pricing-card store-pricing-card--secondary ${selected?.id === 'monthly' ? 'is-selected' : ''}`}
            onClick={() => onSelect(monthly)}
          >
            <div className="store-pricing-card-name">{monthly.name}</div>
            <div className="store-pricing-card-price">
              <span className="store-pricing-card-currency">$</span>
              <span className="store-pricing-card-amount">{monthly.price}</span>
              <span className="store-pricing-card-period">{monthly.period}</span>
            </div>
            <ul className="store-pricing-card-features">
              {monthly.features.map((f, i) => (
                <li key={i}><span className="store-check">✦</span>{f}</li>
              ))}
            </ul>
            <button className="store-pricing-card-btn store-pricing-card-btn--outline">
              {selected?.id === 'monthly' ? 'Selected →' : 'Select Monthly'}
            </button>
          </div>
        )}
      </div>

      {selected && (
        <div className="store-checkout-bar">
          <button className="store-checkout-btn">
            Subscribe to {selected.name}
            <span className="store-checkout-btn-price">${selected.price}{selected.period}</span>
          </button>
          <p className="store-checkout-hint">Stripe checkout integration pending</p>
        </div>
      )}
    </section>
  );
};

/* ── Feature Showcase ───────────────────────────────────────────────────────── */
const FEATURE_GROUPS = [
  {
    icon: '📜',
    title: 'Birth Certificates',
    desc: 'Digital & physical certificates with your celestial data',
    items: ['PDF download', 'Sidereal chart', 'Rising sign', 'House cusps'],
  },
  {
    icon: '🔮',
    title: 'Deep Reports',
    desc: 'Comprehensive astrological analysis & forecasts',
    items: ['5,000+ word natal reading', 'Year-ahead transits', 'Compatibility synastry'],
  },
  {
    icon: '⏰',
    title: 'AI Routines',
    desc: 'Personalized schedules baked into your calendar',
    items: ['AI-powered builder', '50+ templates', 'Moon-phase alignment'],
  },
  {
    icon: '🤖',
    title: 'AI Coach',
    desc: 'Priority responses and advanced pattern detection',
    items: ['Priority AI responses', 'Pattern detection', 'Celestial insights'],
  },
];

const FeaturesSection: React.FC = () => (
  <section id="features" className="store-features">
    <div className="store-section-eyebrow">What's Included</div>
    <h2 className="store-section-title">Everything in Pro</h2>

    <div className="store-features-grid">
      {FEATURE_GROUPS.map((group, idx) => (
        <div key={idx} className="store-feature-block">
          <div className="store-feature-block-icon">{group.icon}</div>
          <div className="store-feature-block-content">
            <div className="store-feature-block-title">{group.title}</div>
            <div className="store-feature-block-desc">{group.desc}</div>
            <div className="store-feature-block-tags">
              {group.items.map((item, i) => (
                <span key={i} className="store-feature-tag">{item}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ── Product Gallery ────────────────────────────────────────────────────────── */
const ProductGallery: React.FC<{
  products: StoreProduct[];
  isPro: boolean;
  onSelect: (p: StoreProduct) => void;
}> = ({ products, isPro, onSelect }) => {
  const digital = products.filter(p => p.includedWithPro);
  const physical = products.filter(p => !p.includedWithPro);

  return (
    <>
      <section className="store-gallery">
        <div className="store-section-eyebrow">Digital Collection</div>
        <h2 className="store-section-title">Your Pro Library</h2>
        <div className="store-gallery-scroll">
          {digital.map(product => (
            <ProductCard key={product.id} product={product} isPro={isPro} onClick={() => onSelect(product)} />
          ))}
        </div>
      </section>

      <section className="store-gallery store-gallery--physical">
        <div className="store-section-eyebrow">Physical Artifacts</div>
        <h2 className="store-section-title">Tangible Reminders</h2>
        <p className="store-gallery-subtitle">Museum-quality pieces shipped worldwide</p>
        <div className="store-gallery-scroll">
          {physical.map(product => (
            <ProductCard key={product.id} product={product} isPro={isPro} onClick={() => onSelect(product)} />
          ))}
        </div>
      </section>
    </>
  );
};

/* ── Product Card ───────────────────────────────────────────────────────────── */
const ProductCard: React.FC<{
  product: StoreProduct;
  isPro: boolean;
  onClick: () => void;
}> = ({ product, isPro, onClick }) => {
  const meta = CATEGORY_META[product.category];
  const locked = product.includedWithPro && !isPro;

  return (
    <div className={`store-gallery-card ${locked ? 'is-locked' : ''}`} onClick={onClick}>
      <div className="store-gallery-card-accent" style={{ background: meta.color }} />
      <div className="store-gallery-card-icon" style={{ background: meta.bg, color: meta.color }}>
        {meta.icon}
      </div>
      <div className="store-gallery-card-name">{product.name}</div>
      <div className="store-gallery-card-desc">{product.description}</div>
      <div className="store-gallery-card-footer">
        {product.includedWithPro ? (
          <span className="store-gallery-card-badge store-gallery-card-badge--pro">✦ Included</span>
        ) : (
          <span className="store-gallery-card-badge store-gallery-card-badge--price">${product.price}</span>
        )}
        {product.previewAvailable && (
          <span className="store-gallery-card-preview">Preview →</span>
        )}
      </div>
      {locked && <div className="store-gallery-card-lock">🔒</div>}
    </div>
  );
};

/* ── Product Modal ──────────────────────────────────────────────────────────── */
const ProductModal: React.FC<{
  product: StoreProduct;
  isPro: boolean;
  onClose: () => void;
  onGenerate?: () => void;
}> = ({ product, isPro, onClose, onGenerate }) => {
  const meta = CATEGORY_META[product.category];
  const canAccess = product.includedWithPro ? isPro : true;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="store-modal-cinematic" onClick={onClose}>
      <div className="store-modal-cinematic-backdrop" />
      <div className="store-modal-cinematic-panel" onClick={e => e.stopPropagation()}>
        <button className="store-modal-cinematic-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="store-modal-cinematic-hero">
          <div className="store-modal-cinematic-icon" style={{ background: meta.bg, color: meta.color }}>
            {meta.icon}
          </div>
          <h2 className="store-modal-cinematic-title">{product.name}</h2>
          <p className="store-modal-cinematic-desc">{product.description}</p>
        </div>

        <div className="store-modal-cinematic-features">
          {product.features.map((f, i) => (
            <div key={i} className="store-modal-cinematic-feature">
              <span className="store-modal-cinematic-check" style={{ color: meta.color }}>✦</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="store-modal-cinematic-actions">
          {canAccess ? (
            <button
              className="store-modal-cinematic-btn store-modal-cinematic-btn--active"
              style={{ '--btn-glow': meta.color } as React.CSSProperties}
              onClick={() => {
                if ((product.id === 'cert-digital' || product.id === 'routine-ai-builder' || product.id === 'report-natal-deep') && onGenerate) {
                  onGenerate();
                }
              }}
            >
              {product.category === 'physical' ? `Order — $${product.price}` : 'Generate Now'}
            </button>
          ) : (
            <button className="store-modal-cinematic-btn store-modal-cinematic-btn--upgrade">
              Unlock with HEKA Pro
            </button>
          )}
          {!canAccess && (
            <p className="store-modal-cinematic-hint">Included with HEKA Pro ($13/month or $130/year)</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════ */

export const StoreHub: React.FC = () => {
  const navigate = useNavigate();
  const subscription = useSelector((state: RootState) => state.calendar.subscription);
  const isPro = subscription.isPro;
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);

  const goBack = useCallback(() => navigate('/'), [navigate]);

  /* Inject styles */
  useEffect(() => {
    const styleId = 'heka-store-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = STORE_CSS;
      document.head.appendChild(style);
      console.log('[HEKA Store] CSS injected, length:', STORE_CSS.length);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="store-enterprise">
      <StoreHeader isPro={isPro} onBack={goBack} />

      <main className="store-enterprise-main">
        <HeroSection isPro={isPro} />

        {isPro && <ProPanel tier={subscription.tier || 'monthly'} />}

        {!isPro && (
          <>
            <PricingSection
              tiers={SUBSCRIPTION_TIERS}
              selected={selectedTier}
              onSelect={setSelectedTier}
            />
            <FeaturesSection />
          </>
        )}

        <ProductGallery
          products={STORE_PRODUCTS}
          isPro={isPro}
          onSelect={setSelectedProduct}
        />
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isPro={isPro}
          onClose={() => setSelectedProduct(null)}
          onGenerate={() => {
            setSelectedProduct(null);
            if (selectedProduct?.id === 'cert-digital') {
              navigate('/certificate');
            } else if (selectedProduct?.id === 'routine-ai-builder') {
              navigate('/routine');
            } else if (selectedProduct?.id === 'report-natal-deep') {
              navigate('/natal-report');
            }
          }}
        />
      )}
    </div>
  );
};

export default StoreHub;
