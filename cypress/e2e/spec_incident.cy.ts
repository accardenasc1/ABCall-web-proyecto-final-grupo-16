describe('IncidentComponent', () => {
  beforeEach(() => {
    cy.visit('/incident');
  });

  it('should render the incident message', () => {
    cy.get('p').contains('Incidentes Componente!');
  });
});
