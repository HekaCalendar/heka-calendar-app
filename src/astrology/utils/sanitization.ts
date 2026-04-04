/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INPUT SANITIZATION UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Enterprise-grade input sanitization to prevent:
 * - XSS attacks
 * - Prompt injection in AI calls
 * - HTML/script injection
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Sanitize user input to prevent XSS and injection attacks
 * Removes HTML tags, script content, and normalizes whitespace
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return (
    input
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove script tags and content (case insensitive)
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      // Remove event handlers
      .replace(/on\w+\s*=/gi, '')
      // Remove javascript: protocol
      .replace(/javascript:/gi, '')
      // Remove data: protocol
      .replace(/data:/gi, '')
      // Remove null bytes
      .replace(/\0/g, '')
      // Normalize whitespace
      .trim()
      // Limit length to prevent DoS
      .slice(0, 500)
  );
}

/**
 * Sanitize location/place names
 * Allows letters, numbers, spaces, hyphens, commas, periods
 */
export function sanitizeLocationName(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return (
    input
      // Remove HTML
      .replace(/<[^>]*>/g, '')
      // Only allow safe characters for place names
      .replace(/[^\w\s\-\.,']/g, '')
      // Normalize whitespace
      .trim()
      // Limit length
      .slice(0, 100)
  );
}

/**
 * Sanitize AI prompt content to prevent prompt injection
 * Escapes special characters that could manipulate AI behavior
 */
export function sanitizeForPrompt(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return (
    input
      // Remove HTML
      .replace(/<[^>]*>/g, '')
      // Escape prompt injection markers
      .replace(/\{\{/g, '{ {') // Prevent template injection
      .replace(/\}\}/g, '} }')
      // Remove system instruction markers
      .replace(/system:\s*/gi, '')
      .replace(/assistant:\s*/gi, '')
      .replace(/user:\s*/gi, '')
      // Remove role markers
      .replace(/<\|im_start\|>/g, '')
      .replace(/<\|im_end\|>/g, '')
      .replace(/<\|system\|>/g, '')
      .replace(/<\|assistant\|>/g, '')
      .replace(/<\|user\|>/g, '')
      // Limit length
      .trim()
      .slice(0, 1000)
  );
}

/**
 * Validate and sanitize birth date string
 * Expected format: YYYY-MM-DD
 */
export function sanitizeBirthDate(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Remove any non-numeric and non-dash characters
  const cleaned = input.replace(/[^\d\-]/g, '');

  // Validate format with regex
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(cleaned)) {
    return null;
  }

  // Validate it's a real date
  const date = new Date(cleaned);
  if (isNaN(date.getTime())) {
    return null;
  }

  // Check date is reasonable (not in future, not too old)
  const now = new Date();
  const minDate = new Date('1900-01-01');
  if (date > now || date < minDate) {
    return null;
  }

  return cleaned;
}

/**
 * Validate and sanitize time string
 * Expected format: HH:MM (24-hour)
 */
export function sanitizeBirthTime(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Remove any non-numeric and non-colon characters
  const cleaned = input.replace(/[^\d:]/g, '');

  // Validate format
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(cleaned)) {
    return null;
  }

  return cleaned;
}

/**
 * Sanitize numeric coordinates
 */
export function sanitizeCoordinate(input: number): number | null {
  if (typeof input !== 'number' || !isFinite(input)) {
    return null;
  }

  // Clamp to valid range
  return Math.max(-180, Math.min(180, input));
}

/**
 * Sanitize timezone string
 */
export function sanitizeTimezone(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Remove unsafe characters
  const cleaned = input.replace(/[<>'"]/g, '').trim();

  // Validate IANA timezone format or offset format
  const tzRegex = /^(?:[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?|UTC|[+-]\d{2}:?\d{2})$/;
  if (!tzRegex.test(cleaned)) {
    // Try to validate as UTC offset
    const offsetRegex = /^[+-]?\d{1,2}(:\d{2})?$/;
    if (!offsetRegex.test(cleaned)) {
      return null;
    }
  }

  return cleaned.slice(0, 50);
}

/**
 * Sanitize profile name
 */
export function sanitizeProfileName(input: string): string {
  if (!input || typeof input !== 'string') {
    return 'Anonymous';
  }

  return (
    input
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s\-'.]/g, '')
      .trim()
      .slice(0, 50) || 'Anonymous'
  );
}

// Default export
export default {
  sanitizeUserInput,
  sanitizeLocationName,
  sanitizeForPrompt,
  sanitizeBirthDate,
  sanitizeBirthTime,
  sanitizeCoordinate,
  sanitizeTimezone,
  sanitizeProfileName,
};
