import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { OracleModeDailyDraw } from '../src/components/oracle/dailyOracle/OracleModeDailyDraw';
import type { DailyOracleCard } from '../src/components/oracle/dailyOracle/cardEngine';

// Stable mock translation function — must keep the same reference across renders
const stableT = vi.fn((key: string) => key);

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockGetTodaysCard = vi.fn();
const mockSaveCard = vi.fn();
const mockGenerateCard = vi.fn();
const mockGetTodayKey = vi.fn().mockReturnValue('2026-06-08');
const mockGetArchetypeById = vi.fn();
const mockGetPositions = vi.fn();

vi.mock('../src/components/oracle/dailyOracle/cardDatabase', () => ({
  dbGetTodaysCard: (...args: any[]) => mockGetTodaysCard(...args),
  dbSaveCard: (...args: any[]) => mockSaveCard(...args),
}));

vi.mock('../src/components/oracle/dailyOracle/cardEngine', () => ({
  generateCard: (...args: any[]) => mockGenerateCard(...args),
  getTodayKey: () => mockGetTodayKey(),
}));

vi.mock('../src/components/oracle/dailyOracle/archetypes', () => ({
  getArchetypeById: (...args: any[]) => mockGetArchetypeById(...args),
  ORACLE_ARCHETYPES: [
    {
      id: 'new-moon',
      name: 'The Seed',
      names: ['The Seed'],
      number: 0,
      element: 'void',
      modality: 'void',
      keywords: ['beginning'],
      symbol: '🌑',
      artwork: {
        baseShape: 'circle',
        primaryGradient: ['#000', '#fff'],
        secondaryGradient: ['#000', '#fff'],
        particleCount: 10,
        hasRing: false,
        hasRays: false,
        hasMandala: false,
      },
      insights: ['A new beginning awaits.'],
      shadows: ['Fear of the unknown.'],
      invitations: ['Plant a seed today.'],
      journalPrompts: ['What are you beginning?'],
      affirmations: ['I embrace new beginnings.'],
    },
  ],
}));

vi.mock('../src/oracle/birthChartIntegration', () => ({
  getCurrentPlanetaryPositions: (...args: any[]) => mockGetPositions(...args),
}));

vi.mock('../src/components/oracle/dailyOracle/OracleCardArtwork', () => ({
  OracleCardArtwork: ({ archetype, seed, size, revealed }: any) => (
    <div data-testid="card-artwork" data-archetype={archetype?.id} data-seed={seed} data-size={size} data-revealed={revealed}>
      🎨 {archetype?.name}
    </div>
  ),
}));

vi.mock('../src/components/oracle/dailyOracle/OracleCardArchive', () => ({
  OracleCardArchive: ({ onClose }: any) => (
    <div data-testid="card-archive">
      <button onClick={onClose}>Close Archive</button>
    </div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: stableT,
    i18n: { language: 'en' },
  }),
}));

vi.mock('react-redux', () => ({
  useSelector: (fn: any) =>
    fn({
      calendar: {
        astroPreferences: { zodiacFrame: 'tropical', signCount: 12 },
      },
    }),
}));

// ─── Test Data ───────────────────────────────────────────────────────────────

const mockCard: DailyOracleCard = {
  id: 'oracle-2026-06-08',
  date: '2026-06-08',
  drawDate: '2026-06-08T00:00:00.000Z',
  archetypeId: 'new-moon',
  archetypeName: 'The Seed',
  archetypeNumber: 0,
  element: 'void',
  modality: 'void',
  symbol: '🌑',
  keywords: ['beginning'],
  title: 'The Seed',
  insight: 'A new beginning awaits.',
  shadow: 'Fear of the unknown.',
  invitation: 'Plant a seed today.',
  journalPrompt: 'What are you beginning?',
  affirmation: 'I embrace new beginnings.',
  cosmicContext: 'Quiet sky · void energy',
  artworkSeed: 'new-moon-123',
  isDrawn: true,
  isRevealed: false,
};

const mockRevealedCard: DailyOracleCard = {
  ...mockCard,
  isRevealed: true,
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('OracleModeDailyDraw', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTodayKey.mockReturnValue('2026-06-08');
    mockGetArchetypeById.mockReturnValue({
      id: 'new-moon',
      name: 'The Seed',
      symbol: '🌑',
    });
  });

  it('shows loading state on initial mount', async () => {
    // Never resolve so we stay in loading
    mockGetTodaysCard.mockImplementation(() => new Promise(() => {}));

    render(<OracleModeDailyDraw onJournalPrompt={() => {}} />);

    expect(screen.getByText('dailyOracle.consultingOracle')).toBeInTheDocument();
  });

  it('loads existing card from database and stops loading', async () => {
    mockGetTodaysCard.mockResolvedValue(mockRevealedCard);

    render(<OracleModeDailyDraw onJournalPrompt={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText('dailyOracle.consultingOracle')).not.toBeInTheDocument();
    });

    // Card should be visible (revealed state shows title)
    expect(screen.getByText('The Seed')).toBeInTheDocument();
    expect(mockGetTodaysCard).toHaveBeenCalledTimes(1);
  });

  it('generates a new card when none exists for today', async () => {
    mockGetTodaysCard.mockResolvedValue(undefined);
    mockGetPositions.mockResolvedValue({
      Sun: { longitude: 0, sign: 'Aries' },
      Moon: { longitude: 180, sign: 'Libra' },
    });
    mockGenerateCard.mockReturnValue(mockCard);
    mockSaveCard.mockResolvedValue(undefined);

    render(<OracleModeDailyDraw onJournalPrompt={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText('dailyOracle.consultingOracle')).not.toBeInTheDocument();
    });

    expect(mockGetTodaysCard).toHaveBeenCalledTimes(1);
    expect(mockGetPositions).toHaveBeenCalledTimes(1);
    expect(mockGenerateCard).toHaveBeenCalledTimes(1);
    expect(mockSaveCard).toHaveBeenCalledTimes(1);
  });

  it('does NOT call loadOrGenerateCard more than once on stable renders (no infinite loop)', async () => {
    mockGetTodaysCard.mockResolvedValue(mockRevealedCard);

    render(<OracleModeDailyDraw onJournalPrompt={() => {}} />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.queryByText('dailyOracle.consultingOracle')).not.toBeInTheDocument();
    });

    // Give React a few ticks to re-render if it wanted to loop
    await act(async () => {
      await new Promise((r) => setTimeout(r, 300));
    });

    // Should still only be called once — the bug caused it to be called
    // in a tight loop because zodiacOptions was a new object every render.
    expect(mockGetTodaysCard).toHaveBeenCalledTimes(1);
  });

  it('shows error state when card generation fails', async () => {
    mockGetTodaysCard.mockRejectedValue(new Error('DB down'));

    render(<OracleModeDailyDraw onJournalPrompt={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText('dailyOracle.consultingOracle')).not.toBeInTheDocument();
    });

    expect(screen.getByText('dailyOracle.loadError')).toBeInTheDocument();
    expect(screen.getByText('dailyOracle.retry')).toBeInTheDocument();
  });

  it('allows revealing a hidden card and persists the revealed state', async () => {
    mockGetTodaysCard.mockResolvedValue(mockCard);
    mockSaveCard.mockResolvedValue(undefined);

    render(<OracleModeDailyDraw onJournalPrompt={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText('dailyOracle.consultingOracle')).not.toBeInTheDocument();
    });

    const revealBtn = screen.getByText('dailyOracle.revealCard');
    await act(async () => {
      fireEvent.click(revealBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('The Seed')).toBeInTheDocument();
    });

    expect(mockSaveCard).toHaveBeenCalledWith(
      expect.objectContaining({ isRevealed: true })
    );
  });

  it('opens and closes the archive view', async () => {
    mockGetTodaysCard.mockResolvedValue(mockRevealedCard);

    render(<OracleModeDailyDraw onJournalPrompt={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText('dailyOracle.consultingOracle')).not.toBeInTheDocument();
    });

    const archiveBtn = screen.getByText(/dailyOracle\.archive/);
    await act(async () => {
      fireEvent.click(archiveBtn);
    });

    expect(screen.getByTestId('card-archive')).toBeInTheDocument();

    const closeBtn = screen.getByText('Close Archive');
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    expect(screen.queryByTestId('card-archive')).not.toBeInTheDocument();
  });

  it('triggers journal prompt callback when journal button is clicked', async () => {
    const onJournalPrompt = vi.fn();
    mockGetTodaysCard.mockResolvedValue({ ...mockCard, isRevealed: true });

    render(<OracleModeDailyDraw onJournalPrompt={onJournalPrompt} />);

    await waitFor(() => {
      expect(screen.queryByText('dailyOracle.consultingOracle')).not.toBeInTheDocument();
    });

    const journalBtn = screen.getByText('dailyOracle.journalAboutThis');
    await act(async () => {
      fireEvent.click(journalBtn);
    });

    expect(onJournalPrompt).toHaveBeenCalledWith('What are you beginning?');
  });
});
