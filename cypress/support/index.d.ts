/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      mockAuthMe(): Chainable<void>;
      mockAuthMeFail(): Chainable<void>;
      mockAuthRefresh(): Chainable<void>;
      mockChatSend(): Chainable<void>;
      mockRoomsCreate(): Chainable<void>;
      mockFittingProxyImage(): Chainable<void>;
      mockFittingTryOn(): Chainable<void>;
      mockFittingStatus(): Chainable<void>;
    }
  }
}

export {};


