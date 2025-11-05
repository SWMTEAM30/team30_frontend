import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// MSW setup
import { setupServer } from 'msw/node';
import { handlers } from './msw/handlers';

const server = setupServer(...handlers);

// Start/stop server
before(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Global mocks
global.fetch = vi.fn();

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'indexedDB', {
    writable: true,
    value: {
      open: vi.fn(),
    },
  });
}
function afterAll(arg0: () => void) {
  throw new Error('Function not implemented.');
}
