/**
 * Friends Slice - Redux state for Cosmic Circle
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  FriendsService,
  type FriendProfile,
  type Message,
  type TaskRitual,
  type Conversation,
} from '../services/friendsService';
import {
  TaskShareService,
  type SharedTask,
} from '../services/taskShareService';
import { getErrorMessage } from '../utils/errorUtils';

// ============================================================================
// Types
// ============================================================================

export type CircleTheme = 'nebula' | 'solar' | 'void' | 'aurora' | 'quantum';

export interface FriendsState {
  // Theme
  circleTheme: CircleTheme;
  
  // Data
  friends: FriendProfile[];
  friendRequests: FriendProfile[];
  sentRequests: FriendProfile[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  tasks: TaskRitual[];
  sharedTasks: SharedTask[];
  inviteCode: string | null;
  
  // UI State
  selectedFriend: FriendProfile | null;
  activeTab: 'friends' | 'messages' | 'tasks' | 'invite' | 'requests';
  isLoading: boolean;
  error: string | null;
  unreadTotal: number;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: FriendsState = {
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
};

// ============================================================================
// Async Thunks
// ============================================================================

export const generateInviteCode = createAsyncThunk(
  'friends/generateInviteCode',
  async (_, { rejectWithValue }) => {
    try {
      const code = await FriendsService.createInviteCode();
      if (!code) {
        return rejectWithValue('Unable to generate code. Make sure you are signed in and Firebase is configured.');
      }
      return code;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to generate invite code. Check your connection and Firestore rules.'));
    }
  }
);

export const acceptInvite = createAsyncThunk(
  'friends/acceptInvite',
  async (code: string, { rejectWithValue }) => {
    try {
      const result = await FriendsService.acceptInvite(code);
      if (!result.success) {
        return rejectWithValue(result.error);
      }
      return true;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to accept invite. Check your connection and Firestore rules.'));
    }
  }
);

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async () => {
    return await FriendsService.getFriends();
  }
);

export const createTask = createAsyncThunk(
  'friends/createTask',
  async (params: {
    assigneeId: string;
    title: string;
    description: string;
    hekaDate?: { year: number; month: number; day: number };
  }) => {
    return await FriendsService.createTaskRitual(
      params.assigneeId,
      params.title,
      params.description,
      params.hekaDate
    );
  }
);

export const respondToTask = createAsyncThunk(
  'friends/respondToTask',
  async (params: {
    taskId: string;
    status: 'accepted' | 'declined' | 'completed';
    declinedReason?: string;
  }) => {
    await FriendsService.respondToTask(
      params.taskId,
      params.status,
      params.declinedReason
    );
    return params;
  }
);

export const fetchSharedTasks = createAsyncThunk(
  'friends/fetchSharedTasks',
  async () => {
    return await TaskShareService.getCreatorSharedTasks();
  }
);

export const revokeSharedTask = createAsyncThunk(
  'friends/revokeSharedTask',
  async (shareCode: string, { rejectWithValue }) => {
    const result = await TaskShareService.revokeSharedTask(shareCode);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return shareCode;
  }
);

export const revokeTask = createAsyncThunk(
  'friends/revokeTask',
  async (taskId: string, { rejectWithValue }) => {
    const result = await FriendsService.revokeTask(taskId);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return taskId;
  }
);

export const fetchFriendRequests = createAsyncThunk(
  'friends/fetchFriendRequests',
  async () => {
    return await FriendsService.getPendingFriendRequests();
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friends/acceptFriendRequest',
  async (friendshipId: string, { rejectWithValue }) => {
    try {
      const result = await FriendsService.acceptFriendRequest(friendshipId);
      if (!result.success) {
        return rejectWithValue(result.error);
      }
      return friendshipId;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to accept friend request.'));
    }
  }
);

export const declineFriendRequest = createAsyncThunk(
  'friends/declineFriendRequest',
  async (friendshipId: string, { rejectWithValue }) => {
    try {
      const result = await FriendsService.declineFriendRequest(friendshipId);
      if (!result.success) {
        return rejectWithValue(result.error);
      }
      return friendshipId;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to decline friend request.'));
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setCircleTheme: (state, action: PayloadAction<CircleTheme>) => {
      state.circleTheme = action.payload;
    },
    
    setActiveTab: (state, action: PayloadAction<FriendsState['activeTab']>) => {
      state.activeTab = action.payload;
    },
    
    setSelectedFriend: (state, action: PayloadAction<FriendProfile | null>) => {
      state.selectedFriend = action.payload;
      // If selecting a friend, switch to messages tab
      if (action.payload) {
        state.activeTab = 'messages';
      }
    },
    
    setActiveConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.activeConversation = action.payload;
    },
    
    updateFriends: (state, action: PayloadAction<FriendProfile[]>) => {
      state.friends = action.payload;
    },
    
    updateMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    
    updateTasks: (state, action: PayloadAction<TaskRitual[]>) => {
      state.tasks = action.payload;
      // Calculate unread total (pending tasks assigned to user + friend requests)
      const pendingTasks = action.payload.filter(t => t.status === 'pending').length;
      const pendingRequests = state.friendRequests.length;
      state.unreadTotal = pendingTasks + pendingRequests;
    },

    updateSharedTasks: (state, action: PayloadAction<SharedTask[]>) => {
      state.sharedTasks = action.payload;
    },
    
    updateFriendRequests: (state, action: PayloadAction<FriendProfile[]>) => {
      state.friendRequests = action.payload;
      // Recalculate unread total
      const pendingTasks = state.tasks.filter(t => t.status === 'pending').length;
      state.unreadTotal = pendingTasks + action.payload.length;
    },
    
    removeFriendRequest: (state, action: PayloadAction<string>) => {
      state.friendRequests = state.friendRequests.filter(
        f => f.uid !== action.payload
      );
      const pendingTasks = state.tasks.filter(t => t.status === 'pending').length;
      state.unreadTotal = pendingTasks + state.friendRequests.length;
    },
    
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetFriendsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Generate Invite
      .addCase(generateInviteCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateInviteCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inviteCode = action.payload;
      })
      .addCase(generateInviteCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Accept Invite
      .addCase(acceptInvite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptInvite.fulfilled, (state) => {
        state.isLoading = false;
        state.activeTab = 'friends';
      })
      .addCase(acceptInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Friends
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
      })
      
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks.push(action.payload);
        }
      })
      
      // Respond to Task
      .addCase(respondToTask.fulfilled, (state, action) => {
        const { taskId, status } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = status;
        }
      })

      // Fetch Shared Tasks
      .addCase(fetchSharedTasks.fulfilled, (state, action) => {
        state.sharedTasks = action.payload;
      })

      // Revoke Shared Task
      .addCase(revokeSharedTask.fulfilled, (state, action) => {
        const shareCode = action.payload;
        const task = state.sharedTasks.find(t => t.shareCode === shareCode || t.id === shareCode);
        if (task) {
          task.status = 'revoked';
        }
      })

      // Revoke Direct Task
      .addCase(revokeTask.fulfilled, (state, action) => {
        const taskId = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = 'revoked';
        }
      })
      
      // Fetch Friend Requests
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.friendRequests = action.payload;
        const pendingTasks = state.tasks.filter(t => t.status === 'pending').length;
        state.unreadTotal = pendingTasks + action.payload.length;
      })
      
      // Accept Friend Request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        // Move from requests to friends (will be refreshed by listener)
        state.friendRequests = state.friendRequests.filter(
          f => f.uid !== action.payload
        );
        const pendingTasks = state.tasks.filter(t => t.status === 'pending').length;
        state.unreadTotal = pendingTasks + state.friendRequests.length;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Decline Friend Request
      .addCase(declineFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friendRequests = state.friendRequests.filter(
          f => f.uid !== action.payload
        );
        const pendingTasks = state.tasks.filter(t => t.status === 'pending').length;
        state.unreadTotal = pendingTasks + state.friendRequests.length;
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================================================
// Exports
// ============================================================================

export const {
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
} = friendsSlice.actions;

export default friendsSlice.reducer;
