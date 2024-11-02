describe('HomeComponent', () => {
  beforeEach(() => {
    cy.visit('/home');
  });
  it('should render the welcome message', () => {
    cy.get('p').contains('Componente Home, Bienvenido');
  });
});
