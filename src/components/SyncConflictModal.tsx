/**
 * Sync Conflict Resolution Modal
 *
 * Lets the user choose between their local change and the server change when
 * a conflict is detected during offline sync.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './ui/Modal';
import type { SyncConflict, ConflictResolution } from '../services/offlineSyncEngine';
import './SyncConflictModal.css';

interface SyncConflictModalProps<T = unknown> {
  conflict: SyncConflict<T> | null;
  onResolve: (resolution: ConflictResolution, merged?: T) => void;
  onClose: () => void;
  renderPreview?: (side: 'local' | 'server', data: T) => React.ReactNode;
}

export function SyncConflictModal<T = unknown>({
  conflict,
  onResolve,
  onClose,
  renderPreview,
}: SyncConflictModalProps<T>) {
  const { t } = useTranslation('common');
  const [choice, setChoice] = useState<ConflictResolution>('local');

  if (!conflict) return null;

  const handleResolve = () => {
    onResolve(choice);
  };

  return (
    <Modal isOpen={!!conflict} onClose={onClose}>
      <div className="sync-conflict-modal">
        <h2 className="sync-conflict-modal__title">{t('syncConflict.title')}</h2>
        <p className="sync-conflict-modal__subtitle">{t('syncConflict.subtitle')}</p>

        <div className="sync-conflict-modal__sides">
          <label className={`sync-conflict-modal__side ${choice === 'local' ? 'is-selected' : ''}`}>
            <input
              type="radio"
              name="conflict-choice"
              value="local"
              checked={choice === 'local'}
              onChange={() => setChoice('local')}
            />
            <span className="sync-conflict-modal__side-title">{t('syncConflict.local')}</span>
            <span className="sync-conflict-modal__side-hint">{t('syncConflict.localHint')}</span>
            <div className="sync-conflict-modal__preview">
              {renderPreview ? renderPreview('local', conflict.local) : <pre>{JSON.stringify(conflict.local, null, 2)}</pre>}
            </div>
          </label>

          <label className={`sync-conflict-modal__side ${choice === 'server' ? 'is-selected' : ''}`}>
            <input
              type="radio"
              name="conflict-choice"
              value="server"
              checked={choice === 'server'}
              onChange={() => setChoice('server')}
            />
            <span className="sync-conflict-modal__side-title">{t('syncConflict.server')}</span>
            <span className="sync-conflict-modal__side-hint">{t('syncConflict.serverHint')}</span>
            <div className="sync-conflict-modal__preview">
              {renderPreview ? renderPreview('server', conflict.server) : <pre>{JSON.stringify(conflict.server, null, 2)}</pre>}
            </div>
          </label>
        </div>

        <div className="sync-conflict-modal__actions">
          <button className="sync-conflict-modal__btn sync-conflict-modal__btn--secondary" onClick={onClose}>
            {t('cancel')}
          </button>
          <button className="sync-conflict-modal__btn sync-conflict-modal__btn--primary" onClick={handleResolve}>
            {t('syncConflict.resolve')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
