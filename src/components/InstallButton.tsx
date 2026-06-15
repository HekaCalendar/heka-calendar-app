/**
 * Install Button Component
 * Provides explicit install button for PWA on desktop and mobile
 */

import { useState, useEffect, useCallback } from 'react';
import { AlertDialog } from './ui/AlertDialog';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS (different install method)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  // Don't show if already installed
  if (isInstalled) return null;

  // iOS Safari doesn't support beforeinstallprompt
  if (isIOS) {
    return (
      <>
        <button
          className="btn btn--primary install-btn"
          onClick={() => setShowIOSHint(true)}
          title="Install on iOS"
        >
          📲 Install App
        </button>
        <AlertDialog
          isOpen={showIOSHint}
          onClose={() => setShowIOSHint(false)}
          title="Install on iOS"
          description="Tap the share button below, then scroll down and tap 'Add to Home Screen'."
          confirmText="Got it"
        />
      </>
    );
  }

  // Show install button if prompt is available
  if (deferredPrompt) {
    return (
      <button
        className="btn btn--primary install-btn"
        onClick={handleInstall}
        title="Install HEKA Calendar"
      >
        📲 Install App
      </button>
    );
  }

  // Fallback - may not be installable (not HTTPS, or already in browser that doesn't support)
  return null;
};

export default InstallButton;
