/**
 * Diary Timeline Component
 * Chronological view of diary entries with celestial context
 */

import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { selectAllEntries } from '../store/diarySlice';
import { getThemeStyles, getFontStyles } from '../oracle/diaryTypes';
import '../styles/diary-timeline.css';

interface DiaryTimelineProps {
  onEntryClick?: (entryId: string) => void;
}

export const DiaryTimeline: React.FC<DiaryTimelineProps> = ({ onEntryClick }) => {
  const entries = useSelector((state: RootState) => selectAllEntries(state));
  const preferences = useSelector((state: RootState) => state.diary.preferences);

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Group entries by date
  const groupedEntries = sortedEntries.reduce((groups, entry) => {
    const date = entry.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, typeof sortedEntries>);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get moon phase icon
  const getMoonPhaseIcon = (phase?: string) => {
    if (!phase) return '🌙';
    const icons: Record<string, string> = {
      'new': '🌑',
      'waxing': '🌒',
      'first': '🌓',
      'gibbous': '🌔',
      'full': '🌕',
      'waning': '🌖',
      'last': '🌗',
      'crescent': '🌘',
      'New Moon': '🌑',
      'Waxing Crescent': '🌒',
      'First Quarter': '🌓',
      'Waxing Gibbous': '🌔',
      'Full Moon': '🌕',
      'Waning Gibbous': '🌖',
      'Last Quarter': '🌗',
      'Waning Crescent': '🌘',
    };
    return icons[phase] || '🌙';
  };

  if (entries.length === 0) {
    return (
      <div className="diary-timeline-empty">
        <div className="diary-timeline-empty-icon">📖</div>
        <h3>Your Diary Awaits</h3>
        <p>Begin your journey by writing your first entry.</p>
        <p className="diary-timeline-empty-hint">
          The Oracle will weave celestial insights into your words.
        </p>
      </div>
    );
  }

  return (
    <div className="diary-timeline">
      {Object.entries(groupedEntries).map(([date, dayEntries]) => (
        <div key={date} className="diary-timeline-day">
          {/* Date Header */}
          <div className="diary-timeline-date">
            <span className="diary-timeline-date-label">{formatDate(date)}</span>
            <span className="diary-timeline-date-entries">
              {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {/* Entries for this day */}
          <div className="diary-timeline-entries">
            {dayEntries.map((entry) => (
              <article
                key={entry.id}
                className="diary-timeline-entry"
                style={{
                  ...getThemeStyles(entry.theme || preferences.theme),
                  ...getFontStyles(entry.font || preferences.font),
                }}
                onClick={() => onEntryClick?.(entry.id)}
              >
                {/* Entry Header */}
                <div className="diary-entry-header">
                  <span className="diary-entry-time">
                    {formatTime(entry.timestamp)}
                  </span>
                  {entry.celestialContext?.moonPhase?.phase && (
                    <span className="diary-entry-moon" title={entry.celestialContext.moonPhase.phase}>
                      {getMoonPhaseIcon(entry.celestialContext.moonPhase.phase)}
                    </span>
                  )}
                </div>

                {/* Entry Content Preview */}
                <div className="diary-entry-preview">
                  <p>{entry.content.slice(0, 200)}</p>
                  {entry.content.length > 200 && (
                    <span className="diary-entry-more">...more</span>
                  )}
                </div>

                {/* Insight Preview */}
                {entry.insight && preferences.showInsights && (
                  <div className="diary-entry-insight-preview">
                    <span className="insight-preview-icon">✨</span>
                    <span className="insight-preview-text">
                      {entry.insight.text.slice(0, 80)}...
                    </span>
                    <span 
                      className="insight-preview-score"
                      style={{ color: (entry.insight.strengthScore || 70) >= 70 ? '#22c55e' : '#eab308' }}
                    >
                      {entry.insight.strengthScore || 70}%
                    </span>
                  </div>
                )}

                {/* Entry Footer */}
                <div className="diary-entry-footer">
                  <span className="diary-entry-wordcount">
                    {entry.content.split(/\s+/).length} words
                  </span>
                  {entry.insight?.userRating && (
                    <span className="diary-entry-rating">
                      {entry.insight.userRating === 'resonated' && '💫'}
                      {entry.insight.userRating === 'neutral' && '🤔'}
                      {entry.insight.userRating === 'dismissed' && '✕'}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}

      {/* End of Timeline */}
      <div className="diary-timeline-end">
        <span>✦ You've reached the beginning of your journey ✦</span>
      </div>
    </div>
  );
};

export default DiaryTimeline;
