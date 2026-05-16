/**
 * Cosmic Circle - Friends Modal
 * Elite social layer for the HEKA Calendar
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Share } from '@capacitor/share';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import type { RootState } from '../store';
import {
  setActiveTab,
  setSelectedFriend,
  updateFriends,
  updateMessages,
  updateTasks,
  updateSharedTasks,
  updateFriendRequests,
  generateInviteCode,
  acceptInvite,
  acceptFriendRequest,
  declineFriendRequest,
  createTask,
  respondToTask,
  revokeSharedTask,
  revokeTask,
  clearError,
} from '../store/friendsSlice';
import { FriendsService } from '../services/friendsService';
import { TaskShareService } from '../services/taskShareService';
import { aiConfigService } from '../services/aiConfigService';
import { getCurrentUser } from '../services/firebase';
import { generateInviteLink, generateWebInviteLink } from '../services/deepLinkService';
import i18n from '../i18n';
import { ProfileSetupModal } from './ProfileSetupModal';
import { CircleSettings } from './notification/CircleSettings';
import '../styles/cosmic-circle.css';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Reactions available for messages
// const REACTIONS = ['🌙', '☀️', '⭐', '🔥', '💧', '🌍', '✨', '🕯️'];

export const FriendsModal: React.FC<FriendsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('circle');
  const dispatch = useDispatch<AppDispatch>();
  const {
    circleTheme,
    friends,
    friendRequests,
    messages,
    tasks,
    sharedTasks,
    inviteCode,
    selectedFriend,
    activeTab,
    isLoading,
    error,
    unreadTotal,
  } = useSelector((state: RootState) => state.friends);

  const [inviteInput, setInviteInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    hekaDate: '',
  });
  const [taskTab, setTaskTab] = useState<'assigned' | 'created' | 'shared'>('assigned');
  const [copied, setCopied] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showShareTask, setShowShareTask] = useState(false);
  const [shareableTaskCode, setShareableTaskCode] = useState<string | null>(null);
  const [taskCopied, setTaskCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [circleAIEnabled, setCircleAIEnabled] = useState(() => aiConfigService.isAreaEnabled('circle'));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Listen for AI config changes
  useEffect(() => {
    const unsubscribe = aiConfigService.subscribe((config) => {
      setCircleAIEnabled(config.globalEnabled && config.areas.circle);
    });
    return unsubscribe;
  }, []);
  const currentUser = getCurrentUser();
  
  // Check if user needs to set up profile (no displayName)
  const auth = useSelector((state: RootState) => state.calendar.auth);
  const needsProfileSetup = auth.isAuthenticated && !auth.displayName;

  // Check if profile setup is needed when modal opens
  useEffect(() => {
    if (isOpen && needsProfileSetup) {
      setShowProfileSetup(true);
    }
  }, [isOpen, needsProfileSetup]);

  // Ensure user profile exists when modal opens
  useEffect(() => {
    if (isOpen && currentUser && !needsProfileSetup) {
      void FriendsService.ensureUserProfile();
    }
  }, [isOpen, currentUser, needsProfileSetup]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const unsubscribeFriends = FriendsService.subscribeToFriends((updatedFriends) => {
      dispatch(updateFriends(updatedFriends));
    });

    const unsubscribeTasks = FriendsService.subscribeToTasks((updatedTasks) => {
      dispatch(updateTasks(updatedTasks));
    });

    const unsubscribeRequests = FriendsService.subscribeToFriendRequests((updatedRequests) => {
      dispatch(updateFriendRequests(updatedRequests));
    });

    const unsubscribeSharedTasks = TaskShareService.subscribeToCreatorSharedTasks((updatedSharedTasks) => {
      dispatch(updateSharedTasks(updatedSharedTasks));
    });

    // Update presence
    FriendsService.updatePresence('Cosmic Circle');

    return () => {
      unsubscribeFriends();
      unsubscribeTasks();
      unsubscribeRequests();
      unsubscribeSharedTasks();
    };
  }, [isOpen, dispatch, currentUser]);

  // Subscribe to messages when a friend is selected
  useEffect(() => {
    if (!selectedFriend || !currentUser) return;

    const conversationId = [currentUser.uid, selectedFriend.uid].sort().join('_');
    const conversationIdWithPrefix = `conv_${conversationId}`;
    
    const unsubscribe = FriendsService.subscribeToMessages(
      conversationIdWithPrefix,
      (updatedMessages) => {
        dispatch(updateMessages({ conversationId: conversationIdWithPrefix, messages: updatedMessages }));
      }
    );

    // Mark as read
    FriendsService.markConversationRead(conversationIdWithPrefix);

    return () => unsubscribe();
  }, [selectedFriend, dispatch, currentUser]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (selectedFriend && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedFriend]);

  const handleGenerateCode = useCallback(() => {
    void dispatch(generateInviteCode());
  }, [dispatch]);

  const handleAcceptInvite = useCallback(() => {
    if (inviteInput.trim()) {
      void dispatch(acceptInvite(inviteInput.trim()));
      setInviteInput('');
    }
  }, [dispatch, inviteInput]);

  const handleCopyCode = useCallback(() => {
    if (inviteCode) {
      // Copy the deep link for better UX
      const deepLink = generateInviteLink(inviteCode);
      navigator.clipboard.writeText(deepLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [inviteCode]);

  const handleShareInvite = useCallback(async () => {
    if (!inviteCode) return;

    const webLink = generateWebInviteLink(inviteCode, currentUser?.displayName || undefined, 'friend');

    try {
      await Share.share({
        title: t('invite.shareTitle'),
        text: t('invite.shareText', { code: inviteCode }),
        url: webLink,
        dialogTitle: t('invite.shareDialogTitle'),
      });
    } catch (e) {
      // User cancelled or native share unavailable — silently ignore
    }
  }, [inviteCode]);

  const handleCreateShareableTask = useCallback(async () => {
    if (!taskForm.title.trim()) return;
    
    // Parse HEKA date if provided
    let hekaDate: { year: number; month: number; day: number } | undefined;
    if (taskForm.hekaDate) {
      const parts = taskForm.hekaDate.split('.');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          hekaDate = { year, month, day };
        }
      }
    }
    
    const result = await TaskShareService.createShareableTask(
      taskForm.title,
      taskForm.description,
      hekaDate
    );
    
    if (result.success && result.shareCode) {
      setShareableTaskCode(result.shareCode);
      setShowShareTask(true);
    }
  }, [taskForm]);

  const handleCopyTaskLink = useCallback(() => {
    if (!shareableTaskCode) return;
    
    // Copy the full share message with smart link
    const shareText = TaskShareService.generateTaskShareText(
      taskForm.title,
      shareableTaskCode,
      currentUser?.displayName || t('invite.aFriend')
    );
    navigator.clipboard.writeText(shareText);
    setTaskCopied(true);
    setTimeout(() => setTaskCopied(false), 2000);
  }, [shareableTaskCode, taskForm.title, currentUser?.displayName]);

  const handleShareTaskLink = useCallback(async () => {
    if (!shareableTaskCode) return;
    
    const shareText = TaskShareService.generateTaskShareText(
      taskForm.title,
      shareableTaskCode,
      currentUser?.displayName || 'A friend'
    );
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('invite.taskShareTitle', { title: taskForm.title }),
          text: shareText,
        });
        return;
      } catch (e) {
        // Fall back to clipboard
      }
    }
    
    // Fallback: copy full message to clipboard
    navigator.clipboard.writeText(shareText);
    setTaskCopied(true);
    setTimeout(() => setTaskCopied(false), 2000);
  }, [shareableTaskCode, taskForm.title, currentUser?.displayName]);

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !selectedFriend || !currentUser) return;

    const conversationId = [currentUser.uid, selectedFriend.uid].sort().join('_');
    const conversationIdWithPrefix = `conv_${conversationId}`;
    
    FriendsService.sendMessage(conversationIdWithPrefix, messageInput.trim());
    setMessageInput('');
  }, [messageInput, selectedFriend, currentUser]);

  const handleCreateTask = useCallback(() => {
    if (!taskForm.title.trim() || !selectedFriend) return;

    const hekaDateParts = taskForm.hekaDate.split('.').map(Number);
    const hekaDate = hekaDateParts.length === 3
      ? { year: hekaDateParts[2], month: hekaDateParts[1] - 1, day: hekaDateParts[0] }
      : undefined;

    void dispatch(createTask({
      assigneeId: selectedFriend.uid,
      title: taskForm.title,
      description: taskForm.description,
      hekaDate,
    }));

    setTaskForm({ title: '', description: '', hekaDate: '' });
    setShowCreateTask(false);
  }, [dispatch, taskForm, selectedFriend]);

  const handleTaskResponse = useCallback((taskId: string, status: 'accepted' | 'declined' | 'completed') => {
    void dispatch(respondToTask({ taskId, status }));
  }, [dispatch]);

  if (!isOpen) return null;

  const conversationId = selectedFriend && currentUser
    ? `conv_${[currentUser.uid, selectedFriend.uid].sort().join('_')}`
    : '';
  const currentMessages = messages[conversationId] || [];

  const myTasks = tasks.filter(t => t.creatorId === currentUser?.uid);
  const assignedTasks = tasks.filter(t => t.assigneeId === currentUser?.uid);

  return (
    <div 
      className="cosmic-circle-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-circle-theme={circleTheme}
    >
      <div className="cosmic-circle">
        {/* Header */}
        <header className="cosmic-circle__header">
          <h2 className="cosmic-circle__title">
            <span className="cosmic-circle__title-icon">✦</span>
            {t('modal.title')}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {/* My Profile */}
            <button
              className="btn btn--sm"
              onClick={() => setShowProfileSetup(true)}
              title={t('profile.editProfile')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>{auth.photoURL || '👤'}</span>
              <span>{auth.displayName || t('profile.profileFallback')}</span>
            </button>
            
            {/* Settings */}
            <button
              className="btn btn--sm"
              onClick={() => setShowSettings(true)}
              title={t('profile.settings')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}
            >
              ⚙️
            </button>
            
            <button className="cosmic-circle__close" onClick={onClose}>×</button>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="cosmic-circle__tabs">
          <button
            className={`cosmic-circle__tab ${activeTab === 'friends' ? 'cosmic-circle__tab--active' : ''}`}
            onClick={() => dispatch(setActiveTab('friends'))}
          >
            {t('tabs.friends')}
            {friends.length > 0 && <span className="cosmic-circle__tab-badge">{friends.length}</span>}
          </button>
          <button
            className={`cosmic-circle__tab ${activeTab === 'messages' ? 'cosmic-circle__tab--active' : ''}`}
            onClick={() => dispatch(setActiveTab('messages'))}
          >
            {t('tabs.messages')}
            {unreadTotal > 0 && <span className="cosmic-circle__tab-badge">{unreadTotal}</span>}
          </button>
          <button
            className={`cosmic-circle__tab ${activeTab === 'requests' ? 'cosmic-circle__tab--active' : ''}`}
            onClick={() => dispatch(setActiveTab('requests'))}
          >
            {t('tabs.requests')}
            {friendRequests.length > 0 && (
              <span className="cosmic-circle__tab-badge">{friendRequests.length}</span>
            )}
          </button>
          <button
            className={`cosmic-circle__tab ${activeTab === 'tasks' ? 'cosmic-circle__tab--active' : ''}`}
            onClick={() => dispatch(setActiveTab('tasks'))}
          >
            {t('tabs.tasks')}
            {tasks.filter(t => t.status === 'pending').length > 0 && (
              <span className="cosmic-circle__tab-badge">
                {tasks.filter(t => t.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            className={`cosmic-circle__tab ${activeTab === 'invite' ? 'cosmic-circle__tab--active' : ''}`}
            onClick={() => dispatch(setActiveTab('invite'))}
          >
            {t('tabs.invite')}
          </button>
        </nav>

        {/* Circle AI Coach */}
        {circleAIEnabled && (
          <CircleAICoachBanner
            friendsCount={friends.length}
            pendingTasks={tasks.filter(t => t.status === 'pending' && t.assigneeId === currentUser?.uid).length}
            unreadMessages={unreadTotal}
            activeTab={activeTab}
            onInvite={() => {
              dispatch(setActiveTab('invite'));
              if (!inviteCode) {
                void dispatch(generateInviteCode());
              }
            }}
            onViewTasks={() => dispatch(setActiveTab('tasks'))}
          />
        )}

        {/* Content */}
        <div className="cosmic-circle__content">
          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="cosmic-circle__panel">
              {friends.length === 0 ? (
                <div className="circle-friends__empty">
                  <div className="circle-friends__empty-icon">🌌</div>
                  <p>{t('friendsList.emptyTitle')}</p>
                  <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                    {t('friendsList.emptyDescription')}
                  </p>
                </div>
              ) : (
                <div className="circle-friends__list">
                  {friends.map((friend) => (
                    <div
                      key={friend.uid}
                      className="circle-friend"
                      onClick={() => dispatch(setSelectedFriend(friend))}
                    >
                      <div className={`circle-friend__avatar ${friend.isOnline ? 'circle-friend__avatar--online' : ''}`}>
                        {friend.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="circle-friend__info">
                        <div className="circle-friend__name">{friend.displayName}</div>
                        <div className="circle-friend__status">
                          {friend.isOnline 
                            ? `${t('friendsList.online')}${friend.currentView ? t('friendsList.currentView', { view: friend.currentView }) : ''}`
                            : `${t('friendsList.offline')}${friend.lastActive ? t('friendsList.lastActive', { time: formatLastActive(friend.lastActive) }) : ''}`
                          }
                        </div>
                      </div>
                      <div className="circle-friend__actions">
                        <button 
                          className="circle-friend__btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedFriend(friend));
                          }}
                          title={t('friendsList.message')}
                        >
                          💬
                        </button>
                        <button 
                          className="circle-friend__btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedFriend(friend));
                            setShowCreateTask(true);
                          }}
                          title={t('friendsList.sendTask')}
                        >
                          📜
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="cosmic-circle__panel">
              {!selectedFriend ? (
                <div className="circle-friends__empty">
                  <div className="circle-friends__empty-icon">💬</div>
                  <p>{t('messages.emptyTitle')}</p>
                  <button 
                    className="circle-invite__btn"
                    style={{ marginTop: 'var(--space-4)', maxWidth: '200px' }}
                    onClick={() => dispatch(setActiveTab('friends'))}
                  >
                    {t('messages.viewFriends')}
                  </button>
                </div>
              ) : (
                <div className="circle-messages">
                  <div className="circle-messages__header">
                    <button 
                      className="circle-messages__back"
                      onClick={() => dispatch(setSelectedFriend(null))}
                    >
                      ←
                    </button>
                    <div className="circle-friend__avatar" style={{ width: '36px', height: '36px', fontSize: 'var(--text-sm)' }}>
                      {selectedFriend.displayName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--circle-text-primary)' }}>
                      {selectedFriend.displayName}
                    </span>
                  </div>

                  <div className="circle-messages__list">
                    {currentMessages.length === 0 ? (
                      <div className="circle-friends__empty" style={{ padding: 'var(--space-8)' }}>
                        <p>{t('messages.noMessages')}</p>
                        <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                          {t('messages.startConversation')}
                        </p>
                      </div>
                    ) : (
                      currentMessages.map((msg, idx) => (
                        <div
                          key={msg.id || idx}
                          className={`circle-message ${msg.senderId === currentUser?.uid ? 'circle-message--own' : ''}`}
                        >
                          <div className="circle-message__bubble">
                            <div className="circle-message__text">{msg.text}</div>
                            <div className="circle-message__time">
                              {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="circle-message__input-area">
                    <input
                      type="text"
                      className="circle-message__input"
                      placeholder={t('messages.placeholder')}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="circle-message__send" onClick={handleSendMessage}>
                      {t('messages.send')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="cosmic-circle__panel">
              {/* Create & Share Task Button - Always visible */}
              <div style={{ 
                padding: 'var(--space-3)', 
                borderBottom: '1px solid var(--color-border)',
                background: 'rgba(212, 175, 55, 0.05)',
              }}>
                <button
                  className="btn btn--primary"
                  onClick={() => setShowShareTask(true)}
                  style={{ width: '100%' }}
                >
                  {t('tasks.createAndShare')}
                </button>
                <p style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--color-text-muted)', 
                  textAlign: 'center',
                  marginTop: 'var(--space-2)',
                  marginBottom: 0,
                }}>
                  {t('tasks.createDescription')}
                </p>
              </div>

              <div className="circle-tasks__tabs">
                <button
                  className={`circle-tasks__tab ${taskTab === 'assigned' ? 'circle-tasks__tab--active' : ''}`}
                  onClick={() => setTaskTab('assigned')}
                >
                  {t('tasks.assignedToYou', { count: assignedTasks.length })}
                </button>
                <button
                  className={`circle-tasks__tab ${taskTab === 'created' ? 'circle-tasks__tab--active' : ''}`}
                  onClick={() => setTaskTab('created')}
                >
                  {t('tasks.createdByYou', { count: myTasks.length })}
                </button>
                <button
                  className={`circle-tasks__tab ${taskTab === 'shared' ? 'circle-tasks__tab--active' : ''}`}
                  onClick={() => setTaskTab('shared')}
                >
                  {t('tasks.sharedByYou', { count: sharedTasks.length })}
                </button>
              </div>

              {(() => {
                const currentList = taskTab === 'assigned' ? assignedTasks : taskTab === 'created' ? myTasks : sharedTasks;
                const emptyMessageKey = taskTab === 'assigned' ? 'tasks.emptyAssigned' : taskTab === 'created' ? 'tasks.emptyCreated' : 'tasks.emptyShared';

                if (currentList.length === 0) {
                  return (
                    <div className="circle-friends__empty">
                      <div className="circle-friends__empty-icon">📜</div>
                      <p>{t('tasks.noEmpty', { message: t(emptyMessageKey) })}</p>
                      {taskTab === 'assigned' && (
                        <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                          {t('tasks.assignedHint')}
                        </p>
                      )}
                      {taskTab === 'created' && friends.length === 0 && (
                        <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                            {t('tasks.noFriendsHint')}
                          </p>
                          <button
                            className="btn btn--sm"
                            onClick={() => setShowShareTask(true)}
                          >
                            {t('tasks.shareFirstTask')}
                          </button>
                        </div>
                      )}
                      {taskTab === 'shared' && (
                        <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                          {t('tasks.sharedHint')}
                        </p>
                      )}
                    </div>
                  );
                }

                if (taskTab === 'shared') {
                  return sharedTasks.map((task) => {
                    const isExpired = task.expiresAt ? task.expiresAt.toMillis() < Date.now() : false;
                    const daysUntilExpiry = task.expiresAt
                      ? Math.ceil((task.expiresAt.toMillis() - Date.now()) / (1000 * 60 * 60 * 24))
                      : 0;
                    const expiryText = isExpired
                      ? t('tasks.expired')
                      : daysUntilExpiry <= 0
                        ? t('tasks.expiresToday')
                        : daysUntilExpiry === 1
                          ? t('tasks.expiresInOneDay')
                          : t('tasks.expiresInDays', { days: daysUntilExpiry });

                    return (
                      <div key={task.id} className="circle-task">
                        <div className="circle-task__header">
                          <div className="circle-task__title">{t('tasks.taskTitle', { title: task.title })}</div>
                          <span className={`circle-task__status circle-task__status--${task.status}`}>
                            {t(`tasks.status.${task.status}`)}
                          </span>
                        </div>
                        <div className="circle-task__description">{task.description}</div>
                        <div className="circle-task__meta">
                          {task.hekaDate && (
                            <span className="circle-task__date">
                              {t('tasks.dueDate', { day: task.hekaDate.day, month: task.hekaDate.month + 1, year: task.hekaDate.year })}
                            </span>
                          )}
                          <span style={{ color: isExpired ? '#ef4444' : daysUntilExpiry <= 1 ? '#f59e0b' : 'inherit' }}>
                            {t('tasks.expiry', { text: expiryText })}
                          </span>
                        </div>
                        <div className="circle-task__meta" style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>
                          <span>{t('tasks.shareCode', { code: task.shareCode })}</span>
                          {task.acceptedBy && <span>{t('tasks.acceptedByRecipient')}</span>}
                        </div>
                        {task.status === 'pending' && !isExpired && (
                          <div className="circle-task__actions">
                            <button
                              className="circle-task__btn circle-task__btn--decline"
                              onClick={() => void dispatch(revokeSharedTask(task.shareCode))}
                            >
                              {t('tasks.revoke')}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  });
                }

                return currentList.map((task) => (
                  <div key={task.id} className="circle-task">
                    <div className="circle-task__header">
                      <div className="circle-task__title">
                        {t('tasks.taskTitleSimple', { title: task.title })}
                      </div>
                      <span className={`circle-task__status circle-task__status--${task.status}`}>
                        {t(`tasks.status.${task.status}`)}
                      </span>
                    </div>
                    <div className="circle-task__description">{task.description}</div>
                    <div className="circle-task__meta">
                      {task.hekaDate && (
                        <span className="circle-task__date">
                          🌙 Due: {task.hekaDate.day}.{task.hekaDate.month + 1}.{task.hekaDate.year}
                        </span>
                      )}
                      <span>{t('tasks.from', { name: task.creatorId === currentUser?.uid ? t('tasks.you') : friends.find(f => f.uid === task.creatorId)?.displayName || t('tasks.unknown') })}</span>
                    </div>
                    {taskTab === 'assigned' && task.status === 'pending' && (
                      <div className="circle-task__actions">
                        <button
                          className="circle-task__btn circle-task__btn--accept"
                          onClick={() => handleTaskResponse(task.id, 'accepted')}
                        >
                          {t('tasks.accept')}
                        </button>
                        <button
                          className="circle-task__btn circle-task__btn--decline"
                          onClick={() => handleTaskResponse(task.id, 'declined')}
                        >
                          {t('tasks.decline')}
                        </button>
                      </div>
                    )}
                    {taskTab === 'assigned' && task.status === 'accepted' && (
                      <div className="circle-task__actions">
                        <button
                          className="circle-task__btn circle-task__btn--complete"
                          onClick={() => handleTaskResponse(task.id, 'completed')}
                        >
                          {t('tasks.complete')}
                        </button>
                      </div>
                    )}
                    {taskTab === 'created' && task.status === 'pending' && (
                      <div className="circle-task__actions">
                        <button
                          className="circle-task__btn circle-task__btn--decline"
                          onClick={() => void dispatch(revokeTask(task.id))}
                        >
                          {t('tasks.revoke')}
                        </button>
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="cosmic-circle__panel">
              {friendRequests.length === 0 ? (
                <div className="circle-friends__empty">
                  <div className="circle-friends__empty-icon">🔔</div>
                  <p>{t('requests.emptyTitle')}</p>
                  <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                    {t('requests.emptyDescription')}
                  </p>
                </div>
              ) : (
                <div className="circle-friends__list">
                  {friendRequests.map((request) => (
                    <div
                      key={request.uid}
                      className="circle-friend"
                    >
                      <div className="circle-friend__avatar">
                        {request.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="circle-friend__info">
                        <div className="circle-friend__name">{request.displayName}</div>
                        <div className="circle-friend__status">
                          {t('requests.wantsToConnect')}
                        </div>
                      </div>
                      <div className="circle-friend__actions">
                        <button
                          className="circle-friend__btn"
                          onClick={() => {
                            const friendshipId = [currentUser?.uid || '', request.uid].sort().join('_');
                            void dispatch(acceptFriendRequest(friendshipId)).unwrap().then(() => {
                              dispatch(setSelectedFriend(request));
                            });
                          }}
                          title={t('requests.acceptTitle')}
                          style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}
                        >
                          ✓
                        </button>
                        <button
                          className="circle-friend__btn"
                          onClick={() => {
                            const friendshipId = [currentUser?.uid || '', request.uid].sort().join('_');
                            void dispatch(declineFriendRequest(friendshipId));
                          }}
                          title={t('requests.declineTitle')}
                          style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Invite Tab */}
          {activeTab === 'invite' && (
            <div className="cosmic-circle__panel">
              <div className="circle-invite">
                <h3 className="circle-invite__title">{t('invite.title')}</h3>
                <p className="circle-invite__description">
                  {t('invite.description')}
                </p>

                {inviteCode ? (
                  <div className="circle-invite__code-display">
                    <div className="circle-invite__code-label">{t('invite.yourCode')}</div>
                    <div className="circle-invite__code" onClick={handleCopyCode} style={{ cursor: 'pointer' }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCopyCode(); } }}>
                      {inviteCode}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: 'var(--space-2)', 
                      marginTop: 'var(--space-3)',
                      justifyContent: 'center'
                    }}>
                      <button 
                        className="btn btn--sm" 
                        onClick={handleCopyCode}
                        style={{ minWidth: '100px' }}
                      >
                        {copied ? t('invite.copied') : t('invite.copyLink')}
                      </button>
                      <button 
                        className="btn btn--sm btn--primary" 
                        onClick={handleShareInvite}
                        style={{ minWidth: '100px' }}
                      >
                        {t('invite.share')}
                      </button>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', opacity: 0.6 }}>
                      {t('invite.shareHint')}
                    </div>
                  </div>
                ) : (
                  <button 
                    className="circle-invite__btn" 
                    onClick={handleGenerateCode}
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.6 : 1 }}
                  >
                    {isLoading ? t('invite.generating') : t('invite.generateCode')}
                  </button>
                )}

                <div className="circle-invite__input-section">
                  <div className="circle-invite__code-label">{t('invite.haveCode')}</div>
                  <input
                    type="text"
                    className="circle-invite__input"
                    placeholder={t('invite.placeholder')}
                    value={inviteInput}
                    onChange={(e) => {
                      setInviteInput(e.target.value.toUpperCase());
                      if (error) dispatch(clearError());
                    }}
                  />
                  {activeTab === 'invite' && error && (
                    <div style={{ color: '#ef4444', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>
                      {error}
                    </div>
                  )}
                  <button 
                    className="circle-invite__btn" 
                    onClick={handleAcceptInvite}
                    disabled={isLoading || !inviteInput.trim()}
                  >
                    {isLoading ? t('invite.connecting') : t('invite.joinCircle')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Setup Modal - Required before using Circle */}
        <ProfileSetupModal
          isOpen={showProfileSetup}
          onComplete={() => setShowProfileSetup(false)}
        />

        {/* Circle Settings */}
        <CircleSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        {/* Create Task Modal Overlay */}
        {showCreateTask && selectedFriend && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              padding: 'var(--space-6)',
            }}
            onClick={(e) => e.target === e.currentTarget && setShowCreateTask(false)}
          >
            <div className="circle-create-task">
              <h3 className="circle-create-task__title">
                {t('taskCreate.title', { name: selectedFriend.displayName })}
              </h3>
              
              <div className="circle-create-task__field">
                <label className="circle-create-task__label">{t('taskCreate.labelTitle')}</label>
                <input
                  type="text"
                  className="circle-create-task__input"
                  placeholder={t('taskCreate.placeholderTitle')}
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>

              <div className="circle-create-task__field">
                <label className="circle-create-task__label">{t('taskCreate.labelDescription')}</label>
                <textarea
                  className="circle-create-task__textarea"
                  placeholder={t('taskCreate.placeholderDescription')}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="circle-create-task__field">
                <label className="circle-create-task__label">{t('taskCreate.labelDueDate')}</label>
                <input
                  type="text"
                  className="circle-create-task__input"
                  placeholder={t('taskCreate.placeholderDueDate')}
                  value={taskForm.hekaDate}
                  onChange={(e) => setTaskForm({ ...taskForm, hekaDate: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button 
                  className="circle-task__btn circle-task__btn--decline"
                  style={{ flex: 1 }}
                  onClick={() => setShowCreateTask(false)}
                >
                  {t('taskCreate.cancel')}
                </button>
                <button 
                  className="circle-task__btn circle-task__btn--complete"
                  style={{ flex: 1 }}
                  onClick={handleCreateTask}
                  disabled={!taskForm.title.trim()}
                >
                  {t('taskCreate.createTask')}
                </button>
              </div>
              
              <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                <button
                  className="btn btn--sm btn--ghost"
                  onClick={handleCreateShareableTask}
                  disabled={!taskForm.title.trim()}
                >
                  {t('taskCreate.createShareableLink')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Standalone Create & Share Task Modal */}
        {showShareTask && !shareableTaskCode && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              padding: 'var(--space-6)',
            }}
            onClick={(e) => e.target === e.currentTarget && setShowShareTask(false)}
          >
            <div style={{
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              maxWidth: '420px',
              width: '100%',
              border: '1px solid var(--color-gold)',
            }}>
              <h3 style={{ 
                fontFamily: 'var(--font-display)', 
                marginBottom: 'var(--space-2)',
                color: 'var(--color-gold)',
                textAlign: 'center',
              }}>
                {t('taskShareModal.title')}
              </h3>
              
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
                marginBottom: 'var(--space-4)',
              }}>
                {t('taskShareModal.description')}
              </p>
              
              <div className="circle-create-task__field">
                <label className="circle-create-task__label">{t('taskShareModal.labelTitle')}</label>
                <input
                  type="text"
                  className="circle-create-task__input"
                  placeholder={t('taskShareModal.placeholderTitle')}
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>

              <div className="circle-create-task__field">
                <label className="circle-create-task__label">{t('taskShareModal.labelDescription')}</label>
                <textarea
                  className="circle-create-task__textarea"
                  placeholder={t('taskShareModal.placeholderDescription')}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="circle-create-task__field">
                <label className="circle-create-task__label">{t('taskShareModal.labelDueDate')}</label>
                <input
                  type="text"
                  className="circle-create-task__input"
                  placeholder={t('taskShareModal.placeholderDueDate')}
                  value={taskForm.hekaDate}
                  onChange={(e) => setTaskForm({ ...taskForm, hekaDate: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <button 
                  className="btn btn--ghost"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowShareTask(false);
                    setTaskForm({ title: '', description: '', hekaDate: '' });
                  }}
                >
                  {t('taskShareModal.cancel')}
                </button>
                <button 
                  className="btn btn--primary"
                  style={{ flex: 1 }}
                  onClick={handleCreateShareableTask}
                  disabled={!taskForm.title.trim()}
                >
                  {t('taskShareModal.createAndGetLink')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Task Modal - Shows after task is created */}
        {showShareTask && shareableTaskCode && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              padding: 'var(--space-6)',
            }}
            onClick={(e) => e.target === e.currentTarget && setShowShareTask(false)}
          >
            <div style={{
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              maxWidth: '400px',
              width: '100%',
              border: '1px solid var(--color-gold)',
            }}>
              <h3 style={{ 
                fontFamily: 'var(--font-display)', 
                marginBottom: 'var(--space-4)',
                color: 'var(--color-gold)',
                textAlign: 'center',
              }}>
                {t('taskShareModal.taskReady')}
              </h3>
              
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)',
              }}>
                <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>{taskForm.title}</p>
                {taskForm.description && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    {taskForm.description}
                  </p>
                )}
              </div>

              <div style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px dashed var(--color-gold)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                textAlign: 'center',
                marginBottom: 'var(--space-4)',
              }}>
                <code style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-gold)',
                  letterSpacing: '0.1em',
                }}>
                  {shareableTaskCode}
                </code>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  className="btn btn--secondary"
                  style={{ flex: 1 }}
                  onClick={handleCopyTaskLink}
                >
                  {taskCopied ? t('invite.copied') : t('invite.copyLink')}
                </button>
                <button
                  className="btn btn--primary"
                  style={{ flex: 1 }}
                  onClick={handleShareTaskLink}
                >
                  {t('invite.share')}
                </button>
              </div>

              <button
                className="btn btn--ghost"
                style={{ width: '100%', marginTop: 'var(--space-3)' }}
                onClick={() => {
                  setShowShareTask(false);
                  setShowCreateTask(false);
                  setTaskForm({ title: '', description: '', hekaDate: '' });
                  setShareableTaskCode(null);
                }}
              >
                {t('taskShareModal.done')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// CIRCLE AI COACH BANNER
// ═══════════════════════════════════════════════════════════════════════════════

interface CircleAICoachBannerProps {
  friendsCount: number;
  pendingTasks: number;
  unreadMessages: number;
  activeTab: 'friends' | 'messages' | 'tasks' | 'invite' | 'requests';
  onInvite: () => void;
  onViewTasks: () => void;
}

function CircleAICoachBanner({
  friendsCount,
  pendingTasks,
  unreadMessages,
  activeTab,
  onInvite,
  onViewTasks,
}: CircleAICoachBannerProps) {
  const { t: tCircle } = useTranslation('circle');
  const message = useMemo(() => {
    const userContext = aiConfigService.getUserContext();

    // Update shared AI memory with current circle stats
    aiConfigService.setUserContext({
      friendCount: friendsCount,
      pendingCircleTasks: pendingTasks,
      unreadMessages,
    });

    // Cross-context merge: weave in recent journal themes when appropriate
    const journalBridge = userContext.lastJournalThemes.length
      ? tCircle('aiCoach.journalBridge', { themes: userContext.lastJournalThemes.join(', ') })
      : '';
    const moonBridge = userContext.lastCelebratedMoonPhase
      ? tCircle('aiCoach.moonBridge', { phase: userContext.lastCelebratedMoonPhase })
      : '';

    if (activeTab === 'tasks' && pendingTasks > 0) {
      return {
        text: tCircle(pendingTasks === 1 ? 'aiCoach.pendingTasks_one' : 'aiCoach.pendingTasks_other', { count: pendingTasks, moonBridge }),
        icon: '✨',
        action: { label: tCircle('aiCoach.viewTasks'), onClick: onViewTasks },
      };
    }
    if (activeTab === 'messages' && unreadMessages > 0) {
      return {
        text: tCircle(unreadMessages === 1 ? 'aiCoach.unreadMessages_one' : 'aiCoach.unreadMessages_other', { count: unreadMessages, journalBridge }),
        icon: '💬',
      };
    }
    if (friendsCount === 0) {
      return {
        text: tCircle('aiCoach.emptyCircle'),
        icon: '🌌',
        action: { label: tCircle('aiCoach.inviteFriend'), onClick: onInvite },
      };
    }
    if (friendsCount === 1) {
      return {
        text: tCircle('aiCoach.oneFriend', { journalBridge }),
        icon: '🔮',
        action: { label: tCircle('aiCoach.inviteAnother'), onClick: onInvite },
      };
    }
    if (activeTab === 'invite') {
      return {
        text: tCircle('aiCoach.inviteTab'),
        icon: '⚡',
      };
    }
    return {
      text: tCircle(friendsCount === 1 ? 'aiCoach.default_one' : 'aiCoach.default_other', { count: friendsCount, journalBridge }),
      icon: '✦',
    };
  }, [friendsCount, pendingTasks, unreadMessages, activeTab, onInvite, onViewTasks]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        margin: '0 16px 12px',
        background: 'linear-gradient(90deg, rgba(212,175,55,0.08), rgba(157,78,221,0.08))',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '10px',
        fontSize: '13px',
        color: '#e4e4e7',
      }}
    >
      <span style={{ fontSize: '16px' }}>{message.icon}</span>
      <p style={{ margin: 0, flex: 1, lineHeight: 1.5 }}>{message.text}</p>
      {message.action && (
        <button
          type="button"
          onClick={message.action.onClick}
          style={{
            padding: '10px 16px',
            background: 'rgba(212,175,55,0.15)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '8px',
            color: '#f8f7f5',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            minHeight: '40px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'rgba(212,175,55,0.2)',
          }}
        >
          {message.action.label}
        </button>
      )}
    </div>
  );
}

// Helper function to format last active time
function formatLastActive(timestamp: { toDate: () => Date } | Date): string {
  const date = 'toDate' in timestamp ? timestamp.toDate() : timestamp;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return i18n.t('timeAgo.justNow', { ns: 'circle' });
  if (minutes < 60) return i18n.t('timeAgo.minutesAgo', { ns: 'circle', minutes });
  if (hours < 24) return i18n.t('timeAgo.hoursAgo', { ns: 'circle', hours });
  if (days < 7) return i18n.t('timeAgo.daysAgo', { ns: 'circle', days });
  return date.toLocaleDateString();
}

export default FriendsModal;
