/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NATAL REPORT BUILDER — Premium Viewer with Setup + Cinematic Cover Page
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Flow:
 *   SETUP → [user selects/edits profile] → LOADING → COVER → REPORT
 *
 * Setup allows:
 *   • Select existing profile from dropdown
 *   • Edit name (for gifting / personalization)
 *   • Enter completely new birth details
 *   • Save new profile to Redux automatically
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { addAstroProfile } from '../../store';
import type { AstroProfile } from '../../types/astrology';
import { generateNatalReport, type NatalReport, type ReportSection } from './reportGenerator';
import { REPORT_CSS } from './reportCss';
import { escapeHtml } from '../../utils/htmlEscape';

type ViewState = 'setup' | 'loading' | 'ready' | 'error';

interface SetupForm {
  name: string;
  birthDate: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  locationName: string;
  latitude: string;
  longitude: string;
  timezone: string;
}

const DEFAULT_SETUP: SetupForm = {
  name: '',
  birthDate: '',
  birthTime: '12:00',
  birthTimeUnknown: false,
  locationName: '',
  latitude: '',
  longitude: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

export const NatalReportBuilder: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const astroProfiles = useSelector((state: RootState) => state.calendar.astroProfiles);

  const [viewState, setViewState] = useState<ViewState>('setup');
  const [report, setReport] = useState<NatalReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showToc, setShowToc] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Setup form state
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [form, setForm] = useState<SetupForm>(DEFAULT_SETUP);
  const [mode, setMode] = useState<'select' | 'new'>('select');
  const [formError, setFormError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // Inject CSS
  useEffect(() => {
    const styleId = 'heka-report-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = REPORT_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  // Pre-populate form when selecting a profile
  useEffect(() => {
    if (mode === 'select' && selectedProfileId) {
      const p = astroProfiles.find(ap => ap.id === selectedProfileId);
      if (p) {
        setForm({
          name: p.name,
          birthDate: p.birthDate,
          birthTime: p.birthTime,
          birthTimeUnknown: p.birthTimeUnknown,
          locationName: p.location.name,
          latitude: String(p.location.latitude),
          longitude: String(p.location.longitude),
          timezone: p.timezone,
        });
      }
    }
  }, [selectedProfileId, mode, astroProfiles]);

  // Scroll progress
  useEffect(() => {
    if (viewState !== 'ready') return;
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewState]);

  const validateAndGenerate = useCallback(async () => {
    setFormError(null);

    // Validation
    if (!form.name.trim()) { setFormError('Please enter a name.'); return; }
    if (!form.birthDate) { setFormError('Please enter a birth date.'); return; }
    if (!form.birthTimeUnknown && !form.birthTime) { setFormError('Please enter a birth time or check "Time unknown".'); return; }
    if (!form.locationName.trim()) { setFormError('Please enter a birth location.'); return; }

    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) { setFormError('Please enter a valid latitude (-90 to 90).'); return; }
    if (isNaN(lng) || lng < -180 || lng > 180) { setFormError('Please enter a valid longitude (-180 to 180).'); return; }

    setViewState('loading');

    let profile: AstroProfile;

    if (mode === 'select' && selectedProfileId) {
      const existing = astroProfiles.find(p => p.id === selectedProfileId);
      if (existing) {
        // Allow name override for gifting
        profile = { ...existing, name: form.name.trim() };
      } else {
        setFormError('Selected profile not found.');
        setViewState('setup');
        return;
      }
    } else {
      // Create new profile
      const now = new Date().toISOString();
      profile = {
        id: crypto.randomUUID ? crypto.randomUUID() : `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: form.name.trim(),
        birthDate: form.birthDate,
        birthTime: form.birthTimeUnknown ? '12:00' : form.birthTime,
        birthTimeUnknown: form.birthTimeUnknown,
        location: {
          name: form.locationName.trim(),
          latitude: lat,
          longitude: lng,
        },
        timezone: form.timezone,
        preferences: {
          zodiacSystem: '12-sign',
          zodiacFrame: 'tropical',
          signCount: 12,
          houseSystem: 'placidus',
          aspectSet: 'major-only',
          showArabianParts: false,
          showAsteroids: false,
          showDwarfPlanets: false,
        },
        createdAt: now,
        updatedAt: now,
      };
      // Save to Redux so future reports can reuse it
      dispatch(addAstroProfile(profile));
    }

    try {
      const r = await generateNatalReport(profile);
      setReport(r);
      setViewState('ready');
      setHasEntered(false);
      window.scrollTo({ top: 0 });
    } catch (err) {
      console.error('[NatalReport] Generation failed:', err);
      setError('Failed to generate report. Please check your birth details and try again.');
      setViewState('error');
    }
  }, [form, mode, selectedProfileId, astroProfiles, dispatch]);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    setShowToc(false);
    const el = document.getElementById(`report-section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleExportText = useCallback(() => {
    if (!report) return;
    const text = report.sections.map(s => `${s.title}\n${s.subtitle ? s.subtitle + '\n' : ''}${s.content}`).join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.profile.name.replace(/\s+/g, '_')}_natal_report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, [report]);

  const handleEnterReport = () => {
    setHasEntered(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      if (report?.sections[0]) setActiveSection(report.sections[0].id);
    }, 600);
  };

  // ── SETUP SCREEN ───────────────────────────────────────────────────────────

  if (viewState === 'setup') {
    return (
      <div className="natal-report">
        <div className="report-setup">
          <div className="report-setup-bg" />
          <div className="report-setup-content">
            <div className="report-setup-eyebrow">HEKA PRO</div>
            <h1 className="report-setup-title">Celestial Blueprint</h1>
            <p className="report-setup-subtitle">Enter the birth details to generate a comprehensive natal analysis.</p>

            {/* Mode toggle */}
            <div className="report-setup-mode">
              <button
                className={`report-setup-mode-btn ${mode === 'select' ? 'is-active' : ''}`}
                onClick={() => { setMode('select'); setFormError(null); }}
              >
                Use Existing Profile
              </button>
              <button
                className={`report-setup-mode-btn ${mode === 'new' ? 'is-active' : ''}`}
                onClick={() => { setMode('new'); setSelectedProfileId(''); setForm(DEFAULT_SETUP); setFormError(null); }}
              >
                New Birth Details
              </button>
            </div>

            {/* Existing profile selector */}
            {mode === 'select' && (
              <div className="report-setup-field">
                <label className="report-setup-label">Select Profile</label>
                {astroProfiles.length === 0 ? (
                  <div className="report-setup-empty">
                    No profiles yet. <button className="report-setup-link" onClick={() => setMode('new')}>Create one now →</button>
                  </div>
                ) : (
                  <select
                    className="report-setup-select"
                    value={selectedProfileId}
                    onChange={e => setSelectedProfileId(e.target.value)}
                  >
                    <option value="">— Choose a profile —</option>
                    {astroProfiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {p.birthDate} · {p.location.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Name — always editable (for gifting) */}
            <div className="report-setup-field">
              <label className="report-setup-label">
                Name <span className="report-setup-hint">(edit freely — for gifting or privacy)</span>
              </label>
              <input
                className="report-setup-input"
                type="text"
                placeholder={t('report.namePlaceholder')}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            {/* Birth Date */}
            <div className="report-setup-field">
              <label className="report-setup-label">Birth Date</label>
              <input
                className="report-setup-input"
                type="date"
                value={form.birthDate}
                onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
              />
            </div>

            {/* Birth Time */}
            <div className="report-setup-field">
              <div className="report-setup-row">
                <label className="report-setup-label">Birth Time</label>
                <label className="report-setup-check">
                  <input
                    type="checkbox"
                    checked={form.birthTimeUnknown}
                    onChange={e => setForm(f => ({ ...f, birthTimeUnknown: e.target.checked }))}
                  />
                  <span>Time unknown (uses noon)</span>
                </label>
              </div>
              {!form.birthTimeUnknown && (
                <input
                  className="report-setup-input"
                  type="time"
                  value={form.birthTime}
                  onChange={e => setForm(f => ({ ...f, birthTime: e.target.value }))}
                />
              )}
            </div>

            {/* Location */}
            <div className="report-setup-field">
              <label className="report-setup-label">Birth Location</label>
              <input
                className="report-setup-input"
                type="text"
                placeholder={t('report.locationPlaceholder')}
                value={form.locationName}
                onChange={e => setForm(f => ({ ...f, locationName: e.target.value }))}
              />
            </div>

            {/* Coordinates */}
            <div className="report-setup-row">
              <div className="report-setup-field report-setup-field--half">
                <label className="report-setup-label">Latitude</label>
                <input
                  className="report-setup-input"
                  type="number"
                  inputMode="decimal"
                  step="0.0001"
                  min="-90"
                  max="90"
                  placeholder={t('report.latitudePlaceholder')}
                  value={form.latitude}
                  onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                />
              </div>
              <div className="report-setup-field report-setup-field--half">
                <label className="report-setup-label">Longitude</label>
                <input
                  className="report-setup-input"
                  type="number"
                  inputMode="decimal"
                  step="0.0001"
                  min="-180"
                  max="180"
                  placeholder={t('report.longitudePlaceholder')}
                  value={form.longitude}
                  onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                />
              </div>
            </div>

            {/* Timezone */}
            <div className="report-setup-field">
              <label className="report-setup-label">Timezone</label>
              <input
                className="report-setup-input"
                type="text"
                placeholder={t('report.timezonePlaceholder')}
                value={form.timezone}
                onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
              />
            </div>

            {formError && <div className="report-setup-error">{formError}</div>}

            <button className="report-setup-generate" onClick={validateAndGenerate}>
              <span>Generate Report</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <button className="report-setup-back" onClick={() => navigate('/')}>
              ← Back to Calendar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ────────────────────────────────────────────────────────────────

  if (viewState === 'loading') {
    return (
      <div className="natal-report">
        <div className="report-loading">
          <div className="report-loading-spinner" />
          <div className="report-loading-text">Calculating your celestial blueprint...</div>
          <div className="report-loading-sub">
            Generating tropical & sidereal charts · Calculating nakshatras · Analyzing patterns · Composing your report
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR ──────────────────────────────────────────────────────────────────

  if (viewState === 'error') {
    return (
      <div className="natal-report">
        <div className="report-error">
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌌</div>
          <div className="report-error-title">Stars Not Aligned</div>
          <div className="report-error-message">{error}</div>
          <div className="report-error-actions">
            <button className="report-btn report-btn--primary" onClick={() => setViewState('setup')}>
              Try Again
            </button>
            <button className="report-btn report-btn--secondary" onClick={() => navigate('/astrology-hub')}>
              Astrology Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── READY: COVER + REPORT ──────────────────────────────────────────────────

  if (!report) return null;
  const cd = report.coverData;

  return (
    <div className="natal-report">
      {/* Progress bar */}
      <div className="report-progress-bar">
        <div className="report-progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Sticky header */}
      {hasEntered && (
        <header className="report-header">
          <button className="report-back" onClick={() => navigate('/')} aria-label={t('common.back')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Store
          </button>
          <div className="report-header-center">
            <span className="report-header-pro">HEKA PRO</span>
            <span className="report-header-divider">|</span>
            <span className="report-header-title">Celestial Blueprint</span>
          </div>
          <div className="report-header-meta">{report.wordCount.toLocaleString()} words</div>
        </header>
      )}

      {/* Floating TOC */}
      {hasEntered && (
        <>
          <button className="report-toc-toggle" onClick={() => setShowToc(!showToc)} title="Contents" aria-label={t('common.toggleContents')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {showToc && (
            <div className="report-toc-panel">
              <div className="report-toc-title">Contents</div>
              {report.sections.map(s => (
                <button
                  key={s.id}
                  className={`report-toc-item ${activeSection === s.id ? 'is-active' : ''}`}
                  onClick={() => scrollToSection(s.id)}
                >
                  <span className="report-toc-icon">{s.icon}</span>
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* COVER PAGE */}
      {!hasEntered && (
        <div className="report-cover">
          <div className="report-cover-bg" />
          <div className="report-cover-content">
            <div className="report-cover-eyebrow">
              <span className="report-cover-pro">HEKA PRO</span>
              <span className="report-cover-confidential">CONFIDENTIAL</span>
            </div>

            <div className="report-cover-divider-top" />

            <h1 className="report-cover-title">Celestial Blueprint</h1>
            <p className="report-cover-subtitle">A Comprehensive Natal Analysis</p>

            <div className="report-cover-divider-mid" />

            <div className="report-cover-for">
              <div className="report-cover-for-label">Prepared Exclusively For</div>
              <div className="report-cover-for-name">{cd.name}</div>
            </div>

            <div className="report-cover-data">
              <div className="report-cover-data-row">
                <span className="report-cover-data-label">Birth Date</span>
                <span className="report-cover-data-value">{cd.birthDate}</span>
              </div>
              <div className="report-cover-data-row">
                <span className="report-cover-data-label">Birth Time</span>
                <span className="report-cover-data-value">{cd.birthTime}</span>
              </div>
              <div className="report-cover-data-row">
                <span className="report-cover-data-label">Location</span>
                <span className="report-cover-data-value">{cd.location}</span>
              </div>
            </div>

            <div className="report-cover-big-three">
              <div className="report-cover-bt-item">
                <div className="report-cover-bt-label">☉ Sun</div>
                <div className="report-cover-bt-value">{cd.tropicalSun}</div>
                <div className="report-cover-bt-sidereal">Sid. {cd.siderealSun}</div>
              </div>
              <div className="report-cover-bt-divider" />
              <div className="report-cover-bt-item">
                <div className="report-cover-bt-label">☽ Moon</div>
                <div className="report-cover-bt-value">{cd.tropicalMoon}</div>
                <div className="report-cover-bt-sidereal">Sid. {cd.siderealMoon}</div>
              </div>
              <div className="report-cover-bt-divider" />
              <div className="report-cover-bt-item">
                <div className="report-cover-bt-label">↑ Rising</div>
                <div className="report-cover-bt-value">{cd.tropicalRising}</div>
                <div className="report-cover-bt-sidereal">{cd.moonMansion && `${cd.moonMansion} Q${cd.moonQuarter}`}</div>
              </div>
            </div>

            <div className="report-cover-meta">
              <span>{cd.wordCount.toLocaleString()} words</span>
              <span>·</span>
              <span>{cd.moonPhase} Moon</span>
              <span>·</span>
              <span>{cd.chartShape} Shape</span>
              <span>·</span>
              <span>{capitalize(cd.dominantElement)} Dominant</span>
            </div>

            <div className="report-cover-divider-bottom" />

            <button className="report-cover-enter" onClick={handleEnterReport}>
              <span>Enter Your Reading</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* REPORT CONTENT */}
      {hasEntered && (
        <div className="report-scroll" ref={contentRef}>
          {report.sections.map(section => (
            <ReportSectionCard
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              onVisible={() => setActiveSection(section.id)}
            />
          ))}

          {/* Footer */}
          <div className="report-footer">
            <div className="report-footer-seal">
              <div className="report-footer-seal-icon">✦</div>
              <div className="report-footer-seal-text">HEKA PRO</div>
              <div className="report-footer-seal-sub">Celestial Blueprint</div>
            </div>
            <div className="report-footer-actions">
              <button className="report-btn report-btn--primary" onClick={handleExportText}>
                💾 Export as Text
              </button>
              <button className="report-btn report-btn--secondary" onClick={() => setViewState('setup')}>
                ← New Report
              </button>
            </div>
            <div className="report-footer-disclaimer">
              This report is generated from precise astronomical calculations using the Swiss Ephemeris
              and interpretive frameworks drawn from Hellenistic, Vedic, Medieval, and Psychological astrology.
              It is offered as a tool for self-reflection, not as deterministic prediction.
              You are the author of your life.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Section Card with Intersection Observer ──────────────────────────────────

const ReportSectionCard: React.FC<{
  section: ReportSection;
  isActive: boolean;
  onVisible: () => void;
}> = ({ section, onVisible }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onVisible]);

  const paragraphs = section.content.split('\n\n').filter(Boolean);

  return (
    <div
      id={`report-section-${section.id}`}
      ref={ref}
      className={`report-section ${section.highlight ? `report-section--${section.highlight}` : ''}`}
    >
      <div className="report-section-accent" />
      <div className="report-section-inner">
        <div className="report-section-header">
          {section.icon && <div className="report-section-icon">{section.icon}</div>}
          <div>
            <h2 className="report-section-title">{section.title}</h2>
            {section.subtitle && <div className="report-section-subtitle">{section.subtitle}</div>}
          </div>
        </div>
        <div className="report-section-body">
          {paragraphs.map((p, i) => {
            if (p.startsWith('## ')) return <h3 key={i} className="report-section-h3">{p.replace('## ', '')}</h3>;
            if (p.startsWith('### ')) return <h4 key={i} className="report-section-h4">{p.replace('### ', '')}</h4>;
            if (p.startsWith('• ')) return <p key={i} className="report-section-p report-section-p--bullet" dangerouslySetInnerHTML={{ __html: formatInline(p) }} />;
            if (p.startsWith('*"') && p.endsWith('"*')) return <blockquote key={i} className="report-section-quote">{p.replace(/^\*"/, '').replace(/"\*$/, '')}</blockquote>;
            return <p key={i} className="report-section-p" dangerouslySetInnerHTML={{ __html: formatInline(p) }} />;
          })}
        </div>
      </div>
    </div>
  );
};

function formatInline(text: string): string {
  // Escape HTML first, then apply safe markdown-like formatting
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return html;
}

function capitalize(s: string): string { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

export default NatalReportBuilder;
