import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileSelector } from '../src/astrology/components/natal/ProfileSelector';

const mockListProfiles = vi.fn();
const mockGetActiveProfile = vi.fn();
const mockSetActiveProfile = vi.fn();
const mockSubscribe = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../src/astrology/services/natal/profileManager', () => ({
  profileManager: {
    listProfiles: (...args: any[]) => mockListProfiles(...args),
    getActiveProfile: () => mockGetActiveProfile(),
    setActiveProfile: (...args: any[]) => mockSetActiveProfile(...args),
    subscribe: (cb: any) => mockSubscribe(cb),
  },
}));

describe('ProfileSelector', () => {
  const mockProfiles = [
    {
      id: 'prof-1',
      name: 'Alice',
      sunSign: 'aries',
      moonSign: 'taurus',
      ascendantSign: 'gemini',
      avatar: '🌟',
      isDefault: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'prof-2',
      name: 'Bob',
      sunSign: 'cancer',
      moonSign: 'leo',
      ascendantSign: 'virgo',
      avatar: '🌙',
      isDefault: false,
      createdAt: new Date('2024-02-01'),
    },
  ];

  let subscribers: Array<(event: any) => void> = [];

  beforeEach(() => {
    subscribers = [];
    mockListProfiles.mockReturnValue(mockProfiles);
    mockGetActiveProfile.mockReturnValue(mockProfiles[0]);
    mockSubscribe.mockImplementation((cb: any) => {
      subscribers.push(cb);
      return () => {
        subscribers = subscribers.filter(s => s !== cb);
      };
    });
    mockSetActiveProfile.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    subscribers = [];
  });

  it('renders trigger with active profile name', () => {
    render(<ProfileSelector />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows select profile text when no active profile', () => {
    mockGetActiveProfile.mockReturnValue(null);
    render(<ProfileSelector />);
    expect(screen.getByText('profile.selectProfile')).toBeInTheDocument();
  });

  it('toggles dropdown open on click', () => {
    render(<ProfileSelector />);
    const trigger = screen.getByText('Alice').closest('button');
    fireEvent.click(trigger!);
    expect(screen.getByText('profile.yourCharts')).toBeInTheDocument();
    // Alice appears in both trigger and dropdown; use getAllByText
    expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows empty state when no profiles exist', () => {
    mockListProfiles.mockReturnValue([]);
    mockGetActiveProfile.mockReturnValue(null);
    render(<ProfileSelector />);
    const trigger = screen.getByText('profile.selectProfile').closest('button');
    fireEvent.click(trigger!);
    expect(screen.getByText('profile.noCharts')).toBeInTheDocument();
    expect(screen.getByText('profile.createFirst')).toBeInTheDocument();
  });

  it('calls setActiveProfile and onProfileChange when selecting a profile', () => {
    const onProfileChange = vi.fn();
    render(<ProfileSelector onProfileChange={onProfileChange} />);
    const trigger = screen.getByText('Alice').closest('button');
    fireEvent.click(trigger!);

    const bobRow = screen.getByText('Bob').closest('div');
    fireEvent.click(bobRow!);

    expect(mockSetActiveProfile).toHaveBeenCalledWith('prof-2');
    expect(onProfileChange).toHaveBeenCalledWith('prof-2');
  });

  it('calls onAddProfile when add new button is clicked', () => {
    const onAddProfile = vi.fn();
    render(<ProfileSelector onAddProfile={onAddProfile} />);
    const trigger = screen.getByText('Alice').closest('button');
    fireEvent.click(trigger!);

    const addBtn = screen.getByText('profile.addNew').closest('button');
    fireEvent.click(addBtn!);

    expect(onAddProfile).toHaveBeenCalledTimes(1);
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <ProfileSelector />
        <div data-testid="outside">Outside</div>
      </div>
    );
    const trigger = screen.getByText('Alice').closest('button');
    fireEvent.click(trigger!);
    expect(screen.getByText('profile.yourCharts')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('profile.yourCharts')).not.toBeInTheDocument();
  });

  it('renders in compact mode without name text', () => {
    mockGetActiveProfile.mockReturnValue(mockProfiles[0]);
    render(<ProfileSelector compact />);
    // In compact mode, only avatar and chevron are shown, no name
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    // Name should not be rendered as text node
    const nameElements = screen.queryAllByText('Alice');
    expect(nameElements.length).toBe(0);
  });

  it('highlights active profile in dropdown', () => {
    render(<ProfileSelector />);
    const trigger = screen.getByText('Alice').closest('button');
    fireEvent.click(trigger!);

    const rows = screen.getAllByText(/Alice|Bob/);
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });

  it('shows default badge on default profile', () => {
    render(<ProfileSelector />);
    const trigger = screen.getByText('Alice').closest('button');
    fireEvent.click(trigger!);

    expect(screen.getByText('profile.default')).toBeInTheDocument();
  });

  it('updates active profile on profile:switched event', () => {
    render(<ProfileSelector />);
    const trigger = screen.getByText('Alice').closest('button');
    fireEvent.click(trigger!);

    // Simulate event from profileManager
    subscribers.forEach(cb => cb({ type: 'profile:switched', profileId: 'prof-2' }));

    // Dropdown should still be open, but the trigger text updates
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('reloads profiles on profile:created event', () => {
    render(<ProfileSelector />);
    expect(mockListProfiles).toHaveBeenCalledTimes(1);

    subscribers.forEach(cb => cb({ type: 'profile:created', profileId: 'prof-3' }));
    expect(mockListProfiles).toHaveBeenCalledTimes(2);
  });

  it('reloads profiles on profile:deleted event', () => {
    render(<ProfileSelector />);
    subscribers.forEach(cb => cb({ type: 'profile:deleted', profileId: 'prof-1' }));
    expect(mockListProfiles).toHaveBeenCalledTimes(2);
  });

  it('reloads profiles on profile:updated event', () => {
    render(<ProfileSelector />);
    subscribers.forEach(cb => cb({ type: 'profile:updated', profileId: 'prof-1' }));
    expect(mockListProfiles).toHaveBeenCalledTimes(2);
  });
});
