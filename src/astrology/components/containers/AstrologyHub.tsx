/**
 * AstrologyHub - Birth Chart Management
 * Simplified version for profile management
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { selectAllProfiles } from '../../store/selectors';
import { initializeAstrology } from '../../store/thunks';
import './StarsHub.css';

export const AstrologyHub: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector(selectAllProfiles);
  
  useEffect(() => {
    dispatch(initializeAstrology());
  }, [dispatch]);
  
  return (
    <div className="stars-hub">
      <header className="sh-header">
        <div className="sh-header-left">
          <button className="sh-back" onClick={() => navigate('/')}>
            ← Back
          </button>
        </div>
        <div className="sh-header-center">
          <h1>Birth Charts</h1>
        </div>
        <div className="sh-header-right">
          <button className="sh-profile-btn" onClick={() => navigate('/stars')}>
            View Stars →
          </button>
        </div>
      </header>
      
      <main className="sh-main" style={{ justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>☸</div>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#f8f7f5' }}>
            Birth Chart Management
          </h2>
          <p style={{ fontSize: '15px', color: '#71717a', marginBottom: '32px' }}>
            You have {profiles.length} saved profile{profiles.length !== 1 ? 's' : ''}.
            <br />
            Go to Stars to see your personalized astrological guidance.
          </p>
          <button 
            className="sh-profile-btn" 
            onClick={() => navigate('/stars')}
            style={{ float: 'none', fontSize: '16px', padding: '14px 28px' }}
          >
            Open Celestial Intelligence ✦
          </button>
        </div>
      </main>
    </div>
  );
};

export default AstrologyHub;
