/**
 * Alert Dialog — Replaces native window.alert with an accessible,
 * on-brand alert sheet.
 */

import React from 'react';
import { Modal } from './Modal';
import './ConfirmDialog.css';

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  variant?: 'primary' | 'danger';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title = 'Notice',
  description = '',
  confirmText = 'OK',
  variant = 'primary',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <button
          type="button"
          className={`heka-btn heka-btn--${variant}`}
          onClick={onClose}
          autoFocus
        >
          {confirmText}
        </button>
      }
    >
      <div className="heka-confirm-body" />
    </Modal>
  );
};

export default AlertDialog;
