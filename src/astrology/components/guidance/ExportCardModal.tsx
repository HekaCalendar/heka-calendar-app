/**
 * Export Card Modal
 * Renders a beautiful shareable celestial guidance card
 * using html2canvas for image generation.
 */

import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { PersonalizedGuidanceReading, LifeArea } from '../../services/guidance/personalizedEngine';

interface ExportCardModalProps {
  guidance: PersonalizedGuidanceReading;
  selectedLifeArea: LifeArea | null;
  onClose: () => void;
}

export const ExportCardModal: React.FC<ExportCardModalProps> = ({
  guidance,
  selectedLifeArea,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const { t } = useTranslation('celestial');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  const reading = selectedLifeArea 
    ? guidance.lifeAreaReadings[selectedLifeArea]
    : guidance.overallReading;
  
  const areaLabel = selectedLifeArea 
    ? selectedLifeArea.replace(/([A-Z])/g, ' $1').trim()
    : t('export.overallGuidance');
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  const generateImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    setExportError(null);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) throw new Error('Failed to generate image');

      const fileName = `heka-guidance-${guidance.date.toISOString().split('T')[0]}.png`;

      // Native platform: save to filesystem and share
      if (Capacitor.isNativePlatform()) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Cache,
        });

        const uriResult = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Cache,
        });

        await Share.share({
          title: t('export.celestialGuidance'),
          text: reading.title,
          url: uriResult.uri,
          dialogTitle: t('export.saveImage'),
        });

        setIsGenerating(false);
        return;
      }

      // Web: try clipboard first
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setIsGenerating(false);
          return;
        } catch {
          // Fallback to download
        }
      }

      // Web download fallback
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Failed to export');
      setIsGenerating(false);
    }
  };
  
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        paddingTop: 'max(24px, calc(env(safe-area-inset-top) + 12px))',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'max(16px, env(safe-area-inset-top))',
          right: 20,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          borderRadius: 8,
          padding: '8px 14px',
          cursor: 'pointer',
          fontSize: 13,
          zIndex: 2001,
        }}
      >
        {t('export.close')}
      </button>
      
      {/* Card Preview */}
      <div onClick={(e) => e.stopPropagation()} style={{ overflow: 'auto', maxWidth: '100%', padding: 16 }}>
        <div
          ref={cardRef}
          style={{
            width: 360,
            minHeight: 480,
            maxWidth: '100%',
            background: 'linear-gradient(160deg, #1a103c 0%, #2d1b4e 40%, #0f172a 100%)',
            borderRadius: 20,
            padding: '32px 28px',
            color: '#fff',
            fontFamily: "'Inter', system-ui, sans-serif",
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative stars */}
          <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 20, opacity: 0.6 }}>✦</div>
          <div style={{ position: 'absolute', bottom: 60, left: 16, fontSize: 14, opacity: 0.4 }}>✦</div>
          <div style={{ position: 'absolute', top: 80, left: 24, fontSize: 10, opacity: 0.3 }}>✦</div>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#a78bfa', textTransform: 'uppercase', marginBottom: 4 }}>
              {t('export.celestialGuidance')}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
              {formatDate(guidance.date)}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              {areaLabel}
            </div>
          </div>
          
          {/* Title */}
          <h2 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#fbbf24',
            margin: '0 0 16px 0',
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            {reading.title}
          </h2>
          
          {/* Narrative */}
          <div style={{ margin: '0 0 20px 0' }}>
            {(reading.narrative.length > 350
              ? reading.narrative.slice(0, 350).trim() + '...'
              : reading.narrative
            )
              .split(/\n\n+/)
              .filter((p) => p.trim().length > 0)
              .map((paragraph, i, arr) => (
                <p
                  key={i}
                  style={{
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.9)',
                    margin: i === arr.length - 1 ? 0 : '0 0 0.75em 0',
                    textAlign: 'center',
                  }}
                >
                  {paragraph}
                </p>
              ))}
          </div>
          
          {/* Advice */}
          {reading.advice.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 10,
                letterSpacing: 1,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: 10,
              }}>
                {t('export.guidance')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reading.advice.slice(0, 2).map((advice, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {advice}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Affirmation */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.06))',
            borderRadius: 10,
            padding: '14px 16px',
            border: '1px solid rgba(251,191,36,0.15)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, color: 'rgba(251,191,36,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
              {t('export.affirmation')}
            </div>
            <p style={{ fontSize: 12, fontStyle: 'italic', color: '#fbbf24', margin: 0, lineHeight: 1.5 }}>
              &ldquo;{reading.affirmations?.[0] || reading.affirmation}&rdquo;
            </p>
          </div>
          
          {/* Footer */}
          <div style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 9,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: 0.5,
          }}>
            {t('export.generatedBy')}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <button
          onClick={generateImage}
          disabled={isGenerating}
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            cursor: isGenerating ? 'wait' : 'pointer',
            opacity: isGenerating ? 0.7 : 1,
            boxShadow: '0 8px 24px rgba(147,51,234,0.35)',
          }}
        >
          {isGenerating ? t('export.creating') : t('export.saveImage')}
        </button>
      </div>
      
      {exportError && (
        <div style={{ marginTop: 12, fontSize: 12, color: '#fca5a5' }}>
          {exportError || t('export.failed')}
        </div>
      )}
    </div>
  );
};

export default ExportCardModal;
