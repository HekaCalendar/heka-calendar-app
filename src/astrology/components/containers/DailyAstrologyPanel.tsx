/**
 * Daily Astrology Panel - Simplified
 */

import React from 'react';

interface Props {
  selectedDate?: Date;
}

export const DailyAstrologyPanel: React.FC<Props> = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: '#71717a' }}>
      <p>Daily guidance available in Stars section</p>
    </div>
  );
};

export default DailyAstrologyPanel;
