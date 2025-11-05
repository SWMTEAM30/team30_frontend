/// <reference types="cypress" />

Cypress.Commands.add('mockAuthMe', () => {
  cy.intercept('GET', '**/api/auth/me', {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { userId: 'u1', username: 'tester', modelImage: null } },
  }).as('authMe');
});

Cypress.Commands.add('mockAuthMeFail', () => {
  cy.intercept('GET', '**/api/auth/me', {
    statusCode: 401,
    body: { status: 'fail', message: 'unauthorized', data: null },
  }).as('authMeFail');
});

Cypress.Commands.add('mockAuthRefresh', () => {
  cy.intercept('POST', '**/api/auth/refresh', {
    statusCode: 200,
    body: { status: 'success', message: 'refreshed', data: null },
  }).as('authRefresh');
});

Cypress.Commands.add('mockChatSend', () => {
  cy.intercept('POST', '**/api/chat/send*', {
    statusCode: 200,
    body: { status: 'success', message: 'sent', data: 1 },
  }).as('chatSend');
});

Cypress.Commands.add('mockRoomsCreate', () => {
  cy.intercept('POST', '**/api/chat/rooms', {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { id: 'r1', title: 'room', createdAt: new Date().toISOString() } },
  }).as('roomsCreate');
});

Cypress.Commands.add('mockFittingProxyImage', () => {
  cy.intercept('GET', '**/api/fitting/proxy-image', {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { image_url: '/mock/model.png' } },
  }).as('fittingProxyImage');
});

Cypress.Commands.add('mockFittingTryOn', () => {
  cy.intercept('POST', '**/api/fitting/try-on', {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { image_url: '/mock/fit.jpg', task_id: 't1' } },
  }).as('fittingTryOn');
});

Cypress.Commands.add('mockFittingStatus', () => {
  cy.intercept('GET', '**/api/fitting/status/*', {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { status: 'completed', image_url: '/mock/fit.jpg' } },
  }).as('fittingStatus');
});
