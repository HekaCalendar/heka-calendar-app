/**
 * AstrologyHub - Birth Chart Management
 * Simplified version for profile management
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../../store';
import { selectAllProfiles } from '../../store/selectors';
import { initializeAstrology } from '../../store/thunks';
import './StarsHub.css';

export const AstrologyHub: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector(selectAllProfiles);
  const { t } = useTranslation('celestial');
  
  useEffect(() => {
    dispatch(initializeAstrology());
  }, [dispatch]);
  
  return (
    <div className="stars-hub">
      <header className="sh-header">
        <div className="sh-header-left">
          <button className="sh-back" onClick={() => navigate('/')}>
            {t('starsHub.back')}
          </button>
        </div>
        <div className="sh-header-center">
          <h1>{t('starsHub.birthCharts')}</h1>
        </div>
        <div className="sh-header-right">
          <button className="sh-profile-btn" onClick={() => navigate('/stars')}>
            {t('starsHub.viewStars')}
          </button>
        </div>
      </header>
      
      <main className="sh-main" style={{ justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>☸</div>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#f8f7f5' }}>
            {t('starsHub.birthChartManagement')}
          </h2>
          <p style={{ fontSize: '15px', color: '#71717a', marginBottom: '32px' }}>
            {t('starsHub.savedProfiles', { count: profiles.length })}
            <br />
            {t('starsHub.goToStars')}
          </p>
          <button 
            className="sh-profile-btn" 
            onClick={() => navigate('/stars')}
            style={{ float: 'none', fontSize: '16px', padding: '14px 28px' }}
          >
            {t('starsHub.openCelestialIntelligence')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AstrologyHub;
