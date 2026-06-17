/**
 * Crash & error monitoring abstraction
 *
 * Supports Sentry (web) and Firebase Crashlytics (Capacitor) when configured.
 * All SDKs are loaded lazily so the app keeps working if they are unavailable.
 */

export interface Breadcrumb {
  category?: string;
  message: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}

export interface UserMonitoringContext {
  id?: string;
  email?: string;
  username?: string;
}

export interface MonitoringAdapter {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, level?: Breadcrumb['level']): void;
  addBreadcrumb(crumb: Breadcrumb): void;
  setUser(user: UserMonitoringContext | null): void;
  setTag(key: string, value: string): void;
}

class MonitoringService implements MonitoringAdapter {
  private adapters: MonitoringAdapter[] = [];
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initialized || this.initPromise) return this.initPromise ?? Promise.resolve();
    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (sentryDsn && typeof sentryDsn === 'string') {
      try {
        const Sentry = await import('@sentry/react');
        Sentry.init({
          dsn: sentryDsn,
          environment: import.meta.env.MODE,
          release: __APP_VERSION__,
          tracesSampleRate: parseFloat(String(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1')),
          beforeSend(event: any) {
            // Drop events in local dev unless explicitly enabled.
            if (import.meta.env.DEV && !import.meta.env.VITE_SENTRY_DEV_ENABLED) {
              return null;
            }
            return event;
          },
        });
        this.adapters.push({
          captureException: (error, context) => Sentry.captureException(error, context ? { extra: context } : undefined),
          captureMessage: (message, level) => Sentry.captureMessage(message, level ?? 'info'),
          addBreadcrumb: (crumb) => Sentry.addBreadcrumb(crumb),
          setUser: (user) => Sentry.setUser(user ?? undefined),
          setTag: (key, value) => Sentry.setTag(key, value),
        });
      } catch (err) {
        console.warn('[Monitoring] Sentry init failed:', err);
      }
    }

    try {
      const crashlyticsModule = '@capacitor-firebase/crashlytics';
      const { FirebaseCrashlytics } = await import(crashlyticsModule);
      const crashlytics = FirebaseCrashlytics;
      this.adapters.push({
        captureException: (error) => {
          crashlytics.recordException({ message: error.message, stacktrace: error.stack }).catch(() => {});
        },
        captureMessage: (message, level) => {
          crashlytics.log({ message: `[${level ?? 'info'}] ${message}` }).catch(() => {});
        },
        addBreadcrumb: (crumb) => {
          crashlytics.log({ message: `[${crumb.level ?? 'info'}:${crumb.category}] ${crumb.message}` }).catch(() => {});
        },
        setUser: (user) => {
          if (user?.id) {
            crashlytics.setUserId({ userId: user.id }).catch(() => {});
          }
        },
        setTag: (key, value) => {
          crashlytics.setCustomKey({ key, value }).catch(() => {});
        },
      });
    } catch {
      // Crashlytics plugin not installed — ignore.
    }

    this.initialized = true;
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    console.error('[Monitoring] Exception captured:', error, context);
    this.adapters.forEach((a) => {
      try {
        a.captureException(error, context);
      } catch { /* ignore */ }
    });
  }

  captureMessage(message: string, level: Breadcrumb['level'] = 'info'): void {
    console.log(`[Monitoring] ${level}:`, message);
    this.adapters.forEach((a) => {
      try {
        a.captureMessage(message, level);
      } catch { /* ignore */ }
    });
  }

  addBreadcrumb(crumb: Breadcrumb): void {
    this.adapters.forEach((a) => {
      try {
        a.addBreadcrumb(crumb);
      } catch { /* ignore */ }
    });
  }

  setUser(user: UserMonitoringContext | null): void {
    this.adapters.forEach((a) => {
      try {
        a.setUser(user);
      } catch { /* ignore */ }
    });
  }

  setTag(key: string, value: string): void {
    this.adapters.forEach((a) => {
      try {
        a.setTag(key, value);
      } catch { /* ignore */ }
    });
  }
}

export const monitoring = new MonitoringService();
