describe('Auth - login flow', () => {
  it('stays authenticated and can start a chat', () => {
    // 성공하는 인증 시나리오
    cy.mockAuthMe();
    cy.mockRoomsCreate();

    cy.visit('/');

    // 방 생성 요청 확인
    cy.wait('@roomsCreate').its('response.statusCode').should('eq', 200);
  });

  it('refreshes token on auth fail and retries', () => {
    // 처음 auth/me 실패 -> refresh 성공 -> 이후 auth/me 성공
    cy.mockAuthMeFail();
    cy.mockAuthRefresh();
    cy.intercept('GET', '**/api/auth/me', {
      statusCode: 200,
      body: { status: 'success', message: 'ok', data: { userId: 'u1', username: 'tester', modelImage: null } },
    }).as('authMeAfterRefresh');

    cy.mockRoomsCreate();
    cy.visit('/');

    cy.wait('@authMeFail');
    cy.wait('@authRefresh');
    cy.wait('@authMeAfterRefresh');
    cy.wait('@roomsCreate').its('response.statusCode').should('eq', 200);
  });
});
