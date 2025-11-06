import { describe, it, expect } from 'vitest';
import { matchThevalueinMessage } from '@/lib/validation';

describe('validation', () => {
  describe('matchThevalueinMessage', () => {
    it('should extract number from message', () => {
      expect(matchThevalueinMessage('가격은 1234원입니다')).toBe(1234);
      expect(matchThevalueinMessage('주문번호: 5678')).toBe(5678);
      expect(matchThevalueinMessage('123')).toBe(123);
    });

    it('should return first number found', () => {
      expect(matchThevalueinMessage('가격은 1234원이고 할인은 5678원입니다')).toBe(1234);
    });

    it('should return null if no number found', () => {
      expect(matchThevalueinMessage('숫자가 없는 메시지')).toBe(null);
      expect(matchThevalueinMessage('')).toBe(null);
    });

    it('should handle messages with only numbers', () => {
      expect(matchThevalueinMessage('12345')).toBe(12345);
    });
  });
});

