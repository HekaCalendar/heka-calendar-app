import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import AuthModal from '../src/components/AuthModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockIsFirebaseConfigured = vi.fn(() => true);
const mockLogIn = vi.fn(() => Promise.resolve());
const mockSignUp = vi.fn(() => Promise.resolve());
const mockLogOut = vi.fn(() => Promise.resolve());
const mockResetPassword = vi.fn(() => Promise.resolve());
const mockOnAuthChange = vi.fn(() => vi.fn());
const mockSyncToCloud = vi.fn(() => Promise.resolve());
const mockLoadFromCloud = vi.fn(() => Promise.resolve(null));
const mockLoadAllAstroData = vi.fn(() => Promise.resolve({ profiles: [], charts: [], preferences: null, selectedProfileId: null }));
const mockSyncAllAstroData = vi.fn(() => Promise.resolve());

vi.mock('../src/services/firebase', () => ({
  isFirebaseConfigured: () => mockIsFirebaseConfigured(),
  logIn: (email: string, password: string) => mockLogIn(email, password),
  signUp: (email: string, password: string, displayName: string) => mockSignUp(email, password, displayName),
  logOut: () => mockLogOut(),
  resetPassword: (email: string) => mockResetPassword(email),
  onAuthChange: (cb: any) => mockOnAuthChange(cb),
  syncToCloud: (userId: string, data: any) => mockSyncToCloud(userId, data),
  loadFromCloud: (userId: string) => mockLoadFromCloud(userId),
  loadAllAstroData: (userId: string) => mockLoadAllAstroData(userId),
  syncAllAstroData: (userId: string, data: any) => mockSyncAllAstroData(userId, data),
}));

vi.mock('../src/services/nativeAuth', () => ({
  signInWithGoogleNative: () => Promise.resolve(),
}));

vi.mock('../src/astrology/services/persistence', () => ({
  persistence: {
    getAllProfiles: () => Promise.resolve([]),
    getChartsForProfile: () => Promise.resolve([]),
    getPreferences: () => Promise.resolve(null),
    getSelectedProfile: () => Promise.resolve(null),
    saveProfile: () => Promise.resolve(),
    saveChart: () => Promise.resolve(),
    savePreferences: () => Promise.resolve(),
    setSelectedProfile: () => Promise.resolve(),
  },
  DEFAULT_PROFILE_PREFERENCES: {},
}));

vi.mock('../src/utils/errorUtils', () => ({
  getErrorMessage: (err: any, fallback?: string) => fallback || String(err),
  getErrorCode: (err: any) => (err && err.code) || '',
}));

describe('AuthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsFirebaseConfigured.mockReturnValue(true);
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when isOpen is false', () => {
    const { container } = renderWithProviders(
      <AuthModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders login view when not authenticated', () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('renders profile view when authenticated', () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />,
      {
        calendar: {
          auth: {
            isAuthenticated: true,
            userId: 'user-123',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: null,
            lastSync: null,
            isSyncing: false,
            syncError: null,
          },
        } as any,
      }
    );
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('shows not-configured view when Firebase is not configured', () => {
    mockIsFirebaseConfigured.mockReturnValue(false);
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );
    expect(document.querySelector('.auth-modal')).toBeInTheDocument();
  });

  it('switches from login to signup view', () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );
    const signupLink = screen.getByText(/create account/i);
    fireEvent.click(signupLink);
    expect(screen.getByPlaceholderText('auth.displayNamePlaceholder')).toBeInTheDocument();
  });

  it('switches from login to forgot password view', () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );
    const forgotLink = screen.getByText(/forgot password/i);
    fireEvent.click(forgotLink);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/reset password/i)).toBeInTheDocument();
  });

  it('updates email and password inputs', () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    expect(emailInput.value).toBe('user@test.com');
    expect(passwordInput.value).toBe('secret123');
  });

  it('submits login form and calls logIn', async () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /signIn/i }));

    await waitFor(() => {
      expect(mockLogIn).toHaveBeenCalledWith('user@test.com', 'secret123');
    });
  });

  it('displays error message on login failure', async () => {
    mockLogIn.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'bad@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /signIn/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument();
    });
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <AuthModal isOpen={true} onClose={onClose} />
    );
    const overlay = container.querySelector('.modal-overlay');
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows validation errors by preventing login with empty fields', async () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );

    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;

    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');

    // Attempt submit without filling fields
    fireEvent.click(screen.getByRole('button', { name: /signIn/i }));

    await waitFor(() => {
      expect(mockLogIn).not.toHaveBeenCalled();
    });
  });

  it('toggles to signup and shows validation on empty fields', async () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );

    fireEvent.click(screen.getByText(/create account/i));

    const displayNameInput = screen.getByPlaceholderText('auth.displayNamePlaceholder') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getAllByPlaceholderText(/password/i)[0] as HTMLInputElement;

    expect(displayNameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('minLength', '6');

    // Leave fields empty and try to submit
    fireEvent.click(screen.getByRole('button', { name: /signUp/i }));

    await waitFor(() => {
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  it('displays error message on signup failure', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('Email already in use'));

    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );

    fireEvent.click(screen.getByText(/create account/i));

    fireEvent.change(screen.getByPlaceholderText('auth.displayNamePlaceholder'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/password/i)[0], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /signUp/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already in use/)).toBeInTheDocument();
    });
  });

  it('renders Google social auth button in login view', () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });

  it('renders Google social auth button in signup view', () => {
    renderWithProviders(
      <AuthModal isOpen={true} onClose={vi.fn()} />
    );
    fireEvent.click(screen.getByText(/create account/i));
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });
});
