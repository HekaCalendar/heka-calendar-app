import { eventBus } from '../services/eventBus';

export interface SafeAsyncResult<T> {
  success: true;
  data: T;
}

export interface SafeAsyncError {
  success: false;
  error: string;
  code?: string;
}

export type SafeAsyncReturn<T> = SafeAsyncResult<T> | SafeAsyncError;

/**
 * Wrap a promise so it never throws. Errors are logged and returned
 * as a discriminated union `{ success: false, error }`.
 */
export async function safeAsync<T>(
  promise: Promise<T>,
  context: string
): Promise<SafeAsyncReturn<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (err) {
    const { message, code } = handleUnknownError(err);
    console.error(`[${context}]`, message, code ? `(${code})` : '', err);
    eventBus.emit('heka:error:logged', { context, message, code });
    return { success: false, error: message, code };
  }
}

/**
 * Retry an async operation with exponential backoff.
 * Only retries on transient Firebase errors.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { maxRetries?: number; delayMs?: number; context?: string }
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3;
  const baseDelay = options?.delayMs ?? 500;
  const context = options?.context ?? 'withRetry';

  const retryableCodes = new Set([
    'unavailable',
    'deadline-exceeded',
    'resource-exhausted',
    'internal',
    'aborted',
  ]);

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const { code } = handleUnknownError(err);
      if (!retryableCodes.has(code ?? '') || attempt === maxRetries) {
        throw err;
      }
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(
        `[${context}] Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`,
        code
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw lastError;
}

/**
 * Narrow an `unknown` error to a safe shape.
 */
function getCodeFromError(err: unknown): string | undefined {
  if (err instanceof Error) {
    const e = err as unknown as Record<string, unknown>;
    const code = e.code ?? e.status;
    return typeof code === 'string' ? code : undefined;
  }
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>;
    const code = e.code ?? e.status;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

export function handleUnknownError(err: unknown): { message: string; code?: string } {
  if (err instanceof Error) {
    return { message: err.message, code: getCodeFromError(err) };
  }
  if (typeof err === 'string') {
    return { message: err };
  }
  if (err && typeof err === 'object') {
    const message = (err as Record<string, unknown>).message;
    return {
      message: typeof message === 'string' ? message : 'An unknown error occurred',
      code: getCodeFromError(err)
    };
  }
  return { message: 'An unknown error occurred' };
}
