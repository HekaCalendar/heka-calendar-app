/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    COMMUNITY HUB — SANCTUARY OF CONNECTION                ║
 * ║                                                                           ║
 * ║  Find kindred spirits, local circles, and community spaces aligned with   ║
 * ║  celestial rhythms and natural timekeeping.                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import i18n from '../i18n';
import '../styles/tracker-panel.css';
import type { RootState, AppDispatch } from '../store';
import { setSelectedCommunityRegion } from '../store';
import { attachCommunityResourcesListener, detachCommunityResourcesListener } from '../services/communityService';
import { DEFAULT_COMMUNITY_RESOURCES } from '../data/communityResources';
import type { RegionData } from '../types';

// ═════════════════════════════════════════════════════════════════════════════
// COMMUNITY RESOURCE DATA
// Bundled offline fallback. Live Firestore data merges with / overrides this.
// ═════════════════════════════════════════════════════════════════════════════

const COMMUNITY_DATA: Record<string, RegionData> = DEFAULT_COMMUNITY_RESOURCES;

// Map supported languages to regions for intelligent defaults
const LOCALE_TO_REGION: Record<string, string> = {
  en: 'us', es: 'us', fr: 'us', de: 'de', it: 'us', pt: 'us',
  zh: 'global', ja: 'jp', ko: 'global', ar: 'global', hi: 'global', ru: 'global',
  tr: 'global', pl: 'global', nl: 'global', sv: 'global', el: 'global', he: 'global',
  th: 'global', vi: 'global', id: 'global', uk: 'global', ro: 'global', cs: 'global',
  hu: 'global', da: 'global', fi: 'global', no: 'global', sk: 'global', bg: 'global',
};

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

interface CommunityHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type HubTab = 'nearby' | 'circles' | 'online' | 'all';

function mergeCommunityData(
  fallback: Record<string, RegionData>,
  live: Record<string, RegionData>
): Record<string, RegionData> {
  const merged: Record<string, RegionData> = { ...fallback };
  for (const [region, data] of Object.entries(live)) {
    if (!data?.resources) continue;
    const existing = merged[region];
    if (existing) {
      const resourceMap = new Map(existing.resources.map((r) => [r.id, r]));
      for (const r of data.resources) resourceMap.set(r.id, r);
      merged[region] = { ...existing, ...data, resources: Array.from(resourceMap.values()) };
    } else {
      merged[region] = data;
    }
  }
  return merged;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const liveResources = useSelector((state: RootState) => state.calendar.communityResources);
  const persistedRegion = useSelector((state: RootState) => state.calendar.selectedCommunityRegion);

  const communityData = useMemo(() => mergeCommunityData(COMMUNITY_DATA, liveResources), [liveResources]);

  const [activeTab, setActiveTab] = useState<HubTab>('nearby');
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    if (persistedRegion && communityData[persistedRegion]) return persistedRegion;
    const lang = (i18n.language || 'en').split('-')[0].toLowerCase();
    return LOCALE_TO_REGION[lang] || 'global';
  });

  useEffect(() => {
    attachCommunityResourcesListener();
    return () => detachCommunityResourcesListener();
  }, []);

  useEffect(() => {
    dispatch(setSelectedCommunityRegion(selectedRegion));
  }, [selectedRegion, dispatch]);

  const currentRegion = communityData[selectedRegion] || communityData.global;

  const filteredResources = useMemo(() => {
    const all = [
      ...currentRegion.resources,
      ...(selectedRegion !== 'global' ? communityData.global.resources : []),
    ];
    if (activeTab === 'all') return all;
    return all.filter(r => r.type === activeTab);
  }, [activeTab, selectedRegion, currentRegion, communityData.global.resources]);

  const regions = useMemo(() => Object.entries(communityData), [communityData]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'local': return '🏛️';
      case 'circle': return '🌙';
      case 'online': return '🌐';
      case 'space': return '⛺';
      default: return '📍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'local': return 'Local';
      case 'circle': return 'Circle';
      case 'online': return 'Online';
      case 'space': return 'Space';
      default: return 'Resource';
    }
  };

  if (!isOpen) return null;

  const tabs: { id: HubTab; icon: string; label: string }[] = [
    { id: 'nearby', icon: '📍', label: 'Nearby' },
    { id: 'circles', icon: '🌙', label: 'Circles' },
    { id: 'online', icon: '🌐', label: 'Online' },
    { id: 'all', icon: '📋', label: 'All' },
  ];

  return (
    <div className="tracker-panel">
      {/* HEADER */}
      <header className="tracker-header">
        <div className="tracker-header__brand">
          <div className="tracker-header__icon">🤝</div>
          <h1 className="tracker-header__title">
            Community <span>Hub</span>
          </h1>
        </div>
        <div className="tracker-header__actions">
          <button className="tracker-header__btn tracker-header__btn--primary" onClick={onClose}>
            <span>✕</span>
            <span>Close</span>
          </button>
        </div>
      </header>

      {/* REGION SELECTOR */}
      <div className="tracker-date-nav">
        <button
          className="tracker-date-nav__btn"
          onClick={() => {
            const keys = regions.map(([k]) => k);
            const idx = keys.indexOf(selectedRegion);
            setSelectedRegion(keys[(idx - 1 + keys.length) % keys.length]);
          }}
          aria-label={i18n.t('common.previous')}
        >
          ‹
        </button>
        <div className="tracker-date-nav__current">
          <div className="tracker-date-nav__day">{currentRegion.flag}</div>
          <div className="tracker-date-nav__full">{currentRegion.country}</div>
        </div>
        <button
          className="tracker-date-nav__btn"
          onClick={() => {
            const keys = regions.map(([k]) => k);
            const idx = keys.indexOf(selectedRegion);
            setSelectedRegion(keys[(idx + 1) % keys.length]);
          }}
          aria-label={i18n.t('common.nextItem')}
        >
          ›
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="tracker-content" style={{ gridTemplateColumns: '1fr' }}>
        <main className="tracker-main" style={{ maxWidth: '100%' }}>
          {/* TABS */}
          <nav className="tracker-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tracker-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tracker-tab__icon">{tab.icon}</span>
                <span className="tracker-tab__label">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* TAB CONTENT */}
          <div className="tracker-tab-content">
            {filteredResources.length === 0 ? (
              <div className="tracker-empty">
                <div className="tracker-empty__icon">🌑</div>
                <h3 className="tracker-empty__title">No listings yet</h3>
                <p className="tracker-empty__text">
                  Community resources for this region are being curated. Check the "Global" tab for worldwide connections.
                </p>
              </div>
            ) : (
              <div className="tracker-section">
                <div className="tracker-section__header">
                  <h2 className="tracker-section__title">
                    <span className="tracker-section__title-icon">🤝</span>
                    {activeTab === 'nearby' && 'Nearby Connections'}
                    {activeTab === 'circles' && 'Moon Circles & Gatherings'}
                    {activeTab === 'online' && 'Online Communities'}
                    {activeTab === 'all' && 'All Resources'}
                  </h2>
                  <span style={{ color: 'var(--t-text-secondary)', fontSize: '14px' }}>
                    {filteredResources.length} listing{filteredResources.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {filteredResources.map(resource => (
                  <div key={resource.id} className="tracker-entry">
                    <div className="tracker-entry__header">
                      <div className="tracker-entry__type">
                        <span className="tracker-entry__type-icon">{getTypeIcon(resource.type)}</span>
                        <span className="tracker-entry__type-label">{resource.name}</span>
                      </div>
                      <span
                        className="tracker-entry-card__badge"
                        style={{
                          background: resource.type === 'circle' ? 'var(--t-accent-primary)20' :
                            resource.type === 'online' ? 'var(--t-accent-secondary)20' :
                            'var(--t-accent-primary)20',
                          color: resource.type === 'circle' ? 'var(--t-accent-primary)' :
                            resource.type === 'online' ? 'var(--t-accent-secondary)' :
                            'var(--t-accent-primary)',
                        }}
                      >
                        {getTypeLabel(resource.type)}
                      </span>
                    </div>
                    <div className="tracker-entry__content">
                      <p style={{ color: 'var(--t-text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>
                        {resource.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '13px' }}>
                        {resource.location && (
                          <span style={{ color: 'var(--t-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📍 {resource.location}
                          </span>
                        )}
                        {resource.schedule && (
                          <span style={{ color: 'var(--t-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📅 {resource.schedule}
                          </span>
                        )}
                        {resource.contact && (
                          <span style={{ color: 'var(--t-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ✉️ {resource.contact}
                          </span>
                        )}
                        {resource.website && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--t-accent-secondary)', textDecoration: 'none' }}
                          >
                            🌐 Visit website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommunityHub;
