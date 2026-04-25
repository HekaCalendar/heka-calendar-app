/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CERTIFICATE BUILDER — Main Wizard Component
 * 4-step flow: Birth Data → Template Select → Preview → Export
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createEmptyCertificateData,
  enrichCertificateData,
  type CertificateData,
  type CertificateOptions,
  type TemplateId,
  getTemplateMeta,
} from './certificateData';
import { CERTIFICATE_CSS } from './certificateCss';
import { BirthDataForm } from './BirthDataForm';
import { TemplateGallery } from './TemplateGallery';
import { CertificatePreview } from './CertificatePreview';
import { CertificateExport } from './CertificateExport';

type BuilderStep = 'birth-data' | 'template-select' | 'preview' | 'export';

const STEPS: { id: BuilderStep; label: string }[] = [
  { id: 'birth-data', label: 'Details' },
  { id: 'template-select', label: 'Template' },
  { id: 'preview', label: 'Preview' },
  { id: 'export', label: 'Export' },
];

export const CertificateBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<BuilderStep>('birth-data');
  const [data, setData] = useState<CertificateData>(createEmptyCertificateData());
  const [enrichedData, setEnrichedData] = useState<CertificateData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('celestial-gold');
  const [options, setOptions] = useState<CertificateOptions>(getTemplateMeta('celestial-gold').defaultOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Inject CSS
  useEffect(() => {
    const styleId = 'heka-cert-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = CERTIFICATE_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  // Reset options when template changes
  useEffect(() => {
    setOptions(getTemplateMeta(selectedTemplate).defaultOptions);
  }, [selectedTemplate]);

  // Scroll to top on step change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Enrich data when proceeding to preview
  const handleEnrich = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const enriched = await enrichCertificateData(data);
      setEnrichedData(enriched);
      setStep('preview');
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to compute celestial data');
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const goBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const stepIndex = STEPS.findIndex(s => s.id === step);

  const canProceed = () => {
    switch (step) {
      case 'birth-data':
        return data.name.trim().length > 0 && data.birthDate.length > 0 && data.birthTime.length > 0;
      case 'template-select':
        return true;
      case 'preview':
        return enrichedData !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 'birth-data') {
      setStep('template-select');
    } else if (step === 'template-select') {
      handleEnrich();
    } else if (step === 'preview') {
      setStep('export');
    }
  };

  const handleBack = () => {
    if (step === 'birth-data') {
      goBack();
    } else if (step === 'template-select') {
      setStep('birth-data');
    } else if (step === 'preview') {
      setStep('template-select');
    } else if (step === 'export') {
      setStep('preview');
    }
  };

  return (
    <div className="cert-builder">
      {/* Header */}
      <header className="cert-builder-header">
        <button className="cert-builder-back" onClick={handleBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {step === 'birth-data' ? 'Store' : 'Back'}
        </button>
        <div className="cert-builder-title">Birth Certificate</div>
        <div className="cert-builder-step-label">{STEPS[stepIndex].label}</div>
      </header>

      {/* Step indicator */}
      <div className="cert-steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="cert-step" title={s.label}>
              <div className={`cert-step-dot ${i === stepIndex ? 'is-active' : i < stepIndex ? 'is-complete' : ''}`} />
              <div className={`cert-step-label-text ${i === stepIndex ? 'is-active' : ''}`}>{s.label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`cert-step-line ${i < stepIndex ? 'is-complete' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="cert-builder-content" ref={contentRef}>
        {step === 'birth-data' && (
          <BirthDataForm data={data} onChange={setData} />
        )}

        {step === 'template-select' && (
          <TemplateGallery selected={selectedTemplate} onSelect={setSelectedTemplate} />
        )}

        {step === 'preview' && isLoading && (
          <div className="cert-loading">
            <div className="cert-loading-spinner" />
            <div className="cert-loading-text">Computing celestial data...</div>
          </div>
        )}

        {step === 'preview' && loadError && (
          <div className="cert-error">
            <div className="cert-error-icon">⚠️</div>
            <div className="cert-error-text">{loadError}</div>
            <button className="cert-nav-btn cert-nav-btn--back" onClick={() => setLoadError(null)}>Try Again</button>
          </div>
        )}

        {step === 'preview' && enrichedData && !isLoading && !loadError && (
          <CertificatePreview
            data={enrichedData}
            templateId={selectedTemplate}
            options={options}
            onOptionsChange={setOptions}
          />
        )}

        {step === 'export' && enrichedData && (
          <CertificateExport
            data={enrichedData}
            templateId={selectedTemplate}
            options={options}
          />
        )}
      </div>

      {/* Navigation */}
      {step !== 'export' && (
        <div className="cert-nav">
          <button className="cert-nav-btn cert-nav-btn--back" onClick={handleBack}>
            {step === 'birth-data' ? 'Cancel' : 'Back'}
          </button>
          <button
            className="cert-nav-btn cert-nav-btn--next"
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
          >
            {step === 'template-select' ? 'Generate Preview →' : step === 'preview' ? 'Export →' : 'Continue →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificateBuilder;
