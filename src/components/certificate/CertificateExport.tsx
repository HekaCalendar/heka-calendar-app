/**
 * Certificate Export
 * PNG, PDF download and clipboard copy with progress
 */

import React, { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { CertificateData, CertificateOptions, TemplateId } from './certificateData';
import { getEffectiveOptions } from './certificateData';
import { CelestialGoldTemplate } from './templates/CelestialGoldTemplate';
import { SacredGeometryTemplate } from './templates/SacredGeometryTemplate';
import { MinimalModernTemplate } from './templates/MinimalModernTemplate';
import { AncientParchmentTemplate } from './templates/AncientParchmentTemplate';
import { CosmicNebulaTemplate } from './templates/CosmicNebulaTemplate';
import { ArtDecoTemplate } from './templates/ArtDecoTemplate';
import { NakshatraVedicTemplate } from './templates/NakshatraVedicTemplate';
import { ChineseZodiacTemplate } from './templates/ChineseZodiacTemplate';
import { MoonPhaseTemplate } from './templates/MoonPhaseTemplate';

interface Props {
  data: CertificateData;
  templateId: TemplateId;
  options: CertificateOptions;
}

const TEMPLATE_MAP: Record<TemplateId, React.FC<{ data: CertificateData; options: CertificateOptions }>> = {
  'celestial-gold': CelestialGoldTemplate,
  'sacred-geometry': SacredGeometryTemplate,
  'minimal-modern': MinimalModernTemplate,
  'ancient-parchment': AncientParchmentTemplate,
  'cosmic-nebula': CosmicNebulaTemplate,
  'art-deco': ArtDecoTemplate,
  'nakshatra-vedic': NakshatraVedicTemplate,
  'chinese-zodiac': ChineseZodiacTemplate,
  'moon-phase': MoonPhaseTemplate,
};

export const CertificateExport: React.FC<Props> = ({ data, templateId, options }) => {
  const captureRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'png' | 'pdf' | 'clipboard' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const effectiveOptions = getEffectiveOptions(templateId, options);
  const TemplateComponent = TEMPLATE_MAP[templateId] || CelestialGoldTemplate;

  const downloadPNG = useCallback(async () => {
    if (!captureRef.current) return;
    setStatus('png');
    setError(null);

    try {
      await document.fonts.ready;
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to generate image');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `heka-certificate-${data.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
      setStatus('idle');
    }
  }, [data.name]);

  const downloadPDF = useCallback(async () => {
    if (!captureRef.current) return;
    setStatus('pdf');
    setError(null);

    try {
      await document.fonts.ready;
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `heka-certificate-${data.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
      setStatus('idle');
    }
  }, [data.name]);

  const copyToClipboard = useCallback(async () => {
    if (!captureRef.current) return;
    setStatus('clipboard');
    setError(null);

    try {
      await document.fonts.ready;
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to generate image');

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setStatus('success');
        return;
      }

      // Fallback to download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `heka-certificate-${data.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Copy failed');
      setStatus('idle');
    }
  }, [data.name]);

  if (status === 'success') {
    return (
      <div className="cert-export-success cert-fade-in">
        <div className="cert-export-success-icon">✨</div>
        <div className="cert-export-success-title">Certificate Created!</div>
        <div className="cert-export-success-text">Your birth certificate has been generated successfully.</div>
        <button
          className="cert-nav-btn cert-nav-btn--next"
          onClick={() => setStatus('idle')}
        >
          Create Another
        </button>
      </div>
    );
  }

  return (
    <div className="cert-export cert-fade-in">
      {/* Hidden capture container at full resolution */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
        <div ref={captureRef}>
          <TemplateComponent data={data} options={effectiveOptions} />
        </div>
      </div>

      {/* Preview */}
      <div className="cert-export-preview">
        <TemplateComponent data={data} options={effectiveOptions} />
      </div>

      {/* Actions */}
      <div className="cert-export-actions">
        <button
          className="cert-export-btn cert-export-btn--png"
          onClick={downloadPNG}
          disabled={status !== 'idle'}
        >
          {status === 'png' ? 'Creating PNG...' : '📷 Download PNG'}
        </button>
        <button
          className="cert-export-btn cert-export-btn--pdf"
          onClick={downloadPDF}
          disabled={status !== 'idle'}
        >
          {status === 'pdf' ? 'Creating PDF...' : '📄 Download PDF'}
        </button>
        <button
          className="cert-export-btn cert-export-btn--clipboard"
          onClick={copyToClipboard}
          disabled={status !== 'idle'}
        >
          {status === 'clipboard' ? 'Copying...' : '📋 Copy Image'}
        </button>
      </div>

      {error && (
        <div className="cert-error">
          <div className="cert-error-icon">⚠️</div>
          <div className="cert-error-text">{error}</div>
        </div>
      )}
    </div>
  );
};

export default CertificateExport;
