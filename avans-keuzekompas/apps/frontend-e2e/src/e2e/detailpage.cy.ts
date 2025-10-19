beforeEach(() => {
  cy.request('POST', '/api/auth/login', {
    email: 'testuser@student.avans.nl',
    password: 'testaccount123'
  }).then((resp) => {
    cy.setCookie('auth', resp.body.token);
  });
});

describe('Elective detail (happy flow)', () => {
  it('shows detail information', () => {
    cy.intercept('GET', /\/api\/module\/m42$/, {
      statusCode: 200,
      body: { status: 200, data: {
        id: 'm42',
        title: 'Design Thinking',
        description: 'Leer via empathisch onderzoek...',
        location: 'Den Bosch',
        period: 'P2',
        studentCredits: 5,
        language: 'NL',
        level: 'Jaar 2',
        duration: '4 weken',
        offeredBy: 'CMD',
      }},
    }).as('getModule');

    cy.visit('/electives/m42');
    cy.wait('@getModule');

    cy.contains('h1', 'Design Thinking').should('be.visible');
    cy.contains('Locatie').should('be.visible');
    cy.contains('Den Bosch').should('be.visible');

    cy.get('button[title*="favorieten"]').should('be.visible');
  });
});