/**
 * Data Export Panel - GDPR Compliance Feature
 * Allows users to export or delete their data
 */

import React, { useState, useEffect } from 'react';
import {
  downloadUserDataExport,
  downloadHumanReadableExport,
  clearAllUserData,
  getDataSizeEstimate,
} from '../services/dataExportService';

export const DataExportPanel: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dataSize, setDataSize] = useState<string>('Calculating...');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    getDataSizeEstimate().then(setDataSize);
  }, []);

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      await downloadUserDataExport();
      showMessage('Data exported successfully! Check your downloads folder.', 'success');
    } catch (error) {
      showMessage('Failed to export data. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportText = async () => {
    setIsExporting(true);
    try {
      await downloadHumanReadableExport();
      showMessage('Data exported successfully! Check your downloads folder.', 'success');
    } catch (error) {
      showMessage('Failed to export data. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      await clearAllUserData();
      showMessage('All local data cleared. The app will reload.', 'success');
      // Reload after 2 seconds to reflect cleared state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      showMessage('Failed to clear data. Please try again.', 'error');
      setIsClearing(false);
    }
  };

  return (
    <div className="data-export-panel">
      <div className="data-export-panel__header">
        <h3>Your Data</h3>
        <p className="data-size">Estimated size: {dataSize}</p>
      </div>

      {message && (
        <div className={`data-export-message data-export-message--${messageType}`}>
          {message}
        </div>
      )}

      <div className="data-export-section">
        <h4>Export Your Data</h4>
        <p>
          Download a copy of all your data. You own your data and can take it with you at any time.
        </p>
        
        <div className="data-export-buttons">
          <button
            className="btn btn--primary"
            onClick={handleExportJSON}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : '📥 Export as JSON'}
          </button>
          
          <button
            className="btn"
            onClick={handleExportText}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : '📝 Export as Text'}
          </button>
        </div>
        
        <div className="data-export-info">
          <p><strong>JSON format:</strong> Machine-readable, good for backup or transferring to another app</p>
          <p><strong>Text format:</strong> Human-readable, easy to review your data</p>
        </div>
      </div>

      <div className="data-export-section data-export-section--danger">
        <h4>Delete Your Data</h4>
        <p>
          Permanently delete all your local data. This action cannot be undone.
          Your cloud data (if any) will remain until you delete your account.
        </p>
        
        {!showClearConfirm ? (
          <button
            className="btn btn--danger"
            onClick={() => setShowClearConfirm(true)}
          >
            🗑️ Clear All Local Data
          </button>
        ) : (
          <div className="data-export-confirm">
            <p className="data-export-warning">
              ⚠️ Are you sure? This will permanently delete all your notes, charts, and settings.
            </p>
            <div className="data-export-confirm-buttons">
              <button
                className="btn btn--danger"
                onClick={handleClearData}
                disabled={isClearing}
              >
                {isClearing ? 'Clearing...' : 'Yes, Delete Everything'}
              </button>
              <button
                className="btn"
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="data-export-footer">
        <h4>Your Privacy Rights</h4>
        <ul>
          <li>✅ <strong>Right to Access:</strong> Export your data anytime</li>
          <li>✅ <strong>Right to Deletion:</strong> Clear your local data</li>
          <li>✅ <strong>Right to Portability:</strong> Take your data with you</li>
          <li>✅ <strong>Right to Control:</strong> Cloud sync is optional</li>
        </ul>
        <p className="data-export-contact">
          Questions? Contact us at <a href="mailto:hekacalendar@gmail.com">hekacalendar@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default DataExportPanel;
