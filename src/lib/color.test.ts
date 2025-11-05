import { describe, it, expect, vi } from 'vitest';
import { parseColorSet } from './color';

// colorSet 모킹
vi.mock('@/styles/generated-palette', () => ({
  colorSet: {
    light: {
      blue: {
        '500': '#27548a',
        DEFAULT: '#27548a',
      },
      red: {
        '500': '#ff0000',
        DEFAULT: '#ff0000',
      },
    },
    dark: {
      blue: {
        '500': '#4a9eff',
        DEFAULT: '#4a9eff',
      },
      red: {
        '500': '#ff4444',
        DEFAULT: '#ff4444',
      },
    },
  },
}));

describe('color', () => {
  describe('parseColorSet', () => {
    it('should parse valid color shade from light theme', () => {
      const result = parseColorSet('blue-500', false);
      expect(result).toBe('#27548a');
    });

    it('should parse valid color shade from dark theme', () => {
      const result = parseColorSet('blue-500', true);
      expect(result).toBe('#4a9eff');
    });

    it('should return default color for invalid color', () => {
      const result = parseColorSet('invalid-color-500', false, '#000000');
      expect(result).toBe('#000000');
    });

    it('should return default color for invalid shade', () => {
      const result = parseColorSet('blue-999', false, '#000000');
      expect(result).toBe('#000000');
    });

    it('should use default defaultColor when provided', () => {
      const result = parseColorSet('invalid-500', false, '#ff00ff');
      expect(result).toBe('#ff00ff');
    });

    it('should handle different color names', () => {
      const result = parseColorSet('red-500', false);
      expect(result).toBe('#ff0000');
    });
  });
});

