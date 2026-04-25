/**
 * Export Card Modal
 * Renders a beautiful shareable celestial guidance card
 * using html2canvas for image generation.
 */

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
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
  
  const reading = selectedLifeArea 
    ? guidance.lifeAreaReadings[selectedLifeArea]
    : guidance.overallReading;
  
  const areaLabel = selectedLifeArea 
    ? selectedLifeArea.replace(/([A-Z])/g, ' $1').trim()
    : 'Overall Guidance';
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
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
      
      // Try to copy to clipboard first
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
      
      // Download fallback
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `heka-guidance-${guidance.date.toISOString().split('T')[0]}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Failed to export');
      setIsGenerating(false);
    }
  };
  
  return (
    <div style={{
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
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          borderRadius: 8,
          padding: '8px 14px',
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        Close
      </button>
      
      {/* Card Preview */}
      <div style={{ overflow: 'auto', maxWidth: '100%', padding: 16 }}>
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
              Celestial Guidance
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
          <p style={{
            fontSize: 13,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 20px 0',
            textAlign: 'center',
          }}>
            {reading.narrative.length > 350 
              ? reading.narrative.slice(0, 350).trim() + '...'
              : reading.narrative}
          </p>
          
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
                Guidance
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
              Affirmation
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
            Generated by Heka Calendar ✦
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
          {isGenerating ? 'Creating...' : 'Save Image'}
        </button>
      </div>
      
      {exportError && (
        <div style={{ marginTop: 12, fontSize: 12, color: '#fca5a5' }}>
          {exportError}
        </div>
      )}
    </div>
  );
};

export default ExportCardModal;
