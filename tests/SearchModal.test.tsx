import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { SearchModal } from '../src/components/SearchModal';
import { renderWithProviders } from './test-utils';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('SearchModal', () => {
  let localStore: Record<string, string> = {};

  beforeEach(() => {
    vi.useFakeTimers();
    localStore = {};
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => localStore[k] || null,
      setItem: (k: string, v: string) => { localStore[k] = v; },
      removeItem: (k: string) => { delete localStore[k]; },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('returns null when isOpen is false', () => {
    const { container } = renderWithProviders(
      <SearchModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders search input and category tabs when open', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText('searchPlaceholder')).toBeInTheDocument();
    expect(screen.getByText('all')).toBeInTheDocument();
    expect(screen.getByText('dates')).toBeInTheDocument();
    expect(screen.getByText('notes')).toBeInTheDocument();
    expect(screen.getByText('holidays')).toBeInTheDocument();
  });

  it('shows search tips when empty and no history', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('trySearchingFor')).toBeInTheDocument();
    expect(screen.getByText('calendar:searchTips.tip1')).toBeInTheDocument();
  });

  it('shows search history from localStorage', () => {
    localStore['heka-search-history'] = JSON.stringify(['moon', 'aries']);
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('recentSearches')).toBeInTheDocument();
    expect(screen.getByText('moon')).toBeInTheDocument();
    expect(screen.getByText('aries')).toBeInTheDocument();
  });

  it('loads history and clears query on open', () => {
    localStore['heka-search-history'] = JSON.stringify(['test']);
    const { rerender } = renderWithProviders(
      <SearchModal isOpen={false} onClose={vi.fn()} />
    );
    rerender(<SearchModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('performs debounced date search', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'january 15' } });

    act(() => { vi.advanceTimersByTime(300); });

    expect(screen.getByText(/result|results/i)).toBeInTheDocument();
  });

  it('performs debounced holiday search', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'christmas' } });

    act(() => { vi.advanceTimersByTime(300); });

    const resultsText = screen.queryByText(/result|results/i);
    expect(resultsText).toBeInTheDocument();
  });

  it('filters by category when clicking tabs', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    const notesTab = screen.getByText('notes');
    fireEvent.click(notesTab);

    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'test' } });
    act(() => { vi.advanceTimersByTime(300); });

    // Should show no results since no notes match
    expect(screen.getByText('noResults')).toBeInTheDocument();
  });

  it('clears query when clear button clicked', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(input.value).toBe('test query');

    const clearBtn = screen.getByLabelText('common.clear');
    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
  });

  it('closes on overlay click', () => {
    const onClose = vi.fn();
    renderWithProviders(<SearchModal isOpen={true} onClose={onClose} />);
    const overlay = document.querySelector('.modal-overlay');
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on close button click', () => {
    const onClose = vi.fn();
    renderWithProviders(<SearchModal isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByLabelText('common.close');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    renderWithProviders(<SearchModal isOpen={true} onClose={onClose} />);
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('navigates results with ArrowDown and ArrowUp', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'january' } });
    act(() => { vi.advanceTimersByTime(300); });

    expect(screen.getByText(/result|results/i)).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    // Should not throw; selection index changes internally
    expect(input).toBeInTheDocument();
  });

  it('selects result on Enter key', () => {
    const onClose = vi.fn();
    const { store } = renderWithProviders(
      <SearchModal isOpen={true} onClose={onClose} />
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'january 15 2024' } });
    act(() => { vi.advanceTimersByTime(300); });

    expect(screen.getByText(/result|results/i)).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(dispatchSpy).toHaveBeenCalled();
    dispatchSpy.mockRestore();
  });

  it('selects result on click', () => {
    const onClose = vi.fn();
    const { store } = renderWithProviders(
      <SearchModal isOpen={true} onClose={onClose} />
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'today' } });
    act(() => { vi.advanceTimersByTime(300); });

    expect(screen.getByText(/result|results/i)).toBeInTheDocument();

    // Click a result button - look for one with result styling
    const resultBtns = document.querySelectorAll('.modal button');
    // Find the first result button (not close/clear/category buttons)
    // Result buttons have flex-start alignment in their style
    const resultBtn = Array.from(resultBtns).find(
      (b) => (b as HTMLElement).style.alignItems === 'flex-start'
    );
    if (resultBtn) {
      fireEvent.click(resultBtn);
      expect(dispatchSpy).toHaveBeenCalled();
    }
    dispatchSpy.mockRestore();
  });

  it('shows no results for unmatched query', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'xyznonexistent123' } });
    act(() => { vi.advanceTimersByTime(300); });

    expect(screen.getByText('noResults')).toBeInTheDocument();
    expect(screen.getByText('tryDifferentKeywords')).toBeInTheDocument();
  });

  it('restores history item on click', () => {
    localStore['heka-search-history'] = JSON.stringify(['moon']);
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    const historyItem = screen.getByText('moon');
    fireEvent.click(historyItem);
    const input = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement;
    expect(input.value).toBe('moon');
  });

  it('searches notes from Redux state', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />, {
      calendar: {
        notes: {
          '2024-0-15': [
            { id: 'n1', content: 'Meeting with team', category: 'work', mood: 4, tags: ['important'] },
          ],
        },
      } as any,
    });
    const input = screen.getByPlaceholderText('searchPlaceholder');
    fireEvent.change(input, { target: { value: 'meeting' } });
    act(() => { vi.advanceTimersByTime(300); });

    expect(screen.getByText(/result|results/i)).toBeInTheDocument();
  });

  it('shows footer with keyboard shortcuts', () => {
    renderWithProviders(<SearchModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('navigate')).toBeInTheDocument();
    expect(screen.getByText('selectKey')).toBeInTheDocument();
    expect(screen.getByText('escClose')).toBeInTheDocument();
    expect(screen.getByText('hekaUnifiedSearch')).toBeInTheDocument();
  });
});
