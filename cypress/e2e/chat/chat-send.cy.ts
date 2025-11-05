describe('Chat - send message', () => {
  it('creates room and sends message', () => {
    cy.mockAuthMe();
    cy.mockRoomsCreate();
    cy.mockChatSend();

    cy.visit('/');

    cy.get('[data-testid="landing-input"]').type('안녕');
    cy.get('[data-testid="landing-send"]').click();

    cy.wait('@roomsCreate').its('response.statusCode').should('eq', 200);

    // 방으로 진입하면 채팅 입력 및 전송 버튼을 이용해 메시지 전송을 시도
    cy.get('[data-testid="chat-input"]').type('테스트 메시지');
    cy.get('[data-testid="send-button"]').click();
    cy.wait('@chatSend').its('response.statusCode').should('eq', 200);
  });
});
