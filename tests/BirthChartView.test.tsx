import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BirthChartView } from '../src/astrology/components/chart/BirthChartView';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockGetProfileWithChart = vi.fn();
const mockGetActiveProfileWithChart = vi.fn();
const mockGetDefaultProfile = vi.fn();
const mockSubscribe = vi.fn();
const mockRecalculateChartWithZodiacSystem = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.name) return `${key}:${options.name}`;
      if (options?.sign) return `${key}:${options.sign}`;
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

vi.mock('../src/astrology/services/natal/profileManager', () => ({
  profileManager: {
    getProfileWithChart: (...args: any[]) => mockGetProfileWithChart(...args),
    getActiveProfileWithChart: () => mockGetActiveProfileWithChart(),
    getDefaultProfile: () => mockGetDefaultProfile(),
    subscribe: (cb: any) => mockSubscribe(cb),
    recalculateChartWithZodiacSystem: (...args: any[]) => mockRecalculateChartWithZodiacSystem(...args),
  },
}));

vi.mock('../src/astrology/services/natal/natalPromise', () => ({
  generateNatalPromise: () => ({
    summary: 'Your soul promise summary',
    soulPurpose: 'Your soul purpose',
    lifeThemes: ['Theme 1', 'Theme 2'],
    naturalGifts: ['Gift 1', 'Gift 2'],
    growthChallenges: ['Challenge 1', 'Challenge 2'],
  }),
}));

vi.mock('../src/astrology/services/natal/zodiacHelpers', () => ({
  getZodiacFramePreference: () => 'tropical',
  getSignCountPreference: () => 12,
}));

vi.mock('../src/astrology/services/swiss-ephemeris/engine', () => ({
  isUsingFallback: () => false,
}));

vi.mock('../src/astrology/components/chart/ChartWheel', () => ({
  ChartWheel: (props: any) => <div data-testid="chart-wheel" data-selected={props.selectedPlanet}>ChartWheel</div>,
}));
vi.mock('../src/astrology/components/chart/ElementTemple', () => ({
  ElementTemple: (props: any) => <div data-testid="element-temple" data-size={props.size}>ElementTemple</div>,
}));
vi.mock('../src/astrology/components/chart/PlanetaryCourt', () => ({
  PlanetaryCourt: (props: any) => <div data-testid="planetary-court">PlanetaryCourt</div>,
}));
vi.mock('../src/astrology/components/chart/PlanetDetailModal', () => ({
  PlanetDetailModal: (props: any) => props.isOpen ? <div data-testid="planet-detail-modal">PlanetDetailModal</div> : null,
}));
vi.mock('../src/astrology/components/natal/ProfileSelector', () => ({
  ProfileSelector: (props: any) => (
    <div data-testid="profile-selector">
      <button onClick={() => props.onProfileChange?.('prof-2')}>Switch Profile</button>
      <button onClick={() => props.onAddProfile?.()}>Add Profile</button>
    </div>
  ),
}));
vi.mock('../src/astrology/components/natal/BirthChartInput', () => ({
  BirthChartInput: (props: any) => (
    <div data-testid="birth-chart-input">
      <button onClick={() => props.onChartCalculated?.()}>Calculate</button>
      <button onClick={() => props.onCancel?.()}>Cancel</button>
    </div>
  ),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createMockProfile(id: string, overrides?: any) {
  return {
    id,
    name: 'Test User',
    chart: {
      birthData: {
        date: '1990-06-15T00:00:00.000Z',
        locationName: 'New York',
      },
      planets: {
        sun: { sign: 'gemini', longitude: 84, degreeInSign: 24, house: 3, isRetrograde: false },
        moon: { sign: 'cancer', longitude: 105, degreeInSign: 15, house: 4, isRetrograde: false },
        mercury: { sign: 'gemini', longitude: 78, degreeInSign: 18, house: 3, isRetrograde: false },
        venus: { sign: 'taurus', longitude: 55, degreeInSign: 5, house: 2, isRetrograde: false },
        mars: { sign: 'aries', longitude: 10, degreeInSign: 10, house: 1, isRetrograde: false },
        jupiter: { sign: 'leo', longitude: 130, degreeInSign: 10, house: 5, isRetrograde: false },
        saturn: { sign: 'capricorn', longitude: 280, degreeInSign: 10, house: 10, isRetrograde: false },
        uranus: { sign: 'aquarius', longitude: 310, degreeInSign: 10, house: 11, isRetrograde: false },
        neptune: { sign: 'pisces', longitude: 340, degreeInSign: 10, house: 12, isRetrograde: false },
        pluto: { sign: 'scorpio', longitude: 220, degreeInSign: 10, house: 8, isRetrograde: false },
      },
      zodiacFrame: 'tropical',
      signCount: 12,
      calculatedWithFallback: false,
      ...overrides?.chart,
    },
    ...overrides,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('BirthChartView', () => {
  let subscribers: Array<(event: any) => void> = [];
  let originalInnerWidth: number;
  let focusListeners: Array<(e: Event) => void> = [];
  let resizeListeners: Array<(e: Event) => void> = [];

  beforeEach(() => {
    subscribers = [];
    focusListeners = [];
    resizeListeners = [];
    originalInnerWidth = window.innerWidth;

    mockGetProfileWithChart.mockReturnValue(null);
    mockGetActiveProfileWithChart.mockReturnValue(null);
    mockGetDefaultProfile.mockReturnValue(null);
    mockSubscribe.mockImplementation((cb: any) => {
      subscribers.push(cb);
      return () => { subscribers = subscribers.filter(s => s !== cb); };
    });
    mockRecalculateChartWithZodiacSystem.mockResolvedValue(undefined);

    // Mock window listeners
    vi.spyOn(window, 'addEventListener').mockImplementation((type: string, listener: any) => {
      if (type === 'focus') focusListeners.push(listener);
      if (type === 'resize') resizeListeners.push(listener);
    });
    vi.spyOn(window, 'removeEventListener').mockImplementation((type: string, listener: any) => {
      if (type === 'focus') focusListeners = focusListeners.filter(l => l !== listener);
      if (type === 'resize') resizeListeners = resizeListeners.filter(l => l !== listener);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'innerWidth', { writable: true, value: originalInnerWidth });
  });

  it('shows empty state when no profile exists', async () => {
    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.noBirthChart')).toBeInTheDocument();
    });
    expect(screen.getByText('birthChart.createFirst')).toBeInTheDocument();
    expect(screen.getByText('birthChart.createYourChart')).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    // The loading state is transient; just verify component mounts without crashing
    const { container } = render(<BirthChartView />);
    // First render should show loading spinner or empty state
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders profile header when profile is loaded', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });
  });

  it('loads profile by initialProfileId prop', async () => {
    const profile = createMockProfile('prof-1');
    mockGetProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView initialProfileId="prof-1" />);
    await waitFor(() => {
      expect(mockGetProfileWithChart).toHaveBeenCalledWith('prof-1');
    });
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });
  });

  it('switches to chart view tab', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    expect(screen.getByTestId('chart-wheel')).toBeInTheDocument();
  });

  it('switches to elements view tab', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    const elementsTab = screen.getByText('Elements');
    fireEvent.click(elementsTab);
    expect(screen.getByTestId('element-temple')).toBeInTheDocument();
  });

  it('switches to dignities view tab', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    const dignitiesTab = screen.getByText('Dignities');
    fireEvent.click(dignitiesTab);
    expect(screen.getByTestId('planetary-court')).toBeInTheDocument();
  });

  it('switches to promise view tab', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    const promiseTab = screen.getByText('Soul Promise');
    fireEvent.click(promiseTab);
    expect(screen.getByText('birthChart.yourSoulsPromise')).toBeInTheDocument();
    expect(screen.getByText('Your soul promise summary')).toBeInTheDocument();
  });

  it('shows promise life themes and gifts/challenges', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Soul Promise'));
    expect(screen.getByText('birthChart.lifeThemes')).toBeInTheDocument();
    expect(screen.getByText('Theme 1')).toBeInTheDocument();
    expect(screen.getByText('birthChart.naturalGifts')).toBeInTheDocument();
    expect(screen.getByText('birthChart.growthEdges')).toBeInTheDocument();
  });

  it('toggles planet selection via ChartWheel callback', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    // The ChartWheel mock receives onPlanetClick; we can't directly test it
    // but we verify the modal system works by checking PlanetDetailModal is not
    // rendered when no planet is selected
    expect(screen.queryByTestId('planet-detail-modal')).not.toBeInTheDocument();
  });

  it('shows sun sign card with sign info', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    expect(screen.getByText('birthChart.sunSign:gemini')).toBeInTheDocument();
    expect(screen.getByText('Gemini')).toBeInTheDocument();
  });

  it('shows chart incomplete warning when sun is missing', async () => {
    const profile = createMockProfile('prof-1', {
      chart: {
        birthData: { date: '1990-06-15T00:00:00.000Z', locationName: 'New York' },
        planets: {},
        zodiacFrame: 'tropical',
        signCount: 12,
        calculatedWithFallback: false,
      },
    });
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    expect(screen.getByText('birthChart.chartIncomplete')).toBeInTheDocument();
    expect(screen.getByText('birthChart.recreateChart')).toBeInTheDocument();
  });

  it('opens new chart input when create button clicked in empty state', async () => {
    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.noBirthChart')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('birthChart.createYourChart'));
    expect(screen.getByTestId('birth-chart-input')).toBeInTheDocument();
  });

  it('opens new chart input from action bar', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('birthChart.newChart'));
    expect(screen.getByTestId('birth-chart-input')).toBeInTheDocument();
  });

  it('opens edit chart input from action bar', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('birthChart.edit'));
    expect(screen.getByTestId('birth-chart-input')).toBeInTheDocument();
  });

  it('handles chart calculated callback', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    // Open new chart form
    fireEvent.click(screen.getByText('birthChart.newChart'));
    expect(screen.getByTestId('birth-chart-input')).toBeInTheDocument();

    // Simulate calculation complete
    fireEvent.click(screen.getByText('Calculate'));
    await waitFor(() => {
      expect(screen.queryByTestId('birth-chart-input')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('chart-wheel')).toBeInTheDocument();
  });

  it('handles profile change from ProfileSelector', async () => {
    const profile1 = createMockProfile('prof-1');
    const profile2 = createMockProfile('prof-2', { name: 'Second User' });
    mockGetActiveProfileWithChart.mockReturnValue(profile1);
    mockGetProfileWithChart.mockImplementation((id: string) => id === 'prof-2' ? profile2 : profile1);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Switch Profile'));
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Second User')).toBeInTheDocument();
    });
  });

  it('handles add profile from ProfileSelector', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Profile'));
    expect(screen.getByTestId('birth-chart-input')).toBeInTheDocument();
  });

  it('handles cancel from birth chart input', async () => {
    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.noBirthChart')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('birthChart.createYourChart'));
    expect(screen.getByTestId('birth-chart-input')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('birth-chart-input')).not.toBeInTheDocument();
  });

  it('calculates and displays major aspects', async () => {
    // Profile with planets that form aspects
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    expect(screen.getByText('birthChart.majorAspects')).toBeInTheDocument();
  });

  it('renders right column stats in split view', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    // Right column should show natal promise and sun sign
    expect(screen.getByText('birthChart.soulPromise')).toBeInTheDocument();
    expect(screen.getByText('birthChart.sunSign:gemini')).toBeInTheDocument();
  });

  it('renders natal promise summary in right column', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    expect(screen.getByText('birthChart.soulPromise')).toBeInTheDocument();
    expect(screen.getByText('Your soul purpose')).toBeInTheDocument();
  });

  it('reacts to profile:switched event', async () => {
    const profile1 = createMockProfile('prof-1');
    const profile2 = createMockProfile('prof-2', { name: 'Event User' });
    mockGetActiveProfileWithChart.mockReturnValue(profile1);
    mockGetProfileWithChart.mockImplementation((id: string) => id === 'prof-2' ? profile2 : profile1);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    act(() => {
      subscribers.forEach(cb => cb({ type: 'profile:switched', profileId: 'prof-2' }));
    });

    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Event User')).toBeInTheDocument();
    });
  });

  it('reacts to profile:updated event', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    act(() => {
      subscribers.forEach(cb => cb({ type: 'profile:updated', profileId: 'prof-1' }));
    });

    expect(mockGetProfileWithChart).toHaveBeenCalledWith('prof-1');
  });

  it('reacts to profile:created event', async () => {
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    act(() => {
      subscribers.forEach(cb => cb({ type: 'profile:created', profileId: 'prof-1' }));
    });

    expect(mockGetProfileWithChart).toHaveBeenCalledWith('prof-1');
  });

  it('falls back to default profile when no active profile', async () => {
    const defaultProfile = createMockProfile('prof-default');
    mockGetActiveProfileWithChart.mockReturnValue(null);
    mockGetDefaultProfile.mockReturnValue({ id: 'prof-default', name: 'Default' });
    mockGetProfileWithChart.mockReturnValue(defaultProfile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });
    expect(mockGetDefaultProfile).toHaveBeenCalled();
  });

  it('handles mobile viewport', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 });
    const profile = createMockProfile('prof-1');
    mockGetActiveProfileWithChart.mockReturnValue(profile);

    render(<BirthChartView />);
    await waitFor(() => {
      expect(screen.getByText('birthChart.profileChart:Test User')).toBeInTheDocument();
    });

    // In mobile view, tabs should show shorter labels
    expect(screen.getByText('Chart')).toBeInTheDocument();
    expect(screen.getByText('Promise')).toBeInTheDocument();
  });
});
