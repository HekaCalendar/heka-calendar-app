/**
 * Oracle Mode: Body Tracker
 * Wrapper for the TrackerPanel within Oracle Journal
 */

import { TrackerPanel } from '../../TrackerPanel';

interface OracleModeTrackerProps {
  date: string;
  onClose: () => void;
}

export const OracleModeTracker: React.FC<OracleModeTrackerProps> = ({
  date,
  onClose,
}) => {
  return (
    <div className="oracle-mode-tracker">
      <TrackerPanel
        date={date}
        isOpen={true}
        onClose={onClose}
      />
    </div>
  );
};

export default OracleModeTracker;
