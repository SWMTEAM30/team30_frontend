import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// 각 테스트 후 cleanup
afterEach(() => {
  cleanup();
});

// 전역 모킹 설정
global.fetch = vi.fn();

// IndexedDB 모킹 (필요한 경우)
if (typeof window !== 'undefined') {
  // IndexedDB 모킹을 위한 기본 설정
  Object.defineProperty(window, 'indexedDB', {
    writable: true,
    value: {
      open: vi.fn(),
    },
  });
}

