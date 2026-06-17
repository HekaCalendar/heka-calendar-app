/**
 * Production PDF Preview Component
 * Uses PDF.js to render actual PDF preview with navigation controls
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as pdfjs from 'pdfjs-dist';
import type { PrintJob } from './types';

// PDF.js worker - local file for offline/capacitor support
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFPreviewProps {
  printJob: PrintJob;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  printJob,
  onClose,
  onPrint,
  onDownload
}) => {
  const { t } = useTranslation('print');
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);
  
  // Load PDF from blob
  useEffect(() => {
    if (!printJob.blob) return;
    
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const arrayBuffer = await printJob.blob!.arrayBuffer();
        const loadedPdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
        setIsLoading(false);
      } catch {
        setError(t('failedToLoadPDF'));
        setIsLoading(false);
      }
    };
    
    loadPdf();
    
    return () => {
      pdf?.destroy();
    };
  }, [printJob.blob]);
  
  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    
    const renderPage = async () => {
      try {
        // Cancel any ongoing render
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }
        
        const page = await pdf.getPage(currentPage);
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        
        // Calculate scale to fit width
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
          canvasContext: context,
          viewport,
          canvas: canvas
        };
        
        renderTaskRef.current = page.render(renderContext as any);
        await renderTaskRef.current.promise;
        renderTaskRef.current = null;
      } catch (err) {
        if ((err as Error).message !== 'Rendering cancelled') {
          setError(t('failedToRenderPage'));
        }
      }
    };
    
    renderPage();
  }, [pdf, currentPage, scale]);
  
  // Navigation handlers
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  }, [numPages]);
  
  const zoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft') {
        goToPage(currentPage - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, goToPage, onClose]);
  
  if (error) {
    return (
      <div className="pdf-preview-error">
        <div className="error-content">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pdf-preview-overlay">
      {/* Header */}
      <div className="pdf-preview-header">
        <div className="header-left">
          <button className="header-btn" onClick={onClose}>
            ✕ {t('close')}
          </button>
          <span className="document-title">{printJob.filename}</span>
        </div>
        
        <div className="header-center">
          <button
            className="nav-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label={t('previous')}
          >
            ‹
          </button>
          <span className="page-indicator">
            {t('pageOf', { current: currentPage, total: numPages })}
          </span>
          <button
            className="nav-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= numPages}
            aria-label={t('nextItem')}
          >
            ›
          </button>
        </div>
        
        <div className="header-right">
          <div className="zoom-controls">
            <button className="header-btn" onClick={zoomOut} aria-label={t('zoomOut')}>−</button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button className="header-btn" onClick={zoomIn} aria-label={t('zoomIn')}>+</button>
          </div>
          <button className="header-btn secondary" onClick={onDownload}>
            💾 {t('save')}
          </button>
          <button className="header-btn primary" onClick={onPrint}>
            🖨️ {t('print')}
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="pdf-preview-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>{t('loadingPDF')}</p>
          </div>
        ) : (
          <div className="canvas-container">
            <canvas ref={canvasRef} />
          </div>
        )}
      </div>
      
      {/* Page thumbnails sidebar */}
      {numPages > 1 && (
        <div className="pdf-preview-thumbnails">
          {Array.from({ length: numPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`thumbnail ${page === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(page)}
            >
              <Thumbnail pdf={pdf!} pageNumber={page} />
              <span className="thumbnail-label">{page}</span>
            </button>
          ))}
        </div>
      )}
      
      <style>{`
        .pdf-preview-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #1a1a2e;
          display: flex;
          flex-direction: column;
          z-index: 10000;
        }
        
        .pdf-preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: #16162a;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          gap: 20px;
        }
        
        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }
        
        .header-right {
          justify-content: flex-end;
        }
        
        .header-center {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .header-btn {
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .header-btn:hover {
          background: rgba(255,255,255,0.15);
        }
        
        .header-btn.primary {
          background: #c9a227;
          border-color: #c9a227;
          color: #000;
        }
        
        .header-btn.primary:hover {
          background: #d4af37;
        }
        
        .document-title {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .nav-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 6px;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .nav-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.2);
        }
        
        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .page-indicator {
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          min-width: 100px;
          text-align: center;
        }
        
        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .zoom-level {
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          min-width: 50px;
          text-align: center;
        }
        
        .pdf-preview-content {
          flex: 1;
          overflow: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px;
          background: #0f0f1a;
        }
        
        .canvas-container {
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        
        canvas {
          display: block;
          background: white;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: rgba(255,255,255,0.7);
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #c9a227;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .pdf-preview-thumbnails {
          position: absolute;
          left: 0;
          top: 60px;
          bottom: 0;
          width: 120px;
          background: #16162a;
          border-right: 1px solid rgba(255,255,255,0.1);
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .thumbnail {
          width: 100%;
          aspect-ratio: 0.7;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 4px;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
        }
        
        .thumbnail:hover {
          border-color: rgba(255,255,255,0.2);
        }
        
        .thumbnail.active {
          border-color: #c9a227;
        }
        
        .thumbnail-label {
          display: block;
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 11px;
          margin-top: 4px;
        }
        
        .thumbnail.active .thumbnail-label {
          color: #c9a227;
        }
        
        .pdf-preview-error {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        
        .error-content {
          text-align: center;
          color: #fff;
        }
        
        .error-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

// Thumbnail component for sidebar
const Thumbnail: React.FC<{ pdf: pdfjs.PDFDocumentProxy; pageNumber: number }> = ({ 
  pdf, 
  pageNumber 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const renderThumbnail = async () => {
      if (!canvasRef.current) return;
      
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 0.15 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport,
        canvas: canvas
      } as any).promise;
    };
    
    renderThumbnail();
  }, [pdf, pageNumber]);
  
  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />;
};

export default PDFPreview;
