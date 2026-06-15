// Optional runtime dependencies — typed loosely because they are loaded dynamically.
declare module '@sentry/react' {
  const Sentry: any;
  export = Sentry;
}

declare module '@capacitor-firebase/crashlytics' {
  export const FirebaseCrashlytics: any;
}
