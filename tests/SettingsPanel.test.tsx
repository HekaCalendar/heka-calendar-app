import { describe, it, expect, vi } from 'vitest';
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

describe('SettingsPanel', () => {
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
    const toggle = container.querySelector('.settings-toggle-btn');
    fireEvent.click(toggle!);
    expect(document.querySelector('.settings-modal')).toBeInTheDocument();
  });

  it('calls onAuthClick when auth button is clicked', () => {
    const onAuthClick = vi.fn();
    const { container } = renderWithProviders(
      <SettingsPanel onAuthClick={onAuthClick} />
    );
    const toggle = container.querySelector('.settings-toggle-btn');
    fireEvent.click(toggle!);

    const authButton = screen.getByText(/signIn|account/i);
    fireEvent.click(authButton);
    expect(onAuthClick).toHaveBeenCalledTimes(1);
  });

  it('dispatches location change when location is selected', () => {
    const { store, container } = renderWithProviders(
      <SettingsPanel onAuthClick={vi.fn()} />
    );
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const toggle = container.querySelector('.settings-toggle-btn');
    fireEvent.click(toggle!);

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
    const toggle = container.querySelector('.settings-toggle-btn');
    fireEvent.click(toggle!);

    expect(document.querySelector('.settings-modal')).toBeInTheDocument();

    const backdrop = document.querySelector('.settings-backdrop');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(document.querySelector('.settings-modal')).not.toBeInTheDocument();
    }
  });

  it('does not render auth button when onAuthClick is not provided', () => {
    const { container } = renderWithProviders(<SettingsPanel />);
    const toggle = container.querySelector('.settings-toggle-btn');
    fireEvent.click(toggle!);

    const authButtons = screen.queryAllByText(/signIn|account/i);
    expect(authButtons.length).toBe(0);
  });
});
