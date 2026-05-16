/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL GUIDE - Swiss Ephemeris Powered
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Restored with NASA-grade Swiss Ephemeris precision and original content
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useLayoutEffect, useMemo, memo, useRef, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import type { RootState } from '../store';
import { useFeatureDiscovery } from '../hooks/useGamification';
import { LOCATIONS, SUB_REGIONS } from '../types';
import { hekaToCivil, HEKA_MONTHS } from '../services/calendarService';

interface DetectedLocation {
  latitude: number;
  longitude: number;
  name: string;
}
import { getZodiacSystemPreference, getZodiacFramePreference, getSignCountPreference } from '../astrology/services/natal/zodiacHelpers';
import { setZodiacSystem, setZodiacFrame, setSignCount } from '../astrology/services/swiss-ephemeris/engine';
import '../styles/celestial-scrollbar.css';
import '../components/celestial-cards/UnifiedCards.css';
import { useTranslation } from 'react-i18next';

import { SunTimesCard, DigitalClockCard, MoonPhaseCard, SeasonCard, AgriculturalCard, DayOfWeekCard } from './celestial-cards';

// ═══════════════════════════════════════════════════════════════════════════════
// EXPANDABLE CARD COMPONENTS (kept for contextual date info)
// ═══════════════════════════════════════════════════════════════════════════════

const ExpandableCard: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  accentColor?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, subtitle, icon, accentColor = 'var(--color-gold)', children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`celestial-expandable-card ${isExpanded ? 'expanded' : ''}`} style={{ '--accent-color': accentColor } as React.CSSProperties}>
      <div className="celestial-expandable-card__header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="celestial-expandable-card__icon">{icon}</span>
        <div className="celestial-expandable-card__title-group">
          <span className="celestial-expandable-card__title">{title}</span>
          {subtitle && <span className="celestial-expandable-card__subtitle">{subtitle}</span>}
        </div>
        <span className={`celestial-expandable-card__chevron ${isExpanded ? 'rotated' : ''}`}>▼</span>
      </div>
      {isExpanded && <div className="celestial-expandable-card__content">{children}</div>}
    </div>
  );
};

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="celestial-info-section">
    <h4 className="celestial-info-section__title">{title}</h4>
    <div className="celestial-info-section__content">{children}</div>
  </div>
);

const InfoBadge: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className="celestial-info-badge" style={color ? { borderColor: color } : undefined}>
    <span className="celestial-info-badge__label">{label}</span>
    <span className="celestial-info-badge__value" style={color ? { color } : undefined}>{value}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getDateContext(selectedDate: Date): { isPast: boolean; isFuture: boolean; isToday: boolean; diffDays: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);
  const diffTime = selected.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return { isPast: diffDays < 0, isFuture: diffDays > 0, isToday: diffDays === 0, diffDays: Math.abs(diffDays) };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CELESTIAL GUIDE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const CelestialGuideComponent: React.FC = () => {
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate, shallowEqual);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  const location = useSelector((state: RootState) => state.calendar.location);
  const subRegion = useSelector((state: RootState) => state.calendar.subRegion);
  const display = useSelector((state: RootState) => state.calendar.display, shallowEqual);
  const { discover } = useFeatureDiscovery();
  const { t, i18n } = useTranslation('celestial');
  
  // Track that user has viewed Celestial Guide
  useEffect(() => {
    discover('openedCelestialGuide');
  }, [discover]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // BROWSER GEOLOCATION — for premium precise location feel
  // ═══════════════════════════════════════════════════════════════════════════════
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null);

  const fetchReverseGeocode = useCallback(async (lat: number, lon: number): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      if (!res.ok) return t('yourLocation');
      const data = await res.json();
      return data.city || data.locality || data.principalSubdivision || t('yourLocation');
    } catch {
      return t('yourLocation');
    }
  }, [t]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    // Silently attempt geolocation — don't prompt aggressively
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const name = await fetchReverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setDetectedLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          name,
        });
      },
      () => {
        // Silent fail — fallback to selected location
      },
      { timeout: 8000, maximumAge: 600000 }
    );
  }, [fetchReverseGeocode]);

  // Set zodiac system on mount
  useEffect(() => {
    const zodiacSystem = getZodiacSystemPreference();
    const zodiacFrame = getZodiacFramePreference();
    const signCount = getSignCountPreference();
    setZodiacSystem(zodiacSystem);
    setZodiacFrame(zodiacFrame);
    setSignCount(signCount);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════════
  // SCROLL BEHAVIOUR
  // Vertical scrolling is handled natively by the browser. The CSS touch-action
  // rules on .heka-card (auto) and .celestial-panel (auto) allow the browser to
  // use angle detection: horizontal swipes scroll the panel, vertical swipes
  // bubble up to the page. No JavaScript interception needed.
  // ═══════════════════════════════════════════════════════════════════════════════

  // Location data with sub-region support + browser geolocation fallback
  const locationData = useMemo(() => {
    const countryData = LOCATIONS[location];

    // 1. Browser geolocation is most precise — use if available
    if (detectedLocation) {
      const subRegionData = subRegion ? SUB_REGIONS[location]?.find(r => r.code === subRegion) : null;
      return {
        country: location,
        timezone: subRegionData?.timezone || countryData.timezone,
        latitude: detectedLocation.latitude,
        longitude: detectedLocation.longitude,
        name: `${detectedLocation.name}, ${countryData.name}`,
        region: countryData.region,
      };
    }

    // 2. Sub-region selected
    if (subRegion) {
      const subRegionData = SUB_REGIONS[location]?.find(r => r.code === subRegion);
      if (subRegionData) {
        return {
          country: location,
          timezone: subRegionData.timezone,
          latitude: subRegionData.latitude,
          longitude: subRegionData.longitude,
          name: `${subRegionData.name}, ${countryData.name}`,
          region: countryData.region,
        };
      }
    }

    // 3. Country-level fallback
    return countryData;
  }, [location, subRegion, detectedLocation]);

  const targetHekaDate = selectedDate || viewDate;
  const civilDate = useMemo(() => {
    const baseDate = hekaToCivil(targetHekaDate);
    const now = new Date();
    baseDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    return baseDate;
  }, [targetHekaDate]);

  const dateContext = useMemo(() => getDateContext(civilDate), [civilDate]);
  const { isHistoricalView, isFutureView } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(civilDate);
    selected.setHours(0, 0, 0, 0);
    return { isHistoricalView: selected.getTime() < today.getTime(), isFutureView: selected.getTime() > today.getTime() };
  }, [civilDate]);
  const dayOfYear = useMemo(() => {
    const startOfYear = new Date(civilDate.getFullYear(), 0, 0);
    return Math.floor((civilDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  }, [civilDate]);

  // Contextual title
  const contextualTitle = useMemo(() => {
    if (dateContext.isToday) return t('title');
    if (dateContext.isPast) return t('titlePast', { days: dateContext.diffDays });
    return t('titleFuture', { days: dateContext.diffDays });
  }, [dateContext, t]);

  // Top scroll track refs for synced horizontal scrolling
  const panelRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const topScrollContentRef = useRef<HTMLDivElement>(null);
  const [showTopScroll, setShowTopScroll] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  // Effect 1: detect when any card is expanded to show top scrollbar
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const checkExpanded = () => {
      const hasExpanded = panel.querySelectorAll('.heka-card.expanded, .celestial-expandable-card.expanded').length > 0;
      setShowTopScroll(hasExpanded);
    };

    // Initial check after async card content renders
    const initialTimer = setTimeout(checkExpanded, 150);

    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(checkExpanded) : null;
    mo?.observe(panel, { attributes: true, subtree: true, attributeFilter: ['class'] });

    return () => {
      clearTimeout(initialTimer);
      mo?.disconnect();
    };
  }, []);

  // Effect 2: sync top scrollbar width and bidirectional scroll when visible
  useLayoutEffect(() => {
    if (!showTopScroll) return;
    const panel = panelRef.current;
    const topScroll = topScrollRef.current;
    const topContent = topScrollContentRef.current;
    if (!panel || !topScroll || !topContent) return;

    const syncWidth = () => {
      topContent.style.width = `${panel.scrollWidth}px`;
    };

    // Delay slightly so the DOM has settled after React render
    syncWidth();
    const initialTimer = setTimeout(() => {
      requestAnimationFrame(syncWidth);
    }, 100);

    const handlePanelScroll = () => {
      if (isDraggingRef.current) return;
      if (Math.abs(topScroll.scrollLeft - panel.scrollLeft) > 1) {
        topScroll.scrollLeft = panel.scrollLeft;
      }
    };
    const handleTopScroll = () => {
      if (isDraggingRef.current) return;
      if (Math.abs(panel.scrollLeft - topScroll.scrollLeft) > 1) {
        const prev = panel.style.scrollBehavior;
        panel.style.scrollBehavior = 'auto';
        panel.scrollLeft = topScroll.scrollLeft;
        panel.style.scrollBehavior = prev;
      }
    };

    // Wheel support: vertical wheel over top scrollbar scrolls panel horizontally
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        const prev = panel.style.scrollBehavior;
        panel.style.scrollBehavior = 'auto';
        panel.scrollLeft += e.deltaY;
        panel.style.scrollBehavior = prev;
      }
    };

    // Manual drag for the top scrollbar track/thumb on mobile WebView where
    // native proxy scrollbar thumb drag does not fire scroll events reliably.
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDraggingRef.current = true;
      dragStartXRef.current = e.touches[0].clientX;
      dragStartScrollLeftRef.current = panel.scrollLeft;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      e.preventDefault();
      const delta = dragStartXRef.current - e.touches[0].clientX;
      panel.scrollLeft = dragStartScrollLeftRef.current + delta;
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    panel.addEventListener('scroll', handlePanelScroll, { passive: true });
    topScroll.addEventListener('scroll', handleTopScroll, { passive: true });
    topScroll.addEventListener('wheel', handleWheel, { passive: false });
    topScroll.addEventListener('touchstart', handleTouchStart, { passive: true });
    topScroll.addEventListener('touchmove', handleTouchMove, { passive: false });
    topScroll.addEventListener('touchend', handleTouchEnd);
    topScroll.addEventListener('touchcancel', handleTouchEnd);

    // Watch for size changes on panel and children (height changes indicate expansion)
    const widthRo = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncWidth) : null;
    widthRo?.observe(panel);
    panel.querySelectorAll('.heka-card, .celestial-expandable-card').forEach(el => widthRo?.observe(el as Element));

    // Also watch for DOM changes (children added/removed)
    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(syncWidth) : null;
    mo?.observe(panel, { childList: true, subtree: true });

    window.addEventListener('resize', syncWidth);

    return () => {
      clearTimeout(initialTimer);
      panel.removeEventListener('scroll', handlePanelScroll);
      topScroll.removeEventListener('scroll', handleTopScroll);
      topScroll.removeEventListener('wheel', handleWheel);
      topScroll.removeEventListener('touchstart', handleTouchStart);
      topScroll.removeEventListener('touchmove', handleTouchMove);
      topScroll.removeEventListener('touchend', handleTouchEnd);
      topScroll.removeEventListener('touchcancel', handleTouchEnd);
      widthRo?.disconnect();
      mo?.disconnect();
      window.removeEventListener('resize', syncWidth);
    };
  }, [showTopScroll]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // ANDROID WEBVIEW VERTICAL SCROLL FIX
  // Android WebView's gesture classifier locks to scroll containers with
  // overflow-x:auto and incorrectly traps vertical pan gestures. CSS
  // touch-action is ignored. We bypass the broken classifier by attaching
  // a non-passive touchmove listener, detecting direction, and manually
  // scrolling the page for vertical gestures while letting horizontal
  // gestures scroll the panel natively.
  // ═══════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Only apply on touch devices (coarse pointer) — desktop wheel/mouse
    // should work natively.
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouchDevice) return;

    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let direction: 'h' | 'v' | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lastY = startY;
      direction = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      if (!direction) {
        const dx = Math.abs(x - startX);
        const dy = Math.abs(y - startY);
        if (dx < 12 && dy < 12) return; // still in slop zone
        direction = dx > dy ? 'h' : 'v';
      }

      if (direction === 'v') {
        e.preventDefault();
        const deltaY = y - lastY;
        lastY = y;
        window.scrollBy(0, -deltaY);
      }
    };

    const onTouchEnd = () => {
      direction = null;
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    panel.addEventListener('touchend', onTouchEnd);
    panel.addEventListener('touchcancel', onTouchEnd);

    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', onTouchEnd);
      panel.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  // Only show Celestial Guide if the unified toggle is enabled
  if (!display.showCelestialCards) return null;

  return (
    <div className={`celestial-panel-container ${showTopScroll ? 'has-top-scroll' : ''}`}>
      {/* Title */}
      <div className="celestial-panel__title" style={{ padding: '0 var(--space-4)' }}>
        <span>✦</span> {contextualTitle}
        <span className="celestial-date-context">
          {isHistoricalView && `📜 ${t('historicalView')}`}
          {isFutureView && `🔮 ${t('futureView')}`}
        </span>
      </div>

      {/* Top horizontal scroll track — appears only when a card is expanded */}
      {showTopScroll && (
        <div className="celestial-panel-top-scroll" ref={topScrollRef}>
          <div
            className="celestial-panel-top-scroll__content"
            ref={topScrollContentRef}
          />
        </div>
      )}
      
      <div className="celestial-panel" ref={panelRef}>
        
        {/* Selected Date Info Card - contextual, not a celestial card */}
        {(dateContext.isPast || dateContext.isFuture) && (
          <ExpandableCard
            title={`${HEKA_MONTHS[targetHekaDate.month].name} ${targetHekaDate.day}, ${targetHekaDate.year}`}
            subtitle={t('selectedDate')}
            icon="📅"
            accentColor="#c9a227"
            defaultExpanded={true}
          >
            <div className="selected-date-info">
              <InfoBadge 
                label={t('civilDate')} 
                value={new Intl.DateTimeFormat(i18n.language || 'en', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }).format(civilDate)} 
              />
              <InfoBadge label={t('dayOfYear')} value={t('dayOfYearValue', { day: dayOfYear })} />
              {dateContext.isPast && (
                <InfoSection title={t('lookingBack')}>
                  <p>{t('lookingBackDescription')}</p>
                </InfoSection>
              )}
              {dateContext.isFuture && (
                <InfoSection title={t('lookingForward')}>
                  <p>{t('lookingForwardDescription')}</p>
                </InfoSection>
              )}
            </div>
          </ExpandableCard>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════════════
            NEW EPIC CELESTIAL CARDS — Swiss Ephemeris Powered
            ═══════════════════════════════════════════════════════════════════════════ */}
        
        <SunTimesCard date={civilDate} location={locationData} />
        <DigitalClockCard date={civilDate} location={locationData} />
        <MoonPhaseCard date={civilDate} location={locationData} />
        <SeasonCard date={civilDate} location={locationData} />
        <AgriculturalCard date={civilDate} location={locationData} />
        <DayOfWeekCard date={civilDate} location={locationData} />
        
        {/* Scroll hint - positioned above scrollbar */}
        <div className="scrollbar-hint">{`← ${t('dragToScroll')} →`}</div>
      </div>
    </div>
  );
};

export const CelestialGuide = memo(CelestialGuideComponent);
CelestialGuide.displayName = 'CelestialGuide';
export default CelestialGuide;
