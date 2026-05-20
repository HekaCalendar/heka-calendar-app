/**
 * Enterprise-Grade Authentication Service
 * Production-ready auth with security, audit trails, and advanced features
 */

import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  type User,
  type UserCredential
} from 'firebase/auth';
import { getErrorMessage, getErrorCode } from '../utils/errorUtils';
import { getApp } from 'firebase/app';

// Security configuration
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  MIN_PASSWORD_LENGTH: 8,
  SESSION_TIMEOUT_MINUTES: 60,
};

// Audit log entry
interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId?: string;
  email?: string;
  success: boolean;
  details?: string;
  ip?: string;
  userAgent?: string;
}

// Session management
interface SessionInfo {
  startedAt: string;
  lastActivity: string;
  deviceInfo: string;
}

class EnterpriseAuthService {
  private auditLog: AuditLogEntry[] = [];
  private loginAttempts: Map<string, { count: number; lockedUntil?: number }> = new Map();
  private session: SessionInfo | null = null;
  private sessionTimeoutId: NodeJS.Timeout | null = null;
  
  // Lazy getter for auth - only access Firebase after it's initialized
  private get auth() {
    try {
      return getAuth(getApp());
    } catch {
      throw new Error('Firebase not initialized');
    }
  }
  
  // Check if Firebase is ready
  private isFirebaseReady(): boolean {
    try {
      getApp();
      return true;
    } catch {
      return false;
    }
  }

  // Password strength validation
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= SECURITY_CONFIG.MIN_PASSWORD_LENGTH) {
      score += 1;
    } else {
      feedback.push(`At least ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} characters`);
    }

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letter');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Include number');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Include special character');

    return {
      isValid: score >= 4,
      score,
      feedback: score === 5 ? ['Strong password'] : feedback
    };
  }

  // Rate limiting check
  private checkRateLimit(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return true;

    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      const remaining = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      throw new Error(`Account locked. Try again in ${remaining} minutes.`);
    }

    if (attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      const lockoutUntil = Date.now() + (SECURITY_CONFIG.LOCKOUT_DURATION_MINUTES * 60000);
      this.loginAttempts.set(email, { count: attempts.count, lockedUntil: lockoutUntil });
      throw new Error(`Too many attempts. Account locked for ${SECURITY_CONFIG.LOCKOUT_DURATION_MINUTES} minutes.`);
    }

    return true;
  }

  private recordFailedAttempt(email: string) {
    const attempts = this.loginAttempts.get(email) || { count: 0 };
    attempts.count += 1;
    this.loginAttempts.set(email, attempts);
  }

  private clearLoginAttempts(email: string) {
    this.loginAttempts.delete(email);
  }

  // Audit logging
  private logAudit(entry: Omit<AuditLogEntry, 'timestamp'>) {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    this.auditLog.push(logEntry);
    
    // Keep only last 100 entries
    if (this.auditLog.length > 100) {
      this.auditLog = this.auditLog.slice(-100);
    }

    // In production, send to server
    // Audit logging: details redacted in production
  }

  getAuditLog(): AuditLogEntry[] {
    return [...this.auditLog];
  }

  // Session management
  private startSession() {
    this.session = {
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      deviceInfo: `${navigator.platform} - ${navigator.userAgent.slice(0, 50)}`
    };

    // Set session timeout
    this.resetSessionTimeout();
  }

  private resetSessionTimeout() {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
    }

    this.sessionTimeoutId = setTimeout(() => {
      this.logAudit({
        action: 'SESSION_TIMEOUT',
        success: false,
        details: 'Session expired due to inactivity'
      });
      this.signOut();
    }, SECURITY_CONFIG.SESSION_TIMEOUT_MINUTES * 60000);
  }

  recordActivity() {
    if (this.session) {
      this.session.lastActivity = new Date().toISOString();
      this.resetSessionTimeout();
    }
  }

  getSessionInfo(): SessionInfo | null {
    return this.session;
  }

  // Enhanced sign up with validation
  async signUp(email: string, password: string, displayName: string): Promise<UserCredential> {
    // Check Firebase is initialized
    if (!this.isFirebaseReady()) {
      throw new Error('Firebase not configured. Please check your setup.');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate password strength
    const passwordCheck = this.validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      throw new Error(`Password too weak: ${passwordCheck.feedback.join(', ')}`);
    }

    // Validate display name
    if (!displayName.trim() || displayName.length < 2) {
      throw new Error('Display name must be at least 2 characters');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      await updateProfile(userCredential.user, { displayName: displayName.trim() });

      this.logAudit({
        action: 'SIGNUP',
        userId: userCredential.user.uid,
        email,
        success: true,
        details: `Account created for ${displayName}`
      });

      this.startSession();
      return userCredential;
    } catch (error) {
      this.logAudit({
        action: 'SIGNUP',
        email,
        success: false,
        details: getErrorMessage(error)
      });
      throw this.formatError(error);
    }
  }

  // Enhanced login with rate limiting
  async logIn(email: string, password: string): Promise<UserCredential> {
    if (!this.isFirebaseReady()) {
      throw new Error('Firebase not configured. Please check your setup.');
    }
    this.checkRateLimit(email);

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      this.clearLoginAttempts(email);
      
      this.logAudit({
        action: 'LOGIN',
        userId: userCredential.user.uid,
        email,
        success: true
      });

      this.startSession();
      return userCredential;
    } catch (error) {
      this.recordFailedAttempt(email);

      this.logAudit({
        action: 'LOGIN',
        email,
        success: false,
        details: getErrorMessage(error)
      });

      throw this.formatError(error);
    }
  }

  // Re-authenticate (for sensitive operations)
  async reAuthenticate(password: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      throw new Error('Not authenticated');
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      this.logAudit({
        action: 'REAUTHENTICATE',
        userId: user.uid,
        success: true
      });
      
      return true;
    } catch (error) {
      this.logAudit({
        action: 'REAUTHENTICATE',
        userId: user.uid,
        success: false,
        details: getErrorMessage(error)
      });
      throw new Error('Incorrect password');
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.isFirebaseReady()) {
      throw new Error('Firebase not configured. Please check your setup.');
    }
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Validate new password
    const passwordCheck = this.validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
      throw new Error(`New password too weak: ${passwordCheck.feedback.join(', ')}`);
    }

    // Re-authenticate first
    await this.reAuthenticate(currentPassword);

    try {
      await updatePassword(user, newPassword);
      
      this.logAudit({
        action: 'PASSWORD_CHANGE',
        userId: user.uid,
        success: true
      });
    } catch (error) {
      this.logAudit({
        action: 'PASSWORD_CHANGE',
        userId: user.uid,
        success: false,
        details: getErrorMessage(error)
      });
      throw this.formatError(error);
    }
  }

  // Delete account
  async deleteAccount(password: string): Promise<void> {
    if (!this.isFirebaseReady()) {
      throw new Error('Firebase not configured. Please check your setup.');
    }
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Re-authenticate first
    await this.reAuthenticate(password);

    try {
      await deleteUser(user);
      
      this.logAudit({
        action: 'ACCOUNT_DELETE',
        userId: user.uid,
        success: true
      });
      
      this.session = null;
      if (this.sessionTimeoutId) {
        clearTimeout(this.sessionTimeoutId);
      }
    } catch (error) {
      this.logAudit({
        action: 'ACCOUNT_DELETE',
        userId: user.uid,
        success: false,
        details: getErrorMessage(error)
      });
      throw this.formatError(error);
    }
  }

  // Enhanced sign out
  async signOut(): Promise<void> {
    if (!this.isFirebaseReady()) {
      throw new Error('Firebase not configured. Please check your setup.');
    }
    const user = this.auth.currentUser;
    
    try {
      await signOut(this.auth);
      
      this.logAudit({
        action: 'LOGOUT',
        userId: user?.uid,
        success: true
      });
      
      this.session = null;
      if (this.sessionTimeoutId) {
        clearTimeout(this.sessionTimeoutId);
      }
    } catch (error) {
      this.logAudit({
        action: 'LOGOUT',
        userId: user?.uid,
        success: false,
        details: getErrorMessage(error)
      });
      throw this.formatError(error);
    }
  }

  // Password reset
  async resetPassword(email: string): Promise<void> {
    if (!this.isFirebaseReady()) {
      throw new Error('Firebase not configured. Please check your setup.');
    }
    try {
      await sendPasswordResetEmail(this.auth, email);
      
      this.logAudit({
        action: 'PASSWORD_RESET_REQUEST',
        email,
        success: true
      });
    } catch (error) {
      this.logAudit({
        action: 'PASSWORD_RESET_REQUEST',
        email,
        success: false,
        details: getErrorMessage(error)
      });
      throw this.formatError(error);
    }
  }

  // Auth state listener
  onAuthChange(callback: (user: User | null) => void): () => void {
    if (!this.isFirebaseReady()) {
      // Return no-op unsubscribe if Firebase not ready
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.resetSessionTimeout();
      }
      callback(user);
    });
  }

  // Get current user
  getCurrentUser(): User | null {
    if (!this.isFirebaseReady()) return null;
    return this.auth.currentUser;
  }

  // Get auth token
  async getIdToken(): Promise<string | null> {
    if (!this.isFirebaseReady()) return null;
    const user = this.auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }

  // Error formatting
  private formatError(error: unknown): Error {
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Invalid email address format',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account already exists with this email',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/requires-recent-login': 'Please sign in again to continue',
    };

    const code = getErrorCode(error);
    const message = (code && errorMessages[code]) || getErrorMessage(error) || 'An unexpected error occurred';
    return new Error(message);
  }
}

// Export singleton instance
export const enterpriseAuth = new EnterpriseAuthService();
export default enterpriseAuth;
