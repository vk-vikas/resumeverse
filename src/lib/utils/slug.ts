import slugifyLib from 'slugify';

/**
 * Generate a URL-safe slug from a name with a random 4-char suffix.
 * e.g. "John Doe" → "john-doe-x7k2"
 *      "José García" → "jose-garcia-a3m1"
 */
export function generateSlug(name: string): string {
  const base = slugifyLib(name, {
    lower: true,
    strict: true, // strip special chars
    locale: 'en',
  });

  const suffix = generateRandomSuffix(4);
  return `${base}-${suffix}`;
}

/**
 * Validate and sanitize a user-chosen custom slug.
 * Must be URL-safe, lowercase, 3-50 chars, only letters/numbers/hyphens.
 */
export function sanitizeSlug(
  slug: string
): { valid: true; slug: string } | { valid: false; error: string } {
  const trimmed = slug.trim().toLowerCase();

  if (trimmed.length < 3 || trimmed.length > 50) {
    return { valid: false, error: 'Slug must be between 3 and 50 characters' };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Slug must contain only lowercase letters, numbers, and hyphens (no leading/trailing/consecutive hyphens)',
    };
  }

  return { valid: true, slug: trimmed };
}

/**
 * Generate a random alphanumeric suffix of given length.
 */
function generateRandomSuffix(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
