/**
 * HeaderGeometry — Redux-connected wrapper that renders the chosen header pattern
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SacredGeometry } from './SacredGeometry';

interface HeaderGeometryProps {
  isPureMode?: boolean;
}

export const HeaderGeometry: React.FC<HeaderGeometryProps> = ({ isPureMode }) => {
  const pattern = useSelector((state: RootState) => state.calendar.headerGeometry);
  if (isPureMode) return null;
  if (pattern === 'none') return null;
  return (
    <div className="sacred-header" aria-hidden="true">
      <div className="sacred-header__motion">
        <SacredGeometry pattern={pattern} variant="header" />
      </div>
    </div>
  );
};

export default HeaderGeometry;
