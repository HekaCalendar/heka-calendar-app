/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PERSONALIZATION FORM — Name, birth data, birth location (geocoded), current location (GPS)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { LocationSearch } from '../../../astrology/components/forms/LocationSearch';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconLocation, IconArrowRight } from './OnboardingIcons';
import { addAstroProfile } from '../../../store';
import './onboardingAnimations.css';



export const PersonalizationForm: React.FC = () => {
  const { goNext, setPersonalization, skip, getInterpolatedCopy, state } = useOnboarding();
  const [name, setName] = useState(state.personalization.name || '');
  const [birthDate, setBirthDate] = useState(state.personalization.birthDate || '');
  const [birthTime, setBirthTime] = useState(state.personalization.birthTime || '');
  const [selectedBirthLocation, setSelectedBirthLocation] = useState<{ name: string; lat: number; lng: number } | null>(
    state.personalization.latitude && state.personalization.longitude
      ? { name: state.personalization.birthLocation || '', lat: state.personalization.latitude, lng: state.personalization.longitude }
      : null
  );
  const [birthLocationQuery, setBirthLocationQuery] = useState(state.personalization.birthLocation || '');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Location services are not available in this browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(err.message || 'Location access denied');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleContinue = () => {
    setIsSubmitting(true);
    const lat = selectedBirthLocation?.lat ?? currentLocation?.lat;
    const lng = selectedBirthLocation?.lng ?? currentLocation?.lng;
    const locName = selectedBirthLocation?.name || birthLocationQuery.trim() || undefined;

    setPersonalization({
      name: name.trim() || undefined,
      birthDate: birthDate || undefined,
      birthTime: birthTime || undefined,
      birthLocation: locName,
      latitude: lat,
      longitude: lng,
    });

    // Persist to Redux so the birth chart system can actually use this data
    if (name.trim() && birthDate && lat !== undefined && lng !== undefined) {
      dispatch(addAstroProfile({
        id: crypto.randomUUID ? crypto.randomUUID() : `profile-${Date.now()}`,
        name: name.trim(),
        birthDate,
        birthTime: birthTime || '12:00',
        birthTimeUnknown: !birthTime,
        location: {
          name: locName || 'Unknown',
          latitude: lat,
          longitude: lng,
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }

    const timer = setTimeout(() => goNext(), 400);
    return () => clearTimeout(timer);
  };

  const canContinue = name.trim().length > 0 || birthDate || birthLocationQuery.trim().length > 0 || selectedBirthLocation !== null || currentLocation !== null;

  return (
    <div className="im-screen">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <MotionContainer delay={0}>
          <h1 className="im-title" style={{ textAlign: 'left' }}>
            {getInterpolatedCopy('personalization.heading')}
          </h1>
          <p className="im-subtitle" style={{ textAlign: 'left', marginBottom: 36 }}>
            {getInterpolatedCopy('personalization.subheading')}
          </p>
        </MotionContainer>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Name */}
          <MotionContainer delay={150}>
            <FormField
              label={getInterpolatedCopy('personalization.name.label')}
              value={name}
              onChange={setName}
              placeholder={getInterpolatedCopy('personalization.name.placeholder')}
              autoFocus
            />
          </MotionContainer>

          {/* Birth Date */}
          <MotionContainer delay={250}>
            <div>
              <label className="im-label">
                {getInterpolatedCopy('personalization.birth.label')}
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="im-input"
                  style={{ flex: 1 }}
                />
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="im-input"
                  style={{ width: 100 }}
                />
              </div>
              <p className="im-hint">
                {getInterpolatedCopy('personalization.birth.hint')}
              </p>
            </div>
          </MotionContainer>

          {/* Birth Location (geocoded) */}
          <MotionContainer delay={350}>
            <div>
              <label className="im-label">
                <span style={{ marginRight: 6 }}><IconLocation size={14} color="#a89bc8" /></span>
                {getInterpolatedCopy('personalization.birthLocation.label')}
              </label>
              <LocationSearch
                defaultValue={state.personalization.birthLocation}
                onQueryChange={setBirthLocationQuery}
                onLocationSelect={(loc) => setSelectedBirthLocation({ name: loc.name, lat: loc.latitude, lng: loc.longitude })}
              />
              {selectedBirthLocation && (
                <div
                  style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(45, 138, 78, 0.08)',
                    border: '1px solid rgba(45, 138, 78, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    animation: 'im-fade-in 0.3s ease',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1C4.24 1 2 3.24 2 6C2 9.5 7 13 7 13C7 13 12 9.5 12 6C12 3.24 9.76 1 7 1Z" stroke="#81b29a" strokeWidth="1.5" fill="none" />
                    <circle cx="7" cy="6" r="1.5" fill="#81b29a" />
                  </svg>
                  <span style={{ fontSize: 12, color: '#81b29a', fontWeight: 500 }}>
                    Found: {selectedBirthLocation.name} ({selectedBirthLocation.lat.toFixed(2)}, {selectedBirthLocation.lng.toFixed(2)})
                  </span>
                </div>
              )}
              <p className="im-hint">
                {getInterpolatedCopy('personalization.birthLocation.hint')}
              </p>
            </div>
          </MotionContainer>

          {/* Current Location (GPS) */}
          <MotionContainer delay={450}>
            <div>
              <label className="im-label">
                {getInterpolatedCopy('personalization.currentLocation.label')}
              </label>
              {!currentLocation ? (
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={gpsLoading}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: 14,
                    border: '1px solid rgba(201, 162, 39, 0.2)',
                    background: 'rgba(201, 162, 39, 0.05)',
                    color: gpsLoading ? '#6b5b8a' : '#c9a227',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: gpsLoading ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {gpsLoading ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '2px solid rgba(201, 162, 39, 0.15)',
                          borderTopColor: '#c9a227',
                          animation: 'im-progress-rotate 0.8s linear infinite',
                        }}
                      />
                      Finding you...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="6" stroke="#c9a227" strokeWidth="1.5" fill="none" />
                        <circle cx="9" cy="9" r="2" fill="#c9a227" />
                        <path d="M9 1V3M9 15V17M1 9H3M15 9H17" stroke="#c9a227" strokeWidth="1.5" />
                      </svg>
                      {getInterpolatedCopy('personalization.currentLocation.button')}
                    </>
                  )}
                </button>
              ) : (
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: 'rgba(45, 138, 78, 0.06)',
                    border: '1px solid rgba(45, 138, 78, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    animation: 'im-fade-in 0.3s ease',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1C5.13 1 2 4.13 2 8C2 12.25 9 17 9 17C9 17 16 12.25 16 8C16 4.13 12.87 1 9 1Z" stroke="#81b29a" strokeWidth="1.5" fill="none" />
                    <circle cx="9" cy="8" r="2" stroke="#81b29a" strokeWidth="1.5" fill="none" />
                  </svg>
                  <span style={{ fontSize: 14, color: '#81b29a', fontWeight: 500 }}>
                    The stars know where you stand.
                  </span>
                </div>
              )}
              {gpsError && (
                <p style={{ fontSize: 11, color: '#e07a5f', marginTop: 6 }}>{gpsError}</p>
              )}
              <p className="im-hint">
                {getInterpolatedCopy('personalization.currentLocation.hint')}
              </p>
            </div>
          </MotionContainer>
        </div>

        {/* Actions */}
        <MotionContainer delay={550}>
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <button
              onClick={skip}
              className="im-btn-ghost"
            >
              {getInterpolatedCopy('personalization.skip')}
            </button>
            <button
              onClick={handleContinue}
              disabled={!canContinue || isSubmitting}
              className="im-btn-primary"
              style={{ flex: 2, gap: 8 }}
            >
              {getInterpolatedCopy('personalization.continue')}
              <IconArrowRight size={18} color={canContinue ? '#05040a' : '#6b5b8a'} />
            </button>
          </div>
        </MotionContainer>
      </div>
    </div>
  );
};

// ─── Reusable Form Field ───
const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}> = ({ label, value, onChange, placeholder, autoFocus }) => (
  <div>
    <label className="im-label">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="im-input"
    />
  </div>
);
