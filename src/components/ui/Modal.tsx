/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHARED MODAL PRIMITIVE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Enterprise-grade modal shell used across HEKA. Provides:
 * - Focus trap + focus restoration
 * - Body scroll lock
 * - Escape-to-close
 * - Backdrop click-to-close
 * - aria-modal / role="dialog"
 * - Reduced-motion awareness
 * - Consistent HEKA styling
 */

import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../setup/useFocusTrap';
import { useScrollLock } from '../setup/useScrollLock';
import './Modal.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  /** Show the close button in the top-right corner. Default: true */
  showCloseButton?: boolean;
  /** Close when clicking the backdrop. Default: true */
  closeOnBackdrop?: boolean;
  /** Close when pressing Escape. Default: true */
  closeOnEscape?: boolean;
  /** Extra className applied to the modal panel */
  className?: string;
  /** Accessible label when title is not a string */
  ariaLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  ariaLabel,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useFocusTrap(isOpen, panelRef);
  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
    }
    return () => {
      if (!isOpen) {
        previouslyFocusedRef.current?.focus?.();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const titleId = 'heka-modal-title';
  const descId = 'heka-modal-desc';

  return createPortal(
    <div
      className="heka-modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        className={`heka-modal-panel heka-modal-panel--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        aria-label={!title && ariaLabel ? ariaLabel : undefined}
      >
        {(title || showCloseButton) && (
          <header className="heka-modal-header">
            {title && (
              <div className="heka-modal-header__text">
                <h2 id={titleId} className="heka-modal-title">
                  {title}
                </h2>
                {description && (
                  <p id={descId} className="heka-modal-description">
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="heka-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </header>
        )}

        <div className="heka-modal-body">{children}</div>

        {footer && <footer className="heka-modal-footer">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
