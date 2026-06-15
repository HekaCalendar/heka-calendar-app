/**
 * SacredField — Background sacred geometry field
 *
 * Delegates to the original hex-flower-grid component for the default pattern,
 * or renders a custom SacredGeometry pattern for non-default selections.
 */

import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SacredGeometry } from './SacredGeometry';

// Import the original hex grid component
import { SacredField as OriginalSacredField } from '../SacredField';

interface SacredFieldProps {
  isPureMode?: boolean;
}

export const SacredField: React.FC<SacredFieldProps> = memo(({ isPureMode }) => {
  const pattern = useSelector((state: RootState) => state.calendar.backgroundGeometry);

  // Pure mode hides all decorative geometry
  if (isPureMode) return null;

  // User selected "None"
  if (pattern === 'none') return null;

  // Use the original meticulously-crafted hex grid for the default
  if (pattern === 'hex-flower-grid') {
    return <OriginalSacredField />;
  }

  // Otherwise render one of the new patterns with its unique animation
  return (
    <div className="sacred-field" data-pattern={pattern} aria-hidden="true">
      <SacredGeometry pattern={pattern} variant="background" />
    </div>
  );
});

SacredField.displayName = 'SacredField';

export default SacredField;
