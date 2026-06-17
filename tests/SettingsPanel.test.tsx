import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import SettingsPanel from '../src/components/SettingsPanel';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../src/hooks/useGamification', () => ({
  useFeatureDiscovery: () => ({
    discover: vi.fn(() => true),
    isDiscovered: vi.fn(() => false),
    hasDiscovered: {},
  }),
  useSettingsTracking: () => ({
    trackTheme: vi.fn(),
    trackFont: vi.fn(),
    trackDisplay: vi.fn(),
    trackLocation: vi.fn(),
    trackGeneric: vi.fn(),
    themesTried: [],
    fontsTried: [],
    displayModesTried: [],
    customizationsMade: 0,
  }),
}));

vi.mock('../src/services/tutorialService', () => ({
  tutorialService: {
    getPreferences: () => ({}),
    updatePreferences: vi.fn(),
    trackCelestialGuideToggle: vi.fn(),
  },
}));

// Mock heavy child components
vi.mock('../src/components/notification/CalendarNotificationSettings', () => ({
  CalendarNotificationSettings: () => <div data-testid="calendar-notifications" />,
}));
vi.mock('../src/components/notification/StarsNotificationSettings', () => ({
  StarsNotificationSettings: () => <div data-testid="stars-notifications" />,
}));
vi.mock('../src/components/notification/JournalNotificationSettings', () => ({
  JournalNotificationSettings: () => <div data-testid="journal-notifications" />,
}));
vi.mock('../src/components/notification/UnifiedNotificationSettings', () => ({
  UnifiedNotificationSettings: () => <div data-testid="unified-notifications" />,
}));
vi.mock('../src/components/notification/NotificationHistory', () => ({
  NotificationHistory: () => <div data-testid="notification-history" />,
}));
vi.mock('../src/components/notification/TimePreferenceEditor', () => ({
  TimePreferenceEditor: () => <div data-testid="time-preference" />,
}));
vi.mock('../src/components/notification/VacationModeEditor', () => ({
  VacationModeEditor: () => <div data-testid="vacation-mode" />,
}));
vi.mock('../src/components/notification/FocusSchedulesEditor', () => ({
  FocusSchedulesEditor: () => <div data-testid="focus-schedules" />,
}));
vi.mock('../src/components/ThemeSettings', () => ({
  ThemeSettings: () => <div data-testid="theme-settings" />,
}));
vi.mock('../src/components/AISettingsPanel', () => ({
  AISettingsPanel: () => <div data-testid="ai-settings" />,
}));

function openSettings(container: HTMLElement) {
  const toggle = container.querySelector('.settings-toggle-btn');
  fireEvent.click(toggle!);
}

describe('SettingsPanel', () => {
  let originalHref: string;

  beforeEach(() => {
    originalHref = window.location.href;
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: originalHref },
    });
  });

  it('renders settings modal', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />
    );
    const toggle = container.querySelector('.settings-toggle-btn');
    expect(toggle).toBeInTheDocument();
  });

  it('opens modal when toggle is clicked', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />
    );
    openSettings(container);
    expect(document.querySelector('.settings-modal')).toBeInTheDocument();
  });

  it('calls onAuthClick when auth button is clicked', () => {
    const onAuthClick = vi.fn();
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={onAuthClick} />
    );
    openSettings(container);

    const authButton = screen.getByText(/signIn|account/i);
    fireEvent.click(authButton);
    expect(onAuthClick).toHaveBeenCalledTimes(1);
  });

  it('dispatches location change when location is selected', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);

    const locationBtn = screen.getByText(/changeLocation/i);
    fireEvent.click(locationBtn);

    const select = document.querySelector('select') as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'US' } });
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('closes modal when backdrop is clicked', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />
    );
    openSettings(container);

    expect(document.querySelector('.settings-modal')).toBeInTheDocument();

    const backdrop = document.querySelector('.settings-backdrop');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(document.querySelector('.settings-modal')).not.toBeInTheDocument();
    }
  });

  it('does not render auth button when onAuthClick is not provided', () => {
    const { container } = renderWithProviders(<SettingsPanel />);
    openSettings(container);

    const authButtons = screen.queryAllByText(/signIn|account/i);
    expect(authButtons.length).toBe(0);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // AUTHENTICATED STATE
  // ═══════════════════════════════════════════════════════════════════════════════

  it('shows avatar initial when authenticated', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      {
        calendar: {
          auth: {
            isAuthenticated: true,
            displayName: 'Alex',
            email: 'alex@example.com',
          },
        } as any,
      }
    );
    openSettings(container);

    const authButton = screen.getByText('A');
    expect(authButton).toBeInTheDocument();
    expect(screen.getByText('account')).toBeInTheDocument();
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // PURE MODE
  // ═══════════════════════════════════════════════════════════════════════════════

  it('renders pure mode button and calls onPureModeClick', () => {
    const onPureModeClick = vi.fn();
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} onPureModeClick={onPureModeClick} />
    );
    openSettings(container);

    // Pure mode button should be in the toggle wrapper
    const pureBtn = container.querySelector('[aria-label="pureMode"]');
    expect(pureBtn).toBeInTheDocument();

    fireEvent.click(pureBtn!);
    expect(onPureModeClick).toHaveBeenCalledTimes(1);
  });

  it('applies pure-mode class and renders monthHeaderSlot', () => {
    const { container } = renderWithProviders(
      <SettingsPanel
        onAuthClick={vi.fn()}
        onPureModeClick={vi.fn()}
        isPureMode={true}
        monthHeaderSlot={<div data-testid="month-header">Header</div>}
      />
    );
    openSettings(container);

    const modal = document.querySelector('.settings-modal--pure-mode');
    expect(modal).toBeInTheDocument();
    expect(screen.getByTestId('month-header')).toBeInTheDocument();
  });

  it('hides celestial cards when pure mode is active', () => {
    const { container } = renderWithProviders(
      <SettingsPanel
        onAuthClick={vi.fn()}
        onPureModeClick={vi.fn()}
        isPureMode={true}
      />
    );
    openSettings(container);

    // The celestial cards section should not render
    const celestialGroup = document.querySelector('.settings-group-celestial');
    expect(celestialGroup).not.toBeInTheDocument();
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // MODAL CLOSE MECHANISMS
  // ═══════════════════════════════════════════════════════════════════════════════

  it('closes modal via close button', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />
    );
    openSettings(container);
    expect(document.querySelector('.settings-modal')).toBeInTheDocument();

    const closeBtn = document.querySelector('.settings-modal__close');
    fireEvent.click(closeBtn!);
    expect(document.querySelector('.settings-modal')).not.toBeInTheDocument();
  });

  it('closes modal on Escape key', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />
    );
    openSettings(container);
    expect(document.querySelector('.settings-modal')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('.settings-modal')).not.toBeInTheDocument();
  });

  it('closes modal when clicking outside', () => {
    const { container } = renderWithProviders(
      <div>
        <SettingsPanel onAuthClick={vi.fn()} />
        <div data-testid="outside">Outside</div>
      </div>
    );
    openSettings(container);
    expect(document.querySelector('.settings-modal')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(document.querySelector('.settings-modal')).not.toBeInTheDocument();
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // LOCATION / SUB-REGION
  // ═══════════════════════════════════════════════════════════════════════════════

  it('dispatches sub-region change', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { location: 'US', subRegion: null } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    fireEvent.click(screen.getByText(/changeLocation/i));

    // Two selects: country and sub-region
    const selects = document.querySelectorAll('select');
    expect(selects.length).toBeGreaterThanOrEqual(2);

    const subRegionSelect = selects[1];
    fireEvent.change(subRegionSelect, { target: { value: 'US-CA' } });
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('displays location with sub-region name', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { location: 'US', subRegion: 'US-CA' } as any }
    );
    openSettings(container);

    expect(screen.getByText(/California/i)).toBeInTheDocument();
  });

  it('cancels location change via keep button', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { location: 'US', subRegion: null } as any }
    );
    openSettings(container);

    fireEvent.click(screen.getByText(/changeLocation/i));
    expect(document.querySelectorAll('select').length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByText(/keepCurrentLocation/i));
    // Select should be gone after clicking keep
    const selects = document.querySelectorAll('select');
    expect(selects.length).toBe(0);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // CELESTIAL TOGGLE
  // ═══════════════════════════════════════════════════════════════════════════════

  it('toggles celestial cards on and tracks', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { display: { showCelestialCards: false } } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    const celestialBtn = document.querySelector('.btn-celestial-toggle');
    expect(celestialBtn).toBeInTheDocument();

    fireEvent.click(celestialBtn!);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('shows active celestial toggle when enabled', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { display: { showCelestialCards: true } } as any }
    );
    openSettings(container);

    const celestialBtn = document.querySelector('.btn-celestial-toggle.btn--active');
    expect(celestialBtn).toBeInTheDocument();
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // TIME MODE
  // ═══════════════════════════════════════════════════════════════════════════════

  it('toggles time mode from SYNC to TRUE', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { timeMode: 'SYNC' } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    const trueBtn = screen.getByText('trueMode');
    fireEvent.click(trueBtn);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('toggles time mode from TRUE to SYNC', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { timeMode: 'TRUE' } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    const syncBtn = screen.getByText('syncMode');
    fireEvent.click(syncBtn);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('shows active time mode button', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { timeMode: 'TRUE' } as any }
    );
    openSettings(container);

    const activeBtns = document.querySelectorAll('.btn--active');
    expect(activeBtns.length).toBeGreaterThanOrEqual(1);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // ASTROLOGY TOGGLES
  // ═══════════════════════════════════════════════════════════════════════════════

  it('toggles show transits on calendar', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { astroPreferences: { showTransitsOnCalendar: false, showNakshatras: false } } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    const transitsBtn = screen.getByText('showOnDayPanel');
    fireEvent.click(transitsBtn);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('toggles show nakshatras', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { astroPreferences: { showTransitsOnCalendar: false, showNakshatras: false } } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    const nakshatraBtn = screen.getByText('showLunarMansions');
    fireEvent.click(nakshatraBtn);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  it('toggles global notifications', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { notificationPreferences: { globalEnabled: false } } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    const switchInput = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(switchInput).toBeInTheDocument();

    fireEvent.click(switchInput!);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('switches notification mode to unified', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { notificationPreferences: { notificationMode: 'custom' } } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    const unifiedBtn = screen.getByText(/simple/i);
    fireEvent.click(unifiedBtn);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('switches notification mode to custom', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { notificationPreferences: { notificationMode: 'unified' } } as any }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    const customBtn = screen.getByText(/custom/i);
    fireEvent.click(customBtn);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  it('renders unified notification settings when mode is unified', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { notificationPreferences: { notificationMode: 'unified' } } as any }
    );
    openSettings(container);

    expect(screen.getByTestId('unified-notifications')).toBeInTheDocument();
  });

  it('renders custom notification settings when mode is custom', () => {
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      { calendar: { notificationPreferences: { notificationMode: 'custom' } } as any }
    );
    openSettings(container);

    expect(screen.getByTestId('calendar-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('stars-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('journal-notifications')).toBeInTheDocument();
  });

  it('toggles adaptive caps in custom mode', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />,
      {
        calendar: {
          notificationPreferences: {
            notificationMode: 'custom',
            adaptiveCaps: false,
          },
        } as any,
      }
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    openSettings(container);
    // Find all checkboxes; the adaptive caps one is in the custom mode body
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(checkboxes[checkboxes.length - 1]);
    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // REPORT ISSUE
  // ═══════════════════════════════════════════════════════════════════════════════

  it('constructs mailto link on report issue click', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />
    );
    openSettings(container);

    const reportBtn = screen.getByText(/reportIssue/i);
    fireEvent.click(reportBtn);

    expect(window.location.href).toContain('mailto:hekacalendar@gmail.com');
    expect(window.location.href).toContain('HEKA%20Calendar%20Bug%20Report');
  });
});
