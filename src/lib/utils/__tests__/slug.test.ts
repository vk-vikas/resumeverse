import { describe, it, expect } from 'vitest';
import { generateSlug, sanitizeSlug } from '../slug';

describe('slug utility functions', () => {
  describe('generateSlug', () => {
    it('converts name to lowercase slug', () => {
      const slug = generateSlug('Alice Smith');
      // "alice-smith-xxxx"
      expect(slug).toMatch(/^alice-smith-[a-z0-9]{4}$/);
    });

    it('handles multiple spaces', () => {
      const slug = generateSlug('Bob   Doe');
      expect(slug).toMatch(/^bob-doe-[a-z0-9]{4}$/);
    });

    it('removes special characters (apostrophes, periods)', () => {
      const slug = generateSlug('John O\'Reilly Jr.');
      expect(slug).toMatch(/^john-oreilly-jr-[a-z0-9]{4}$/);
    });

    it('trims whitespace', () => {
      const slug = generateSlug('  Eve  ');
      expect(slug).toMatch(/^eve-[a-z0-9]{4}$/);
    });

    it('handles unicode characters (é, ñ, ü → e, n, u)', () => {
      const slug = generateSlug('José Niño Müller');
      expect(slug).toMatch(/^jose-nino-muller-[a-z0-9]{4}$/);
    });
  });

  describe('sanitizeSlug', () => {
    it('validates a correct custom slug', () => {
      const result = sanitizeSlug('valid-slug-123');
      expect(result).toEqual({ valid: true, slug: 'valid-slug-123' });
    });

    it('rejects an invalid custom slug', () => {
      const result = sanitizeSlug('Invalid Slug!');
      expect(result.valid).toBe(false);
    });
  });
});
