describe('LayoutComponent', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the toolbar with title ABCCall', () => {
    cy.get('mat-toolbar span').contains('ABCCall');
  });

  it('should have a menu button', () => {
    cy.get('button[mat-icon-button]').should('exist');
  });

  it('should have a sidenav with menu items', () => {
    cy.get('mat-sidenav mat-nav-list mat-list-item').should('have.length', 2);
  });

  it('should navigate to Home when Home menu item is clicked', () => {
    cy.get('mat-list-item[routerLink="/home"]').click();
    cy.url().should('include', '/home');
  });

  it('should navigate to Incident when Incident menu item is clicked', () => {
    cy.get('mat-list-item[routerLink="/incident"]').click();
    cy.url().should('include', '/incident');
  });
});
