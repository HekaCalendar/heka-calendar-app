/**
 * ID Generator Utility
 * Generates unique identifiers for diary entries and other entities
 */

/**
 * Generate a unique ID with timestamp and random component
 * Format: timestamp-random (e.g., "1708123456789-a1b2c3d4")
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Generate a short ID (8 characters)
 * Good for display purposes
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Generate a UUID v4 (standard format)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
