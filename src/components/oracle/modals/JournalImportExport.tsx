/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║              JOURNAL IMPORT / EXPORT MODAL                                ║
 * ║                                                                           ║
 * ║  Export to PDF/JSON, Import from JSON (with merge/replace options)        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { selectAllEntries } from '../../../store/diarySlice';
import { exportToPDFWindow } from '../../../services/pdfExport';
import { db, dbCreateEntry, type JournalEntry } from '../../../services/journalDatabase';

interface JournalImportExportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JournalImportExport: React.FC<JournalImportExportProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('journal');
  const entries = useSelector((state: RootState) => selectAllEntries(state));
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importResult, setImportResult] = useState<{ success: number; errors: number; message: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportPDF = useCallback(() => {
    exportToPDFWindow(entries, { title: 'HEKA Journal Export' });
  }, [entries]);

  const handleExportJSON = useCallback(() => {
    const data = {
      version: '2.2.1',
      exportedAt: new Date().toISOString(),
      entries: entries.map(e => ({
        ...e,
        // Strip internal DB fields
        revisionCount: undefined,
        syncStatus: undefined,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heka-journal-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  const handleImport = useCallback(async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    setImportResult(null);

    let success = 0;
    let errors = 0;

    try {
      const parsed = JSON.parse(importText);
      const importedEntries: JournalEntry[] = Array.isArray(parsed)
        ? parsed
        : parsed.entries || [];

      if (!Array.isArray(importedEntries)) {
        setImportResult({ success: 0, errors: 1, message: 'Invalid format: expected array of entries' });
        setIsImporting(false);
        return;
      }

      if (importMode === 'replace') {
        await db.entries.clear();
        await db.revisions.clear();
        await db.searchIndex.clear();
      }

      for (const raw of importedEntries) {
        try {
          const entry: JournalEntry = {
            id: raw.id || crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            date: raw.date || new Date().toISOString().split('T')[0],
            timestamp: raw.timestamp || new Date().toISOString(),
            content: raw.content || '',
            theme: raw.theme,
            font: raw.font,
            detectedThemes: raw.detectedThemes || [],
            insight: raw.insight,
            celestialContext: raw.celestialContext,
            tags: raw.tags || [],
            isMarkdown: raw.isMarkdown,
            revisionCount: 0,
            syncStatus: 'pending',
            createdAt: raw.createdAt || new Date().toISOString(),
            updatedAt: raw.updatedAt || new Date().toISOString(),
          };
          await dbCreateEntry(entry);
          success++;
        } catch (e) {
          errors++;
          console.error('[Import] Failed to import entry:', e);
        }
      }

      setImportResult({
        success,
        errors,
        message: errors === 0
          ? `Imported ${success} entries successfully`
          : `Imported ${success} entries, ${errors} failed`,
      });
      setImportText('');
    } catch (e) {
      setImportResult({ success: 0, errors: 1, message: 'Invalid JSON: ' + (e instanceof Error ? e.message : String(e)) });
    } finally {
      setIsImporting(false);
    }
  }, [importText, importMode]);

  if (!isOpen) return null;

  return (
    <div className="journal-import-export-overlay" onClick={onClose}>
      <div className="journal-import-export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jie-header">
          <h2>{t('importExport.title')}</h2>
          <button className="jie-close" onClick={onClose}>×</button>
        </div>

        <div className="jie-tabs">
          <button
            className={activeTab === 'export' ? 'active' : ''}
            onClick={() => setActiveTab('export')}
          >
            {t('importExport.exportTab')}
          </button>
          <button
            className={activeTab === 'import' ? 'active' : ''}
            onClick={() => setActiveTab('import')}
          >
            {t('importExport.importTab')}
          </button>
        </div>

        {activeTab === 'export' && (
          <div className="jie-panel">
            <p className="jie-desc">{t('importExport.exportDesc', { count: entries.length })}</p>
            <div className="jie-actions">
              <button className="jie-btn-primary" onClick={handleExportPDF}>
                📄 {t('importExport.exportPDF')}
              </button>
              <button className="jie-btn-secondary" onClick={handleExportJSON}>
                💾 {t('importExport.exportJSON')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="jie-panel">
            <p className="jie-desc">{t('importExport.importDesc')}</p>
            <div className="jie-import-mode">
              <label>
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                />
                {t('importExport.mergeMode')}
              </label>
              <label>
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                />
                {t('importExport.replaceMode')}
              </label>
            </div>
            <textarea
              className="jie-import-textarea"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={t('importExport.pasteJSON')}
              rows={10}
            />
            <button
              className="jie-btn-primary"
              onClick={handleImport}
              disabled={!importText.trim() || isImporting}
            >
              {isImporting ? t('importExport.importing') : t('importExport.importBtn')}
            </button>
            {importResult && (
              <div className={`jie-result ${importResult.errors > 0 ? 'jie-result-error' : 'jie-result-success'}`}>
                {importResult.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
