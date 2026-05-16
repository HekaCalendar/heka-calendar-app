/**
 * safeVoid — Swallow promise rejections silently in production,
 * log them in development. Prevents unhandled rejection crashes.
 */
export function safeVoid<T>(promise: Promise<T>, ctx?: string): void {
  promise.catch((err: unknown) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(`[safeVoid${ctx ? `:${ctx}` : ''}]`, err);
    }
  });
}
