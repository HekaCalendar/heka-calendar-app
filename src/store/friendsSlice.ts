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

// ============================================================================
// Types
// ============================================================================

export type CircleTheme = 'nebula' | 'solar' | 'void' | 'aurora' | 'quantum';

export interface FriendsState {
  // Theme
  circleTheme: CircleTheme;
  
  // Data
  friends: FriendProfile[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  tasks: TaskRitual[];
  inviteCode: string | null;
  
  // UI State
  selectedFriend: FriendProfile | null;
  activeTab: 'friends' | 'messages' | 'tasks' | 'invite';
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
  conversations: [],
  activeConversation: null,
  messages: {},
  tasks: [],
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
  async () => {
    return await FriendsService.createInviteCode();
  }
);

export const acceptInvite = createAsyncThunk(
  'friends/acceptInvite',
  async (code: string, { rejectWithValue }) => {
    const result = await FriendsService.acceptInvite(code);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return true;
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
      // Calculate unread total (pending tasks assigned to user)
      state.unreadTotal = action.payload.filter(
        t => t.status === 'pending'
      ).length;
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
      .addCase(generateInviteCode.fulfilled, (state, action) => {
        state.inviteCode = action.payload;
      })
      
      // Accept Invite
      .addCase(acceptInvite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptInvite.fulfilled, (state) => {
        state.isLoading = false;
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
  addMessage,
  clearError,
  resetFriendsState,
} = friendsSlice.actions;

export default friendsSlice.reducer;
