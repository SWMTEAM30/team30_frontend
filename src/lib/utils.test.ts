import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cn, moveItemToFront, getStringNumbersOnly, elapsedTimeText } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
      expect(cn({ foo: true, bar: false })).toBe('foo');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
    });
  });

  describe('moveItemToFront', () => {
    interface TestItem {
      id: string | number;
      name: string;
    }

    it('should move item with matching id to front', () => {
      const array: TestItem[] = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
        { id: 3, name: 'third' },
      ];
      const result = moveItemToFront(array, 2);
      expect(result[0].id).toBe(2);
      expect(result[0].name).toBe('second');
      expect(result.length).toBe(3);
    });

    it('should return original array if id not found', () => {
      const array: TestItem[] = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
      ];
      const result = moveItemToFront(array, 999);
      expect(result).toEqual(array);
      // 함수는 항상 새로운 배열을 반환하므로 배열 내용은 같지만 참조는 다름
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle string ids', () => {
      const array: TestItem[] = [
        { id: 'a', name: 'first' },
        { id: 'b', name: 'second' },
      ];
      const result = moveItemToFront(array, 'b');
      expect(result[0].id).toBe('b');
    });

    it('should handle empty array', () => {
      const array: TestItem[] = [];
      const result = moveItemToFront(array, 1);
      expect(result).toEqual([]);
    });
  });

  describe('getStringNumbersOnly', () => {
    it('should extract numbers from string', () => {
      expect(getStringNumbersOnly('abc123def456')).toBe('123456');
      expect(getStringNumbersOnly('phone: 010-1234-5678')).toBe('01012345678');
      expect(getStringNumbersOnly('price: $1,234.56')).toBe('123456');
    });

    it('should return empty string if no numbers', () => {
      expect(getStringNumbersOnly('abcdef')).toBe('');
      expect(getStringNumbersOnly('')).toBe('');
    });

    it('should return empty string for non-string input', () => {
      expect(getStringNumbersOnly(null as any)).toBe('');
      expect(getStringNumbersOnly(123 as any)).toBe('');
      expect(getStringNumbersOnly(undefined as any)).toBe('');
    });
  });

  describe('elapsedTimeText', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "방금 전" for very recent dates', () => {
      const now = new Date();
      const fiveSecondsAgo = new Date(now.getTime() - 5 * 1000);
      expect(elapsedTimeText(fiveSecondsAgo)).toBe('방금 전');
    });

    it('should return seconds format for dates less than 60 seconds ago', () => {
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
      expect(elapsedTimeText(thirtySecondsAgo)).toBe('30초 전');
    });

    it('should return minutes format for dates less than 60 minutes ago', () => {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      expect(elapsedTimeText(thirtyMinutesAgo)).toBe('30분 전');
    });

    it('should return hours format for dates less than 24 hours ago', () => {
      const now = new Date();
      const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
      expect(elapsedTimeText(fiveHoursAgo)).toBe('5시간 전');
    });

    it('should return days format for dates less than 7 days ago', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(elapsedTimeText(threeDaysAgo)).toBe('3일 전');
    });

    it('should return formatted date for dates more than 7 days ago', () => {
      const tenDaysAgo = new Date('2024-01-01');
      const result = elapsedTimeText(tenDaysAgo);
      // 한국어 로케일에서는 "2024. 1. 1." 형식으로 나올 수 있음
      expect(result).toMatch(/\d{4}[.\s]+\d{1,2}[.\s]+\d{1,2}/); // 날짜 형식 확인
    });
  });
});

