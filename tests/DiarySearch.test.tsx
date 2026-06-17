import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { DiarySearch } from '../src/components/DiarySearch';
import { renderWithProviders } from './test-utils';

vi.mock('../src/i18n', () => ({
  default: {
    t: (key: string) => key,
    language: 'en',
  },
}));

describe('DiarySearch', () => {
  const mockDiaryEntries = {
    'entry-1': {
      id: 'entry-1',
      date: '2024-06-10',
      timestamp: '2024-06-10T10:00:00.000Z',
      content: 'Morning meditation was peaceful and enlightening',
      insight: { text: 'You are finding inner calm', userRating: 'resonated' },
      tags: ['meditation', 'morning'],
    },
    'entry-2': {
      id: 'entry-2',
      date: '2024-06-08',
      timestamp: '2024-06-08T14:00:00.000Z',
      content: 'Had a difficult conversation at work today',
      insight: { text: 'Growth comes from discomfort' },
      tags: ['work', 'growth'],
    },
    'entry-3': {
      id: 'entry-3',
      date: '2024-05-01',
      timestamp: '2024-05-01T09:00:00.000Z',
      content: 'Spring cleaning and organizing my space',
      tags: ['home'],
    },
  };

  const mockCalendarNotes = [
    {
      id: 'note-1',
      date: '2024-06-12',
      timestamp: '2024-06-12T08:00:00.000Z',
      content: 'Meeting with the team about project timeline',
      category: 'work',
      mood: 4,
      isCalendarNote: true as const,
      sourceKey: '2024-5-12',
    },
    {
      id: 'note-2',
      date: '2024-06-05',
      timestamp: '2024-06-05T20:00:00.000Z',
      content: 'Dinner with family was wonderful',
      category: 'family',
      mood: 5,
      isCalendarNote: true as const,
      sourceKey: '2024-5-5',
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when isOpen is false', () => {
    const { container } = renderWithProviders(
      <DiarySearch isOpen={false} onClose={vi.fn()} onEntrySelect={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders search modal when open', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    expect(document.querySelector('.diary-search-overlay')).toBeInTheDocument();
    expect(document.querySelector('.diary-search-input')).toBeInTheDocument();
    expect(document.querySelector('.diary-search-close')).toBeInTheDocument();
  });

  it('shows diary entries from Redux by default', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    expect(screen.getByText('Morning meditation was peaceful and enlightening')).toBeInTheDocument();
    expect(screen.getByText('Had a difficult conversation at work today')).toBeInTheDocument();
  });

  it('shows calendar notes when provided', () => {
    renderWithProviders(
      <DiarySearch
        isOpen={true}
        onClose={vi.fn()}
        onEntrySelect={vi.fn()}
        calendarNotes={mockCalendarNotes}
      />,
      { diary: { entries: {} } as any }
    );
    expect(screen.getByText('Meeting with the team about project timeline')).toBeInTheDocument();
    expect(screen.getByText('Dinner with family was wonderful')).toBeInTheDocument();
  });

  it('filters by text query', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const input = document.querySelector('.diary-search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'meditation' } });

    // Text is split by <mark> — use queryAllByText which handles multiples
    expect(screen.queryAllByText(/Morning/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/meditation/).length).toBeGreaterThan(0);
    // Entry-2 should be filtered out
    expect(screen.queryByText(/difficult conversation/)).not.toBeInTheDocument();
  });

  it('filters by source diary only', () => {
    renderWithProviders(
      <DiarySearch
        isOpen={true}
        onClose={vi.fn()}
        onEntrySelect={vi.fn()}
        calendarNotes={mockCalendarNotes}
      />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const select = document.querySelectorAll('.diary-search-filters select')[0];
    fireEvent.change(select, { target: { value: 'diary' } });

    expect(screen.getByText('Morning meditation was peaceful and enlightening')).toBeInTheDocument();
    expect(screen.queryByText('Meeting with the team about project timeline')).not.toBeInTheDocument();
  });

  it('filters by source calendar only', () => {
    renderWithProviders(
      <DiarySearch
        isOpen={true}
        onClose={vi.fn()}
        onEntrySelect={vi.fn()}
        calendarNotes={mockCalendarNotes}
      />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const select = document.querySelectorAll('.diary-search-filters select')[0];
    fireEvent.change(select, { target: { value: 'calendar' } });

    expect(screen.getByText('Meeting with the team about project timeline')).toBeInTheDocument();
    expect(screen.queryByText('Morning meditation was peaceful and enlightening')).not.toBeInTheDocument();
  });

  it('filters by date range week', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const timeSelect = document.querySelectorAll('.diary-search-filters select')[1];
    fireEvent.change(timeSelect, { target: { value: 'week' } });

    // entry-1 is June 10 (within last 7 days from June 15)
    expect(screen.getByText('Morning meditation was peaceful and enlightening')).toBeInTheDocument();
    // entry-3 is May 1 (outside last 7 days)
    expect(screen.queryByText('Spring cleaning and organizing my space')).not.toBeInTheDocument();
  });

  it('filters by date range month', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const timeSelect = document.querySelectorAll('.diary-search-filters select')[1];
    fireEvent.change(timeSelect, { target: { value: 'month' } });

    expect(screen.getByText('Morning meditation was peaceful and enlightening')).toBeInTheDocument();
    expect(screen.getByText('Had a difficult conversation at work today')).toBeInTheDocument();
    // entry-3 is May 1 (outside last 30 days from June 15)
    expect(screen.queryByText('Spring cleaning and organizing my space')).not.toBeInTheDocument();
  });

  it('shows empty state when no results match', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const input = document.querySelector('.diary-search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });

    expect(screen.getByText('No entries found')).toBeInTheDocument();
  });

  it('calls onEntrySelect and onClose when clicking a diary result', () => {
    const onEntrySelect = vi.fn();
    const onClose = vi.fn();
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={onClose} onEntrySelect={onEntrySelect} />,
      { diary: { entries: mockDiaryEntries } as any }
    );

    const result = screen.getByText('Morning meditation was peaceful and enlightening');
    fireEvent.click(result.closest('.diary-search-result')!);

    expect(onEntrySelect).toHaveBeenCalledWith('entry-1');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onCalendarNoteSelect and onClose when clicking a calendar result', () => {
    const onEntrySelect = vi.fn();
    const onCalendarNoteSelect = vi.fn();
    const onClose = vi.fn();
    renderWithProviders(
      <DiarySearch
        isOpen={true}
        onClose={onClose}
        onEntrySelect={onEntrySelect}
        onCalendarNoteSelect={onCalendarNoteSelect}
        calendarNotes={mockCalendarNotes}
      />,
      { diary: { entries: {} } as any }
    );

    const result = screen.getByText('Meeting with the team about project timeline');
    fireEvent.click(result.closest('.diary-search-result')!);

    expect(onCalendarNoteSelect).toHaveBeenCalledWith('2024-5-12');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clears query when clear button clicked', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const input = document.querySelector('.diary-search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');

    const clearBtn = document.querySelector('.diary-search-clear');
    fireEvent.click(clearBtn!);
    expect(input.value).toBe('');
  });

  it('clears all filters when reset button clicked', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const input = document.querySelector('.diary-search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });

    const sourceSelect = document.querySelectorAll('.diary-search-filters select')[0];
    fireEvent.change(sourceSelect, { target: { value: 'diary' } });

    const resetBtn = document.querySelector('.diary-search-reset');
    fireEvent.click(resetBtn!);

    expect(input.value).toBe('');
    expect((sourceSelect as HTMLSelectElement).value).toBe('all');
  });

  it('closes on overlay click', () => {
    const onClose = vi.fn();
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={onClose} onEntrySelect={vi.fn()} />
    );
    const overlay = document.querySelector('.diary-search-overlay');
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside modal', () => {
    const onClose = vi.fn();
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={onClose} onEntrySelect={vi.fn()} />
    );
    const modal = document.querySelector('.diary-search-modal');
    fireEvent.click(modal!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('handles theme as string', () => {
    const { container } = renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} theme="day" />
    );
    expect(container.querySelector('.journal-theme-day')).toBeInTheDocument();
  });

  it('handles theme as object', () => {
    const { container } = renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} theme={{ id: 'celestial' }} />
    );
    expect(container.querySelector('.journal-theme-celestial')).toBeInTheDocument();
  });

  it('shows insight badges for diary entries', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    // entry-1 has resonated insight → 💫 badge
    const resonatedBadges = document.querySelectorAll('.diary-search-result-badge.resonated');
    expect(resonatedBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows mood emoji for calendar notes', () => {
    renderWithProviders(
      <DiarySearch
        isOpen={true}
        onClose={vi.fn()}
        onEntrySelect={vi.fn()}
        calendarNotes={mockCalendarNotes}
      />,
      { diary: { entries: {} } as any }
    );
    // note-1 has mood 4 → 🙂
    expect(screen.getByText('🙂')).toBeInTheDocument();
    // note-2 has mood 5 → 😄
    expect(screen.getByText('😄')).toBeInTheDocument();
  });

  it('highlights matched text in results', () => {
    renderWithProviders(
      <DiarySearch isOpen={true} onClose={vi.fn()} onEntrySelect={vi.fn()} />,
      { diary: { entries: mockDiaryEntries } as any }
    );
    const input = document.querySelector('.diary-search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'meditation' } });

    const marks = document.querySelectorAll('mark.diary-search-highlight');
    expect(marks.length).toBeGreaterThan(0);
  });
});
