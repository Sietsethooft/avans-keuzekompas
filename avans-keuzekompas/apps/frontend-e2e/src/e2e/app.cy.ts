beforeEach(() => {
  cy.request('POST', '/api/auth/login', {
    email: 'testuser@student.avans.nl',
    password: 'testaccount123'
  }).then((resp) => {
    cy.setCookie('auth', resp.body.token);
  });
});

describe('Electives overview (happy flow)', () => {
  it('shows modules and allows quick filtering', () => {
    cy.intercept('GET', /\/api\/module(\?.*)?$/, {
      statusCode: 200,
      body: {
        status: 200,
        data: [
          { id: 'm1', title: 'Data Literacy', description: 'NL desc', location: 'Breda', period: 'P1', studentCredits: 5, language: 'EN', level: null, duration: null, offeredBy: null },
          { id: 'm2', title: 'Digitale Ethiek', description: 'EN desc', location: 'Den Bosch', period: 'P4', studentCredits: 5, language: 'EN', level: null, duration: null, offeredBy: null },
          { id: 'm3', title: 'UX Research', description: 'NL desc', location: 'Tilburg', period: 'P4', studentCredits: 5, language: 'NL', level: null, duration: null, offeredBy: null },
        ],
      },
    }).as('getModules');

    cy.visit('/electives');
    cy.wait('@getModules');

    cy.get('.card').should('have.length.at.least', 3);

    cy.get('#search').type('Ethiek');
    cy.contains('.card-title', 'Digitale Ethiek').should('be.visible');

    cy.contains('.card-title', 'Digitale Ethiek')
      .parents('.card')
      .within(() => {
        cy.get('button[title*="favorieten"]').click();
      });
  });
});
