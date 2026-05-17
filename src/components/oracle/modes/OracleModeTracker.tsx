/**
 * Oracle Mode: Community Hub
 * Wrapper for the CommunityHub within Oracle Journal
 */

import { CommunityHub } from '../../CommunityHub';

interface OracleModeTrackerProps {
  date: string;
  onClose?: () => void;
}

export function OracleModeTracker({ onClose }: OracleModeTrackerProps) {
  return (
    <div className="oracle-mode-tracker">
      <CommunityHub
        isOpen={true}
        onClose={onClose || (() => {})}
      />
    </div>
  );
}
