import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { FriendsModal } from '../src/components/FriendsModal';
import { renderWithProviders, createMockStore } from './test-utils';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => ({
    t: (key: string, opts?: any) => {
      if (typeof opts === 'object' && opts !== null) {
        let s = key;
        Object.entries(opts).forEach(([k, v]) => {
          s = s.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
        });
        return s;
      }
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

vi.mock('../src/i18n', () => ({
  default: {
    t: (key: string, opts?: any) => {
      if (typeof opts === 'object' && opts !== null) {
        let s = key;
        Object.entries(opts).forEach(([k, v]) => {
          s = s.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
        });
        return s;
      }
      return key;
    },
    language: 'en',
  },
}));

vi.mock('@capacitor/share', () => ({
  Share: { share: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock('../src/services/friendsService', () => ({
  FriendsService: {
    ensureUserProfile: vi.fn().mockResolvedValue(undefined),
    subscribeToFriends: vi.fn(() => () => {}),
    subscribeToTasks: vi.fn(() => () => {}),
    subscribeToFriendRequests: vi.fn(() => () => {}),
    subscribeToMessages: vi.fn(() => () => {}),
    updatePresence: vi.fn(),
    sendMessage: vi.fn(),
    markConversationRead: vi.fn(),
  },
}));

vi.mock('../src/services/taskShareService', () => ({
  TaskShareService: {
    subscribeToCreatorSharedTasks: vi.fn(() => () => {}),
    createShareableTask: vi.fn().mockResolvedValue({ success: true, shareCode: 'TASK123' }),
    generateTaskShareText: vi.fn((title: string, code: string) => `Task: ${title} - Code: ${code}`),
  },
}));

vi.mock('../src/services/aiConfigService', () => ({
  aiConfigService: {
    isAreaEnabled: vi.fn(() => true),
    subscribe: vi.fn(() => () => {}),
    getUserContext: vi.fn(() => ({
      lastJournalThemes: [],
      lastCelebratedMoonPhase: null,
    })),
    setUserContext: vi.fn(),
  },
}));

vi.mock('../src/services/firebase', () => ({
  getCurrentUser: vi.fn(() => ({ uid: 'user-1', displayName: 'Test User' })),
}));

vi.mock('../src/services/deepLinkService', () => ({
  generateInviteLink: vi.fn((code: string) => `https://heka.app/invite/${code}`),
  generateWebInviteLink: vi.fn(() => 'https://heka.app/web-invite'),
}));

vi.mock('../src/components/ProfileSetupModal', () => ({
  ProfileSetupModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="profile-setup-modal">Profile Setup</div> : null,
}));

vi.mock('../src/components/notification/CircleSettings', () => ({
  CircleSettings: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="circle-settings">Circle Settings</div> : null,
}));

import { FriendsService } from '../src/services/friendsService';

// ── Test data ────────────────────────────────────────────────────────────────

const mockFriend = {
  uid: 'friend-1',
  displayName: 'Alice',
  isOnline: true,
  currentView: 'calendar',
  lastActive: null,
};

const mockFriendOffline = {
  uid: 'friend-2',
  displayName: 'Bob',
  isOnline: false,
  currentView: null,
  lastActive: new Date('2024-06-10T10:00:00Z'),
};

const mockRequest = {
  uid: 'request-1',
  displayName: 'Charlie',
};

const mockTaskAssigned = {
  id: 'task-1',
  creatorId: 'friend-1',
  assigneeId: 'user-1',
  title: 'Test Task',
  description: 'Do something',
  status: 'pending',
  hekaDate: { year: 2024, month: 5, day: 20 },
};

const mockTaskCreated = {
  id: 'task-2',
  creatorId: 'user-1',
  assigneeId: 'friend-1',
  title: 'Created Task',
  description: 'My task',
  status: 'pending',
};

const mockMessage = {
  id: 'msg-1',
  senderId: 'friend-1',
  text: 'Hello!',
  timestamp: { toDate: () => new Date('2024-06-15T10:00:00Z') },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderWithSpyDispatch(ui: React.ReactElement, preloadedState: any = {}) {
  const store = createMockStore(preloadedState);
  const dispatchSpy = vi.spyOn(store, 'dispatch');
  const result = renderWithProviders(ui, preloadedState, { store });
  return { ...result, dispatchSpy };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('FriendsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
      share: vi.fn().mockResolvedValue(undefined),
    });
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null when isOpen is false', () => {
    const { container } = renderWithProviders(
      <FriendsModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when open', () => {
    renderWithProviders(<FriendsModal isOpen={true} onClose={vi.fn()} />);
    expect(document.querySelector('.cosmic-circle-overlay')).toBeInTheDocument();
    expect(document.querySelector('.cosmic-circle__title')).toBeInTheDocument();
  });

  it('shows profile setup when authenticated but no displayName', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        calendar: {
          auth: {
            isAuthenticated: true,
            userId: 'user-1',
            email: null,
            displayName: null,
            photoURL: null,
            lastSync: null,
            isSyncing: false,
            syncError: null,
          },
        } as any,
      }
    );
    expect(screen.getByTestId('profile-setup-modal')).toBeInTheDocument();
  });

  it('does not show profile setup when not authenticated', () => {
    renderWithProviders(<FriendsModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.queryByTestId('profile-setup-modal')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking overlay', () => {
    const onClose = vi.fn();
    renderWithProviders(<FriendsModal isOpen={true} onClose={onClose} />);
    const overlay = document.querySelector('.cosmic-circle-overlay');
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside modal', () => {
    const onClose = vi.fn();
    renderWithProviders(<FriendsModal isOpen={true} onClose={onClose} />);
    const modal = document.querySelector('.cosmic-circle');
    fireEvent.click(modal!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows close button and calls onClose', () => {
    const onClose = vi.fn();
    renderWithProviders(<FriendsModal isOpen={true} onClose={onClose} />);
    const closeBtn = document.querySelector('.cosmic-circle__close');
    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows profile button with auth info', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        calendar: {
          auth: {
            isAuthenticated: true,
            userId: 'user-1',
            email: null,
            displayName: 'Test User',
            photoURL: '🧙',
            lastSync: null,
            isSyncing: false,
            syncError: null,
          },
        } as any,
      }
    );
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('🧙')).toBeInTheDocument();
  });

  it('opens CircleSettings when settings button clicked', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        calendar: {
          auth: {
            isAuthenticated: true,
            userId: 'user-1',
            email: null,
            displayName: 'Test User',
            photoURL: null,
            lastSync: null,
            isSyncing: false,
            syncError: null,
          },
        } as any,
      }
    );
    const settingsBtn = screen.getByTitle('profile.settings');
    fireEvent.click(settingsBtn);
    expect(screen.getByTestId('circle-settings')).toBeInTheDocument();
  });

  it('dispatches setActiveTab when clicking tabs', () => {
    const { dispatchSpy } = renderWithSpyDispatch(<FriendsModal isOpen={true} onClose={vi.fn()} />);
    const tabs = document.querySelectorAll('.cosmic-circle__tab');
    fireEvent.click(tabs[1]); // messages
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: expect.stringContaining('setActiveTab') }));
  });

  // ── Friends Tab ───────────────────────────────────────────────────────────

  it('shows empty state when no friends', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      { friends: { activeTab: 'friends', friends: [] } as any }
    );
    expect(screen.getByText('friendsList.emptyTitle')).toBeInTheDocument();
  });

  it('shows friends list with online status', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'friends',
          friends: [mockFriend, mockFriendOffline],
        } as any,
      }
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    // Online status text is concatenated: friendsList.onlinefriendsList.currentView
    expect(screen.getByText(/friendsList\.online/)).toBeInTheDocument();
  });

  it('dispatches setSelectedFriend when clicking a friend', () => {
    const { dispatchSpy } = renderWithSpyDispatch(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'friends',
          friends: [mockFriend],
        } as any,
      }
    );
    const friendEl = document.querySelector('.circle-friend');
    fireEvent.click(friendEl!);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: expect.stringContaining('setSelectedFriend') }));
  });

  it('shows friend badge count on friends tab', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'friends',
          friends: [mockFriend, mockFriendOffline],
        } as any,
      }
    );
    const badge = document.querySelector('.cosmic-circle__tab-badge');
    expect(badge).toHaveTextContent('2');
  });

  // ── Messages Tab ──────────────────────────────────────────────────────────

  it('shows messages empty state when no friend selected', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'messages',
          selectedFriend: null,
          friends: [mockFriend],
        } as any,
      }
    );
    expect(screen.getByText('messages.emptyTitle')).toBeInTheDocument();
  });

  it('shows conversation when friend is selected', () => {
    // conversationId = conv_<sorted uids> = conv_friend-1_user-1
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'messages',
          selectedFriend: mockFriend,
          messages: {
            'conv_friend-1_user-1': [mockMessage],
          },
        } as any,
      }
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('sends message on button click', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'messages',
          selectedFriend: mockFriend,
          messages: {},
        } as any,
      }
    );
    const input = document.querySelector('.circle-message__input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test reply' } });
    const sendBtn = document.querySelector('.circle-message__send');
    fireEvent.click(sendBtn!);
    expect(FriendsService.sendMessage).toHaveBeenCalledWith('conv_friend-1_user-1', 'Test reply');
  });

  it('sends message on Enter key', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'messages',
          selectedFriend: mockFriend,
          messages: {},
        } as any,
      }
    );
    const input = document.querySelector('.circle-message__input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Enter message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(FriendsService.sendMessage).toHaveBeenCalledWith('conv_friend-1_user-1', 'Enter message');
  });

  it('shows back button in messages and dispatches setSelectedFriend(null)', () => {
    const { dispatchSpy } = renderWithSpyDispatch(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'messages',
          selectedFriend: mockFriend,
          messages: {},
        } as any,
      }
    );
    const backBtn = document.querySelector('.circle-messages__back');
    fireEvent.click(backBtn!);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: expect.stringContaining('setSelectedFriend') }));
  });

  // ── Requests Tab ──────────────────────────────────────────────────────────

  it('shows empty state when no requests', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'requests',
          friendRequests: [],
        } as any,
      }
    );
    expect(screen.getByText('requests.emptyTitle')).toBeInTheDocument();
  });

  it('shows friend requests with accept/decline buttons', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'requests',
          friendRequests: [mockRequest],
        } as any,
      }
    );
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('requests.wantsToConnect')).toBeInTheDocument();
    const buttons = document.querySelectorAll('.circle-friend__actions button');
    expect(buttons.length).toBe(2);
  });

  // ── Tasks Tab ─────────────────────────────────────────────────────────────

  it('shows tasks empty state', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'tasks',
          tasks: [],
          sharedTasks: [],
        } as any,
      }
    );
    expect(screen.getByText('tasks.createAndShare')).toBeInTheDocument();
  });

  it('shows assigned tasks with accept/decline buttons', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'tasks',
          tasks: [mockTaskAssigned],
          sharedTasks: [],
        } as any,
      }
    );
    expect(screen.getByText('tasks.taskTitleSimple')).toBeInTheDocument();
    expect(screen.getByText('tasks.accept')).toBeInTheDocument();
    expect(screen.getByText('tasks.decline')).toBeInTheDocument();
  });

  it('shows created tasks with revoke button', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'tasks',
          tasks: [mockTaskCreated],
          sharedTasks: [],
        } as any,
      }
    );
    const createdTab = document.querySelectorAll('.circle-tasks__tab')[1];
    fireEvent.click(createdTab);
    expect(screen.getByText('tasks.taskTitleSimple')).toBeInTheDocument();
    expect(screen.getByText('tasks.revoke')).toBeInTheDocument();
  });

  it('switches task sub-tabs', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'tasks',
          tasks: [],
          sharedTasks: [],
        } as any,
      }
    );
    const tabs = document.querySelectorAll('.circle-tasks__tab');
    fireEvent.click(tabs[1]); // created
    expect(tabs[1]).toHaveClass('circle-tasks__tab--active');
    fireEvent.click(tabs[2]); // shared
    expect(tabs[2]).toHaveClass('circle-tasks__tab--active');
  });

  it('opens create task modal when sendTask button clicked', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'friends',
          friends: [mockFriend],
          selectedFriend: mockFriend,
        } as any,
      }
    );
    const taskBtn = screen.getByTitle('friendsList.sendTask');
    fireEvent.click(taskBtn);
    expect(screen.getByText(/taskCreate\.title/)).toBeInTheDocument();
  });

  it('closes create task modal on cancel', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'friends',
          friends: [mockFriend],
          selectedFriend: mockFriend,
        } as any,
      }
    );
    const taskBtn = screen.getByTitle('friendsList.sendTask');
    fireEvent.click(taskBtn);
    expect(screen.getByText(/taskCreate\.title/)).toBeInTheDocument();
    const cancelBtn = screen.getByText('taskCreate.cancel');
    fireEvent.click(cancelBtn);
    expect(screen.queryByText(/taskCreate\.title/)).not.toBeInTheDocument();
  });

  // ── Invite Tab ────────────────────────────────────────────────────────────

  it('shows invite tab with generate code button', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'invite',
          inviteCode: null,
          isLoading: false,
        } as any,
      }
    );
    expect(screen.getByText('invite.title')).toBeInTheDocument();
    expect(screen.getByText('invite.generateCode')).toBeInTheDocument();
  });

  it('dispatches generateInviteCode when button clicked', () => {
    const { dispatchSpy } = renderWithSpyDispatch(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'invite',
          inviteCode: null,
          isLoading: false,
        } as any,
      }
    );
    const btn = screen.getByText('invite.generateCode');
    fireEvent.click(btn);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  it('shows invite code with copy and share buttons', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'invite',
          inviteCode: 'ABC123',
        } as any,
      }
    );
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('invite.copyLink')).toBeInTheDocument();
    expect(screen.getByText('invite.share')).toBeInTheDocument();
  });

  it('copies invite code to clipboard', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'invite',
          inviteCode: 'ABC123',
        } as any,
      }
    );
    const copyBtn = screen.getByText('invite.copyLink');
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://heka.app/invite/ABC123');
  });

  it('shows invite input and accepts invite code', () => {
    const { dispatchSpy } = renderWithSpyDispatch(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'invite',
          inviteCode: null,
          isLoading: false,
        } as any,
      }
    );
    const input = document.querySelector('.circle-invite__input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'XYZ789' } });
    const joinBtn = screen.getByText('invite.joinCircle');
    fireEvent.click(joinBtn);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  it('shows error in invite tab', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'invite',
          inviteCode: null,
          error: 'Invalid code',
        } as any,
      }
    );
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  // ── AI Coach Banner ───────────────────────────────────────────────────────

  it('shows Circle AI Coach banner when enabled', () => {
    renderWithProviders(
      <FriendsModal isOpen={true} onClose={vi.fn()} />,
      {
        friends: {
          activeTab: 'friends',
          friends: [],
        } as any,
      }
    );
    const banner = document.querySelector('[style*="linear-gradient"]');
    expect(banner).toBeInTheDocument();
  });

  // ── Subscriptions ─────────────────────────────────────────────────────────

  it('subscribes to real-time updates when opened', () => {
    renderWithProviders(<FriendsModal isOpen={true} onClose={vi.fn()} />);
    expect(FriendsService.subscribeToFriends).toHaveBeenCalled();
    expect(FriendsService.subscribeToTasks).toHaveBeenCalled();
    expect(FriendsService.subscribeToFriendRequests).toHaveBeenCalled();
    expect(FriendsService.updatePresence).toHaveBeenCalledWith('Cosmic Circle');
  });

  it('does not subscribe when closed', () => {
    renderWithProviders(<FriendsModal isOpen={false} onClose={vi.fn()} />);
    expect(FriendsService.subscribeToFriends).not.toHaveBeenCalled();
  });
});
