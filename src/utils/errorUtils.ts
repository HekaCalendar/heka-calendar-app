/**
 * Error utility helpers — safely extract messages and codes from `unknown` errors.
 * Use these instead of `catch (err: any)` to maintain type safety.
 */

export function getErrorMessage(err: unknown, fallback = 'An unexpected error occurred'): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const msg = (err as Record<string, unknown>).message;
    if (typeof msg === 'string') return msg;
  }
  return fallback;
}

export function getErrorCode(err: unknown): string | undefined {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as Record<string, unknown>).code;
    if (typeof code === 'string') return code;
  }
  return undefined;
}
