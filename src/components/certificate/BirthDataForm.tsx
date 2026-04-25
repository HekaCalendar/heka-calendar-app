/**
 * Birth Data Form
 * Editable birth details with profile selector, location autocomplete,
 * and manual coordinate override.
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { CertificateData } from './certificateData';
import { LocationSearch } from '../../astrology/components/forms/LocationSearch';
import type { AstroProfile } from '../../types/astrology';

interface Props {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
}

const TIMEZONES = [
  'UTC',
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'America/Vancouver', 'America/Mexico_City',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai', 'Asia/Kolkata',
  'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Seoul', 'Asia/Bangkok',
  'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth',
  'Pacific/Auckland', 'Pacific/Honolulu',
];

export const BirthDataForm: React.FC<Props> = ({ data, onChange }) => {
  const astroProfiles = useSelector((state: RootState) => state.calendar.astroProfiles);
  const selectedProfileId = useSelector((state: RootState) => state.calendar.selectedAstroProfileId);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [selectedProfileIdLocal, setSelectedProfileIdLocal] = useState<string>(selectedProfileId || '');
  const [locationQuery, setLocationQuery] = useState(data.locationName);

  // Apply a profile's data to the form
  const applyProfile = (profile: AstroProfile | undefined) => {
    if (!profile) return;
    onChange({
      ...data,
      name: profile.name || '',
      birthDate: profile.birthDate || '',
      birthTime: profile.birthTime || '',
      locationName: profile.location?.name || '',
      latitude: profile.location?.latitude || 0,
      longitude: profile.location?.longitude || 0,
      timezone: profile.timezone || 'UTC',
    });
    setLocationQuery(profile.location?.name || '');
  };

  // On first mount: if there's a selected profile, apply it
  useEffect(() => {
    if (selectedProfileId && !data.name && !data.birthDate) {
      const profile = astroProfiles.find(p => p.id === selectedProfileId);
      if (profile) {
        applyProfile(profile);
        setSelectedProfileIdLocal(selectedProfileId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field: keyof CertificateData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.name.trim().length > 0 && data.birthDate.length > 0 && data.birthTime.length > 0;

  const hasProfiles = astroProfiles.length > 0;

  return (
    <div className="cert-form cert-fade-in">
      {/* Profile Selector */}
      {hasProfiles && (
        <div className="cert-form-section" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.02))', borderColor: 'rgba(212,175,55,0.15)' }}>
          <div className="cert-form-section-title">📋 Select a Saved Profile</div>
          <div className="cert-form-field cert-form-field--full">
            <select
              className="cert-profile-select"
              value={selectedProfileIdLocal}
              onChange={e => {
                const id = e.target.value;
                setSelectedProfileIdLocal(id);
                if (id) {
                  const profile = astroProfiles.find(p => p.id === id);
                  applyProfile(profile);
                }
              }}
            >
              <option value="">— Choose from your birth charts —</option>
              {astroProfiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.birthDate} · {p.location?.name || 'Unknown location'}
                </option>
              ))}
            </select>
            <div style={{ fontSize: 11, color: '#71717a', marginTop: 6 }}>
              Or fill in the details manually below.
            </div>
          </div>
        </div>
      )}

      {/* Personal Details */}
      <div className="cert-form-section">
        <div className="cert-form-section-title">Personal Details</div>
        <div className="cert-form-row">
          <div className="cert-form-field cert-form-field--full">
            <label>Full Name *</label>
            <input
              type="text"
              value={data.name}
              onChange={e => update('name', e.target.value)}
              onBlur={() => setTouched({ ...touched, name: true })}
              placeholder="Enter your full name"
            />
            {touched.name && !data.name.trim() && (
              <span className="cert-form-error">Name is required</span>
            )}
          </div>
        </div>
      </div>

      {/* Birth Details */}
      <div className="cert-form-section">
        <div className="cert-form-section-title">Birth Details</div>
        <div className="cert-form-row">
          <div className="cert-form-field">
            <label>Birth Date *</label>
            <input
              type="date"
              value={data.birthDate}
              onChange={e => update('birthDate', e.target.value)}
              onBlur={() => setTouched({ ...touched, birthDate: true })}
            />
          </div>
          <div className="cert-form-field">
            <label>Birth Time *</label>
            <input
              type="time"
              value={data.birthTime}
              onChange={e => update('birthTime', e.target.value)}
              onBlur={() => setTouched({ ...touched, birthTime: true })}
            />
          </div>
        </div>
        <div className="cert-form-row">
          <div className="cert-form-field cert-form-field--full">
            <label>Timezone</label>
            <select
              value={data.timezone}
              onChange={e => update('timezone', e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location with Autocomplete */}
      <div className="cert-form-section">
        <div className="cert-form-section-title">Birth Location</div>

        <div className="cert-form-field cert-form-field--full">
          <label>Search for your birthplace</label>
          <LocationSearch
            defaultValue={locationQuery}
            onLocationSelect={loc => {
              update('locationName', loc.name);
              update('latitude', loc.latitude);
              update('longitude', loc.longitude);
              setLocationQuery(loc.name);
            }}
            onQueryChange={setLocationQuery}
          />
        </div>

        {/* Manual coordinates — always editable as override */}
        <div className="cert-form-row" style={{ marginTop: 12 }}>
          <div className="cert-form-field">
            <label>Latitude <span className="cert-form-hint">(manual override)</span></label>
            <input
              type="number"
              step="0.0001"
              min={-90}
              max={90}
              value={data.latitude || ''}
              onChange={e => update('latitude', parseFloat(e.target.value) || 0)}
              placeholder="0.0000"
            />
          </div>
          <div className="cert-form-field">
            <label>Longitude <span className="cert-form-hint">(manual override)</span></label>
            <input
              type="number"
              step="0.0001"
              min={-180}
              max={180}
              value={data.longitude || ''}
              onChange={e => update('longitude', parseFloat(e.target.value) || 0)}
              placeholder="0.0000"
            />
          </div>
        </div>

        {/* Coordinate readout */}
        {(data.latitude !== 0 || data.longitude !== 0) && (
          <div className="cert-coord-readout">
            <span>📍 {data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</span>
            {data.locationName && <span> · {data.locationName}</span>}
          </div>
        )}
      </div>

      {/* Validation hint */}
      {!isValid && (
        <div style={{ fontSize: 12, color: '#71717a', textAlign: 'center' }}>
          Please fill in all required fields to continue.
        </div>
      )}
    </div>
  );
};

export default BirthDataForm;
