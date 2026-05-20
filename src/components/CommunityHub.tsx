/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    COMMUNITY HUB — SANCTUARY OF CONNECTION                ║
 * ║                                                                           ║
 * ║  Find kindred spirits, local circles, and community spaces aligned with   ║
 * ║  celestial rhythms and natural timekeeping.                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo } from 'react';
import i18n from '../i18n';
import '../styles/tracker-panel.css';

// ═════════════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════════════

interface CommunityResource {
  id: string;
  name: string;
  description: string;
  type: 'local' | 'circle' | 'online' | 'space';
  location?: string;
  timezone?: string;
  languages?: string[];
  contact?: string;
  website?: string;
  schedule?: string;
}

interface RegionData {
  country: string;
  flag: string;
  timezone: string;
  resources: CommunityResource[];
}

// ═════════════════════════════════════════════════════════════════════════════
// COMMUNITY RESOURCE DATA
// Expandable — add regions and resources as the community grows
// ═════════════════════════════════════════════════════════════════════════════

const COMMUNITY_DATA: Record<string, RegionData> = {
  au: {
    country: 'Australia',
    flag: '🇦🇺',
    timezone: 'Australia/Sydney',
    resources: [
      {
        id: 'au-1',
        name: 'Sydney Moon Circle',
        description: 'Monthly gathering for lunar observation, intention setting, and community connection under the southern sky.',
        type: 'circle',
        location: 'Sydney, NSW',
        schedule: 'New Moon, 7:00 PM AEST',
        contact: 'sydneymooncircle@example.com',
      },
      {
        id: 'au-2',
        name: 'Biodynamic Gardening Collective',
        description: 'Learn to plant by moon phases and planetary rhythms with experienced growers.',
        type: 'local',
        location: 'Melbourne, VIC',
        schedule: 'First Saturday of each month',
        website: 'https://example.com/biodynamic-melbourne',
      },
      {
        id: 'au-3',
        name: 'Aboriginal Astronomy & Culture Centre',
        description: 'Explore Indigenous Australian astronomical knowledge and Dreamtime stories of the stars.',
        type: 'space',
        location: 'National — online & local events',
        contact: 'culture@example.com',
      },
    ],
  },
  us: {
    country: 'United States',
    flag: '🇺🇸',
    timezone: 'America/New_York',
    resources: [
      {
        id: 'us-1',
        name: 'The Astro Lodge',
        description: 'A welcoming space for astrology enthusiasts, moon ceremonies, and celestial workshops.',
        type: 'space',
        location: 'Los Angeles, CA',
        schedule: 'Open daily, events weekly',
        website: 'https://example.com/astrolodge',
      },
      {
        id: 'us-2',
        name: 'Thirteen Moons Collective',
        description: 'Online community exploring natural timekeeping, lunar cycles, and seasonal living.',
        type: 'online',
        schedule: 'Virtual meetups every Full Moon',
        website: 'https://example.com/13moons',
      },
      {
        id: 'us-3',
        name: 'Hudson Valley Biodynamic Farm',
        description: 'Hands-on workshops in planting by celestial rhythms and earth stewardship.',
        type: 'local',
        location: 'Hudson Valley, NY',
        schedule: 'Seasonal workshops',
        contact: 'farm@example.com',
      },
    ],
  },
  uk: {
    country: 'United Kingdom',
    flag: '🇬🇧',
    timezone: 'Europe/London',
    resources: [
      {
        id: 'uk-1',
        name: 'Stone Circle Gatherings',
        description: 'Seasonal assemblies at sacred sites for solstice, equinox, and cross-quarter celebrations.',
        type: 'circle',
        location: 'Wiltshire & Cornwall',
        schedule: 'Quarter days and cross-quarters',
        website: 'https://example.com/stonecircles',
      },
      {
        id: 'uk-2',
        name: 'The Druid Grove',
        description: 'Study natural philosophy, tree lore, and Celtic calendar traditions in community.',
        type: 'local',
        location: 'Glastonbury & online',
        schedule: 'Weekly gatherings',
        contact: 'grove@example.com',
      },
    ],
  },
  de: {
    country: 'Germany',
    flag: '🇩🇪',
    timezone: 'Europe/Berlin',
    resources: [
      {
        id: 'de-1',
        name: 'Mondkreis Berlin',
        description: 'German-speaking moon circle for meditation, ritual, and community under lunar phases.',
        type: 'circle',
        location: 'Berlin',
        schedule: 'Neumond, 19:00 CET',
        contact: 'mondkreis@example.com',
      },
      {
        id: 'de-2',
        name: 'Naturrhythmus Zentrum',
        description: 'Center for biodynamic agriculture and natural time education in the German countryside.',
        type: 'space',
        location: 'Bavaria',
        schedule: 'Workshops seasonally',
        website: 'https://example.com/naturrhythmus',
      },
    ],
  },
  jp: {
    country: 'Japan',
    flag: '🇯🇵',
    timezone: 'Asia/Tokyo',
    resources: [
      {
        id: 'jp-1',
        name: 'Tsukimi Gathering',
        description: 'Traditional moon-viewing gatherings combining Japanese lunar customs with community celebration.',
        type: 'circle',
        location: 'Tokyo & Kyoto',
        schedule: 'Monthly full moon',
        contact: 'tsukimi@example.com',
      },
      {
        id: 'jp-2',
        name: 'Zen & Celestial Rhythm Retreat',
        description: 'Silent retreats exploring the intersection of Buddhist practice and natural time cycles.',
        type: 'space',
        location: 'Mount Koya region',
        schedule: 'Quarterly retreats',
        website: 'https://example.com/zen-celestial',
      },
    ],
  },
  global: {
    country: 'Global',
    flag: '🌍',
    timezone: 'UTC',
    resources: [
      {
        id: 'gl-1',
        name: 'HEKA Circle — Online',
        description: 'The global HEKA community. Share observations, ask questions, and connect with natural timekeepers worldwide.',
        type: 'online',
        schedule: 'Active 24/7',
        website: 'https://hekaverse.com/circle',
      },
      {
        id: 'gl-2',
        name: 'Worldwide Biodynamic Association',
        description: 'International network of farms, gardens, and educators working with celestial planting calendars.',
        type: 'online',
        website: 'https://example.com/biodynamic-global',
      },
      {
        id: 'gl-3',
        name: 'Sacred Timekeepers Guild',
        description: 'A loose federation of communities across cultures preserving traditional calendar systems.',
        type: 'online',
        website: 'https://example.com/sacred-time',
      },
    ],
  },
};

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

export const CommunityHub: React.FC<CommunityHubProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<HubTab>('nearby');
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    const lang = (i18n.language || 'en').split('-')[0].toLowerCase();
    return LOCALE_TO_REGION[lang] || 'global';
  });

  const currentRegion = COMMUNITY_DATA[selectedRegion] || COMMUNITY_DATA.global;

  const filteredResources = useMemo(() => {
    const all = [
      ...currentRegion.resources,
      ...(selectedRegion !== 'global' ? COMMUNITY_DATA.global.resources : []),
    ];
    if (activeTab === 'all') return all;
    return all.filter(r => r.type === activeTab);
  }, [activeTab, selectedRegion, currentRegion]);

  const regions = useMemo(() => Object.entries(COMMUNITY_DATA), []);

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
                          background: resource.type === 'circle' ? 'var(--t-semantic-fertile)20' :
                            resource.type === 'online' ? 'var(--t-accent-secondary)20' :
                            'var(--t-accent-primary)20',
                          color: resource.type === 'circle' ? 'var(--t-semantic-fertile)' :
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
