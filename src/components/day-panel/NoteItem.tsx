/**
 * Note Item Component
 * Individual note or task display with long-press selection and tap interactions
 */

import { memo, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { NoteItemProps } from './types';
import { MOOD_EMOJIS, MOOD_LABELS } from './constants';
import { NOTE_CATEGORIES } from '../../types';

function isPlannerTask(item: any): item is { isTask: true; isCompleted: boolean; dueTime?: string; celestialContext?: { moonPhase: string; sunSign: string } } {
  return item && 'isTask' in item && item.isTask === true;
}

export const NoteItem = memo(({
  item,
  index,
  isSelected,
  isSelectionMode,
  onDelete,
  onLongPress,
  onToggleSelect,
  onToggleComplete,
  onDoubleTap,
}: NoteItemProps) => {
  const { t } = useTranslation('dayPanel');
  const categoryInfo = NOTE_CATEGORIES.find(c => c.id === item.category);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const lastTap = useRef(0);

  const task = isPlannerTask(item) ? item : null;

  const handleMouseDown = useCallback(() => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, 500);
  }, [onLongPress]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (isSelectionMode) {
      onToggleSelect();
      return;
    }

    if (isLongPress.current) return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap
      if (onDoubleTap) {
        onDoubleTap();
      }
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }, [isSelectionMode, onToggleSelect, onDoubleTap]);

  const handleTouchStart = useCallback(() => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, 500);
  }, [onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  const handleCheckboxClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (onToggleComplete) {
      onToggleComplete();
    }
  }, [onToggleComplete]);

  return (
    <div
      className={`note-item ${isSelected ? 'note-item--selected' : ''} ${isSelectionMode ? 'note-item--selectable' : ''} ${task && task.isCompleted ? 'note-item--completed' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{
        opacity: task && task.isCompleted ? 0.7 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {isSelectionMode && (
        <div className={`note-item__checkbox ${isSelected ? 'checked' : ''}`}>
          {isSelected && '✓'}
        </div>
      )}

      {task && !isSelectionMode && (
        <button
          className="task-checkbox"
          onClick={handleCheckboxClick}
          onTouchStart={(e) => {
            e.stopPropagation();
            if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
              longPressTimer.current = null;
            }
          }}
          style={{
            width: 22,
            height: 22,
            borderRadius: '6px',
            border: `2px solid ${task.isCompleted ? '#22c55e' : 'rgba(255,255,255,0.25)'}`,
            background: task.isCompleted ? 'rgba(34,197,94,0.15)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22c55e',
            fontSize: '14px',
            cursor: 'pointer',
            flexShrink: 0,
            marginRight: '0.5rem',
          }}
          title={task.isCompleted ? t('noteItem.completed') : t('noteItem.markComplete')}
          type="button"
        >
          {task.isCompleted && '✓'}
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="note-item__header">
          <span className="note-item__number">#{index + 1}</span>
          {item.mood && (
            <span className="note-item__mood" title={MOOD_LABELS[item.mood]}>
              {MOOD_EMOJIS[item.mood]}
            </span>
          )}
          {categoryInfo && (
            <span
              className="note-item__category"
              style={{
                background: `${categoryInfo.color}20`,
                borderColor: categoryInfo.color,
                color: categoryInfo.color,
              }}
            >
              {categoryInfo.icon} {categoryInfo.name}
            </span>
          )}
          {task && task.dueTime && (
            <span
              className="task-time-badge"
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '6px',
                color: '#f8f7f5',
                whiteSpace: 'nowrap',
              }}
            >
              ⏰ {task.dueTime}
            </span>
          )}
          {task && task.celestialContext && (
            <span
              className="task-celestial-badge"
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: '6px',
                color: '#f8f7f5',
                whiteSpace: 'nowrap',
              }}
              title={`Sun in ${task.celestialContext.sunSign}`}
            >
              🌙 {task.celestialContext.moonPhase.replace('-', ' ')}
            </span>
          )}
          {!isSelectionMode && (
            <button
              className="note-item__delete"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                if (longPressTimer.current) {
                  clearTimeout(longPressTimer.current);
                  longPressTimer.current = null;
                }
              }}
              title={t('noteItem.delete')}
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <div
          className="note-item__content"
          style={{
            textDecoration: task && task.isCompleted ? 'line-through' : 'none',
            color: task && task.isCompleted ? '#a1a1aa' : undefined,
          }}
        >
          {item.content}
        </div>
        <div className="note-item__time">
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {task && (
            <span style={{ marginLeft: 8, color: task.isCompleted ? '#22c55e' : '#a1a1aa' }}>
              {task.isCompleted ? `· ${t('noteItem.completed')}` : `· ${t('noteItem.task')}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

NoteItem.displayName = 'NoteItem';

export default NoteItem;
