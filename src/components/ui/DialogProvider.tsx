/**
 * Global Dialog Provider
 *
 * Replaces native alert/confirm with on-brand, accessible dialogs.
 * Components can call showAlert/showConfirm imperatively without
 * managing their own dialog state.
 */

import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { AlertDialog } from './AlertDialog';
import { ConfirmDialog } from './ConfirmDialog';

interface AlertOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  variant?: 'primary' | 'danger';
}

interface ConfirmOptions extends AlertOptions {
  cancelText?: string;
}

interface DialogContextValue {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialogs = (): DialogContextValue => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('useDialogs must be used within a DialogProvider');
  }
  return ctx;
};

/**
 * Imperative dialog API. Safe to call from callbacks and non-React code.
 * Falls back to native alert/confirm if the provider is not mounted.
 */
export const dialogService: DialogContextValue = {
  showAlert: (options) => {
    if (typeof window !== 'undefined') {
      window.alert(options.description?.toString() || options.title?.toString() || '');
    }
  },
  showConfirm: async (options) => {
    if (typeof window !== 'undefined') {
      return window.confirm(options.description?.toString() || options.title?.toString() || '');
    }
    return false;
  },
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertOptions | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState(options);
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setConfirmState(options);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  // Override the imperative service so non-React callers use the real UI.
  dialogService.showAlert = showAlert;
  dialogService.showConfirm = showConfirm;

  const handleAlertClose = useCallback(() => {
    setAlertState(null);
  }, []);

  const handleConfirmClose = useCallback(() => {
    setConfirmState(null);
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  const handleConfirm = useCallback(() => {
    setConfirmState(null);
    resolveRef.current?.(true);
    resolveRef.current = null;
  }, []);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AlertDialog
        isOpen={!!alertState}
        onClose={handleAlertClose}
        title={alertState?.title}
        description={alertState?.description}
        confirmText={alertState?.confirmText}
        variant={alertState?.variant}
      />
      <ConfirmDialog
        isOpen={!!confirmState}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        title={confirmState?.title}
        description={confirmState?.description}
        confirmText={confirmState?.confirmText}
        cancelText={confirmState?.cancelText}
        variant={confirmState?.variant}
      />
    </DialogContext.Provider>
  );
};
