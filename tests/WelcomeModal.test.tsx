import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import WelcomeModal from '../src/components/WelcomeModal';

let acceptInviteResult: Promise<any> = Promise.resolve({ type: 'friends/acceptInvite/fulfilled' });

vi.mock('../src/store/friendsSlice', () => ({
  acceptInvite: (_code: string) => ({
    type: 'friends/acceptInvite/pending',
    unwrap: () => acceptInviteResult,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockClearPendingInvite = vi.fn();
vi.mock('../src/services/deepLinkService', () => ({
  clearPendingInvite: () => mockClearPendingInvite(),
}));

const mockUpdatePreferences = vi.fn();
vi.mock('../src/services/tutorialService', () => ({
  tutorialService: {
    updatePreferences: (prefs: any) => mockUpdatePreferences(prefs),
  },
}));

vi.mock('../src/utils/errorUtils', () => ({
  getErrorMessage: (_err: any, fallback: string) => fallback,
}));

describe('WelcomeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    acceptInviteResult = Promise.resolve({ type: 'friends/acceptInvite/fulfilled' });
  });

  it('returns null when isOpen is false', () => {
    const { container } = renderWithProviders(
      <WelcomeModal isOpen={false} inviteCode={null} onClose={vi.fn()} onAccepted={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders welcome modal when open', () => {
    renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={null} onClose={vi.fn()} onAccepted={vi.fn()} />
    );
    expect(screen.getByText('welcomeToTheCircle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('inviteCodePlaceholder')).toBeInTheDocument();
  });

  it('shows detected invite code when provided', () => {
    renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={'ABC123'} onClose={vi.fn()} onAccepted={vi.fn()} />
    );
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('sendFriendRequest')).toBeInTheDocument();
  });

  it('does not show detected invite block when inviteCode is null', () => {
    renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={null} onClose={vi.fn()} onAccepted={vi.fn()} />
    );
    expect(screen.queryByText('inviteCodeDetected')).not.toBeInTheDocument();
  });

  it('uppercases manual input', () => {
    renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={null} onClose={vi.fn()} onAccepted={vi.fn()} />
    );

    const input = screen.getByPlaceholderText('inviteCodePlaceholder') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'lowercase' } });
    expect(input.value).toBe('LOWERCASE');
  });

  it('shows success state and calls onAccepted when accept succeeds', async () => {
    const onAccepted = vi.fn();

    renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={'SUCCESS1'} onClose={vi.fn()} onAccepted={onAccepted} />
    );

    fireEvent.click(screen.getByText('sendFriendRequest'));
    await waitFor(() => {
      expect(screen.getByText('openCosmicCircle')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('openCosmicCircle'));
    expect(onAccepted).toHaveBeenCalledTimes(1);
  });

  it('shows error message when accept fails', async () => {
    acceptInviteResult = Promise.reject(new Error('Network error'));

    renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={'FAIL123'} onClose={vi.fn()} onAccepted={vi.fn()} />
    );

    fireEvent.click(screen.getByText('sendFriendRequest'));
    await waitFor(() => {
      expect(screen.getByText(/failedToSendFriendRequest/)).toBeInTheDocument();
    });
  });

  it('calls onClose and clears pending invite when skip is clicked', () => {
    const onClose = vi.fn();
    renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={null} onClose={onClose} onAccepted={vi.fn()} />
    );

    fireEvent.click(screen.getByText('skipForNow'));
    expect(mockClearPendingInvite).toHaveBeenCalledTimes(1);
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ skipOnboarding: true });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls handleSkip when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={null} onClose={onClose} onAccepted={vi.fn()} />
    );

    const overlay = container.querySelector('.modal-overlay');
    fireEvent.click(overlay!);
    expect(mockClearPendingInvite).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('disables manual submit when input is empty', () => {
    renderWithProviders(
      <WelcomeModal isOpen={true} inviteCode={null} onClose={vi.fn()} onAccepted={vi.fn()} />
    );

    const submitButton = screen.getByText('sendRequest');
    expect(submitButton).toBeDisabled();
  });
});
