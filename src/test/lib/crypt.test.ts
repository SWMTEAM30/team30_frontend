import { describe, it, expect } from 'vitest';
import { encrypt } from '@/lib/crypt';
import CryptoJS from 'crypto-js';

describe('crypt', () => {
  describe('encrypt', () => {
    it('should hash string using SHA256', () => {
      const input = 'test string';
      const result = encrypt(input);
      
      // SHA256 해시는 64자리 hex 문자열
      expect(result).toHaveLength(64);
      expect(typeof result).toBe('string');
      
      // 같은 입력에 대해 같은 해시 반환
      expect(encrypt(input)).toBe(result);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = encrypt('password1');
      const hash2 = encrypt('password2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should match CryptoJS SHA256 output', () => {
      const input = 'test';
      const expected = CryptoJS.SHA256(input).toString();
      const result = encrypt(input);
      
      expect(result).toBe(expected);
    });

    it('should handle empty string', () => {
      const result = encrypt('');
      expect(result).toHaveLength(64);
    });

    it('should handle special characters', () => {
      const input = '!@#$%^&*()';
      const result = encrypt(input);
      expect(result).toHaveLength(64);
    });
  });
});

