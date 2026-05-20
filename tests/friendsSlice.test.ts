import { describe, it, expect } from 'vitest';
import friendsReducer, {
  setCircleTheme,
  setActiveTab,
  setSelectedFriend,
  setActiveConversation,
  updateFriends,
  updateMessages,
  updateTasks,
  updateSharedTasks,
  updateFriendRequests,
  removeFriendRequest,
  addMessage,
  clearError,
  resetFriendsState,
  generateInviteCode,
  acceptInvite,
  fetchFriends,
  createTask,
  respondToTask,
  fetchSharedTasks,
  revokeSharedTask,
  revokeTask,
  fetchFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
} from '../src/store/friendsSlice';
import type { FriendsState, FriendProfile, Message, TaskRitual, SharedTask, Conversation } from '../src/store/friendsSlice';

function mockFriend(overrides: Partial<FriendProfile> = {}): FriendProfile {
  return { uid: 'f1', displayName: 'Friend One', photoURL: null, status: 'friend', ...overrides };
}

function mockMessage(overrides: Partial<Message> = {}): Message {
  return { id: 'm1', senderId: 'f1', text: 'Hello', timestamp: Date.now(), ...overrides };
}

function mockTask(overrides: Partial<TaskRitual> = {}): TaskRitual {
  return { id: 't1', assigneeId: 'f1', title: 'Task', description: 'Desc', status: 'pending', createdAt: Date.now(), ...overrides };
}

function mockSharedTask(overrides: Partial<SharedTask> = {}): SharedTask {
  return { id: 'st1', shareCode: 'code1', title: 'Shared', status: 'active', createdAt: Date.now(), ...overrides };
}

function createFriendsState(overrides: Partial<FriendsState> = {}): FriendsState {
  return {
    circleTheme: 'nebula',
    friends: [],
    friendRequests: [],
    sentRequests: [],
    conversations: [],
    activeConversation: null,
    messages: {},
    tasks: [],
    sharedTasks: [],
    inviteCode: null,
    selectedFriend: null,
    activeTab: 'friends',
    isLoading: false,
    error: null,
    unreadTotal: 0,
    ...overrides,
  };
}

describe('friendsSlice', () => {
  describe('synchronous reducers', () => {
    it('setCircleTheme changes theme', () => {
      let state = createFriendsState();
      state = friendsReducer(state, setCircleTheme('solar'));
      expect(state.circleTheme).toBe('solar');
    });

    it('setActiveTab changes tab', () => {
      let state = createFriendsState();
      state = friendsReducer(state, setActiveTab('tasks'));
      expect(state.activeTab).toBe('tasks');
    });

    it('setSelectedFriend sets friend and switches to messages', () => {
      let state = createFriendsState();
      const friend = mockFriend();
      state = friendsReducer(state, setSelectedFriend(friend));
      expect(state.selectedFriend).toEqual(friend);
      expect(state.activeTab).toBe('messages');
    });

    it('setSelectedFriend with null clears selection', () => {
      let state = createFriendsState({ selectedFriend: mockFriend() });
      state = friendsReducer(state, setSelectedFriend(null));
      expect(state.selectedFriend).toBeNull();
    });

    it('setActiveConversation sets conversation', () => {
      let state = createFriendsState();
      const conv = { id: 'c1', participants: ['u1', 'u2'] } as Conversation;
      state = friendsReducer(state, setActiveConversation(conv));
      expect(state.activeConversation).toEqual(conv);
    });

    it('updateFriends replaces friends list', () => {
      let state = createFriendsState();
      state = friendsReducer(state, updateFriends([mockFriend(), mockFriend({ uid: 'f2' })]));
      expect(state.friends).toHaveLength(2);
    });

    it('updateMessages sets messages for conversation', () => {
      let state = createFriendsState();
      state = friendsReducer(state, updateMessages({ conversationId: 'c1', messages: [mockMessage()] }));
      expect(state.messages.c1).toHaveLength(1);
    });

    it('updateTasks replaces tasks and recalculates unread', () => {
      let state = createFriendsState({ friendRequests: [mockFriend()] });
      state = friendsReducer(state, updateTasks([mockTask(), mockTask({ id: 't2', status: 'completed' })]));
      expect(state.tasks).toHaveLength(2);
      expect(state.unreadTotal).toBe(2); // 1 pending task + 1 friend request
    });

    it('updateSharedTasks replaces shared tasks', () => {
      let state = createFriendsState();
      state = friendsReducer(state, updateSharedTasks([mockSharedTask()]));
      expect(state.sharedTasks).toHaveLength(1);
    });

    it('updateFriendRequests replaces requests and recalculates unread', () => {
      let state = createFriendsState({ tasks: [mockTask()] });
      state = friendsReducer(state, updateFriendRequests([mockFriend(), mockFriend({ uid: 'f2' })]));
      expect(state.friendRequests).toHaveLength(2);
      expect(state.unreadTotal).toBe(3); // 1 pending task + 2 requests
    });

    it('removeFriendRequest filters by uid and recalculates unread', () => {
      let state = createFriendsState({
        friendRequests: [mockFriend({ uid: 'f1' }), mockFriend({ uid: 'f2' })],
        tasks: [mockTask()],
      });
      state = friendsReducer(state, removeFriendRequest('f1'));
      expect(state.friendRequests).toHaveLength(1);
      expect(state.friendRequests[0].uid).toBe('f2');
      expect(state.unreadTotal).toBe(2); // 1 task + 1 request
    });

    it('addMessage creates conversation array if missing', () => {
      let state = createFriendsState();
      state = friendsReducer(state, addMessage({ conversationId: 'c1', message: mockMessage() }));
      expect(state.messages.c1).toHaveLength(1);
    });

    it('addMessage appends to existing conversation', () => {
      let state = createFriendsState({ messages: { c1: [mockMessage()] } });
      state = friendsReducer(state, addMessage({ conversationId: 'c1', message: mockMessage({ id: 'm2' }) }));
      expect(state.messages.c1).toHaveLength(2);
    });

    it('clearError clears error', () => {
      let state = createFriendsState({ error: 'Something failed' });
      state = friendsReducer(state, clearError());
      expect(state.error).toBeNull();
    });

    it('resetFriendsState returns initial state', () => {
      let state = createFriendsState({ friends: [mockFriend()], circleTheme: 'solar' });
      state = friendsReducer(state, resetFriendsState());
      expect(state.friends).toHaveLength(0);
      expect(state.circleTheme).toBe('nebula');
    });
  });

  describe('async thunk reducers — generateInviteCode', () => {
    it('pending sets loading and clears error', () => {
      let state = createFriendsState({ error: 'old error' });
      state = friendsReducer(state, { type: generateInviteCode.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled sets invite code', () => {
      let state = createFriendsState({ isLoading: true });
      state = friendsReducer(state, { type: generateInviteCode.fulfilled.type, payload: 'ABC123' });
      expect(state.isLoading).toBe(false);
      expect(state.inviteCode).toBe('ABC123');
    });

    it('rejected sets error', () => {
      let state = createFriendsState({ isLoading: true });
      state = friendsReducer(state, { type: generateInviteCode.rejected.type, payload: 'Failed' });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed');
    });
  });

  describe('async thunk reducers — acceptInvite', () => {
    it('pending sets loading', () => {
      let state = createFriendsState();
      state = friendsReducer(state, { type: acceptInvite.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled switches to friends tab', () => {
      let state = createFriendsState({ isLoading: true, activeTab: 'invite' });
      state = friendsReducer(state, { type: acceptInvite.fulfilled.type });
      expect(state.isLoading).toBe(false);
      expect(state.activeTab).toBe('friends');
    });

    it('rejected sets error', () => {
      let state = createFriendsState({ isLoading: true });
      state = friendsReducer(state, { type: acceptInvite.rejected.type, payload: 'Invalid code' });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Invalid code');
    });
  });

  describe('async thunk reducers — fetchFriends', () => {
    it('fulfilled replaces friends', () => {
      let state = createFriendsState();
      const friends = [mockFriend(), mockFriend({ uid: 'f2' })];
      state = friendsReducer(state, { type: fetchFriends.fulfilled.type, payload: friends });
      expect(state.friends).toHaveLength(2);
    });
  });

  describe('async thunk reducers — createTask', () => {
    it('fulfilled appends task', () => {
      let state = createFriendsState({ tasks: [mockTask()] });
      const newTask = mockTask({ id: 't2' });
      state = friendsReducer(state, { type: createTask.fulfilled.type, payload: newTask });
      expect(state.tasks).toHaveLength(2);
    });

    it('fulfilled ignores null payload', () => {
      let state = createFriendsState({ tasks: [mockTask()] });
      state = friendsReducer(state, { type: createTask.fulfilled.type, payload: null });
      expect(state.tasks).toHaveLength(1);
    });
  });

  describe('async thunk reducers — respondToTask', () => {
    it('fulfilled updates task status', () => {
      let state = createFriendsState({ tasks: [mockTask({ id: 't1', status: 'pending' })] });
      state = friendsReducer(state, { type: respondToTask.fulfilled.type, payload: { taskId: 't1', status: 'completed' } });
      expect(state.tasks[0].status).toBe('completed');
    });

    it('fulfilled ignores unknown task', () => {
      let state = createFriendsState({ tasks: [mockTask({ id: 't1' })] });
      state = friendsReducer(state, { type: respondToTask.fulfilled.type, payload: { taskId: 'missing', status: 'completed' } });
      expect(state.tasks[0].status).toBe('pending');
    });
  });

  describe('async thunk reducers — fetchSharedTasks', () => {
    it('fulfilled replaces shared tasks', () => {
      let state = createFriendsState();
      state = friendsReducer(state, { type: fetchSharedTasks.fulfilled.type, payload: [mockSharedTask()] });
      expect(state.sharedTasks).toHaveLength(1);
    });
  });

  describe('async thunk reducers — revokeSharedTask', () => {
    it('fulfilled marks task revoked by shareCode', () => {
      let state = createFriendsState({ sharedTasks: [mockSharedTask({ shareCode: 'code1', status: 'active' })] });
      state = friendsReducer(state, { type: revokeSharedTask.fulfilled.type, payload: 'code1' });
      expect(state.sharedTasks[0].status).toBe('revoked');
    });

    it('fulfilled marks task revoked by id fallback', () => {
      let state = createFriendsState({ sharedTasks: [mockSharedTask({ id: 'st1', shareCode: '', status: 'active' })] });
      state = friendsReducer(state, { type: revokeSharedTask.fulfilled.type, payload: 'st1' });
      expect(state.sharedTasks[0].status).toBe('revoked');
    });
  });

  describe('async thunk reducers — revokeTask', () => {
    it('fulfilled marks task revoked', () => {
      let state = createFriendsState({ tasks: [mockTask({ id: 't1', status: 'pending' })] });
      state = friendsReducer(state, { type: revokeTask.fulfilled.type, payload: 't1' });
      expect(state.tasks[0].status).toBe('revoked');
    });
  });

  describe('async thunk reducers — fetchFriendRequests', () => {
    it('fulfilled replaces requests and recalculates unread', () => {
      let state = createFriendsState({ tasks: [mockTask()] });
      state = friendsReducer(state, { type: fetchFriendRequests.fulfilled.type, payload: [mockFriend(), mockFriend({ uid: 'f2' })] });
      expect(state.friendRequests).toHaveLength(2);
      expect(state.unreadTotal).toBe(3);
    });
  });

  describe('async thunk reducers — acceptFriendRequest', () => {
    it('pending sets loading', () => {
      let state = createFriendsState();
      state = friendsReducer(state, { type: acceptFriendRequest.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled removes request and recalculates unread', () => {
      let state = createFriendsState({
        friendRequests: [mockFriend({ uid: 'f1' }), mockFriend({ uid: 'f2' })],
        tasks: [mockTask()],
      });
      state = friendsReducer(state, { type: acceptFriendRequest.fulfilled.type, payload: 'f1' });
      expect(state.friendRequests).toHaveLength(1);
      expect(state.friendRequests[0].uid).toBe('f2');
      expect(state.unreadTotal).toBe(2);
      expect(state.isLoading).toBe(false);
    });

    it('rejected sets error', () => {
      let state = createFriendsState({ isLoading: true });
      state = friendsReducer(state, { type: acceptFriendRequest.rejected.type, payload: 'Error' });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Error');
    });
  });

  describe('async thunk reducers — declineFriendRequest', () => {
    it('pending sets loading', () => {
      let state = createFriendsState();
      state = friendsReducer(state, { type: declineFriendRequest.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled removes request and recalculates unread', () => {
      let state = createFriendsState({
        friendRequests: [mockFriend({ uid: 'f1' })],
        tasks: [mockTask()],
      });
      state = friendsReducer(state, { type: declineFriendRequest.fulfilled.type, payload: 'f1' });
      expect(state.friendRequests).toHaveLength(0);
      expect(state.unreadTotal).toBe(1);
      expect(state.isLoading).toBe(false);
    });

    it('rejected sets error', () => {
      let state = createFriendsState({ isLoading: true });
      state = friendsReducer(state, { type: declineFriendRequest.rejected.type, payload: 'Error' });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Error');
    });
  });
});
