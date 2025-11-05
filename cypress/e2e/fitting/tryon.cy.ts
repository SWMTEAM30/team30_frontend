describe('Fitting - try on flow', () => {
	it('opens fitting panel and performs try-on', () => {
		cy.mockAuthMe();
		cy.mockRoomsCreate();
		cy.mockFittingProxyImage();
		cy.mockFittingTryOn();
		cy.mockFittingStatus();

		cy.visit('/');
		cy.get('[data-testid="landing-input"]').type('가상 피팅 해줘');
		cy.get('[data-testid="landing-send"]').click();

		cy.wait('@roomsCreate');

		// 피팅 패널로 이동
		cy.get('[data-testid="panel-fitting"]').click({ force: true });

		cy.wait('@fittingProxyImage');

		// Try-on 버튼 클릭
		cy.get('[data-testid="tryon-button"]').first().click({ force: true });

		cy.wait('@fittingTryOn').its('response.statusCode').should('eq', 200);
		cy.wait('@fittingStatus').its('response.statusCode').should('eq', 200);
	});
});
