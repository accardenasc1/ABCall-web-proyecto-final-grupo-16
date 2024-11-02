import { faker } from '@faker-js/faker';
import { login } from './spec_user.cy';

describe('Incident', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Registro de incidente y listado', () => {
    // Generar datos aleatorios del nuevo usuario:
    const username = faker.internet.username();
    const password = 'Qwerty123*#';
    const title = faker.lorem.words(3);

    // Login test
    login(username, password);

    // Ir a incidentes
    cy.get('mat-list-item[routerlink="/app/incident"]').click();

    // Click en CREAR
    cy.get('button.create').click();

    // Llenar el formulario con valores validos
    cy.get('input[formcontrolname="title"]').type(title);
    cy.get('select[formcontrolname="clientid"]').select(0);
    // cy.get('mat-option:last-child').click();
    cy.get('textarea[formcontrolname="description"]').type(faker.lorem.lines(5));
    cy.get('select[formcontrolname="type"]').select(2);
    // cy.get('option:last-child').click();

    //Guardar
    cy.get('button.save').click();
    cy.wait(100);

    // Volver a la lista
    cy.get('button.back').click();

    // Logout test
    // logout();
  });
});
