import { faker } from '@faker-js/faker';

export const login = (username: string, password: string) => {
  // Ir al formulario de registro de nuevo usuario:
  cy.get('a[href="/user-sign-up"]').click();

  // llenar el formulario
  cy.get('input[formcontrolname="first_name"]').type(faker.person.firstName());
  cy.get('input[formcontrolname="last_name"]').type(faker.person.lastName());
  cy.get('input[formcontrolname="username"]').type(username);
  cy.get('input[formcontrolname="id_number"]').type(faker.number.int({ max: 1000 }).toString());
  cy.get('input[formcontrolname="email"]').type(`${faker.person.firstName()}@${faker.person.firstName()}.com`);
  cy.get('input[formcontrolname="password"]').type(password);
  cy.get('input[formcontrolname="confirmPassword"]').type(password);
  cy.get('input[formcontrolname="phone"]').type(faker.phone.number({ style: 'international' }));
  cy.get('input[formcontrolname="address"]').type(faker.address.streetAddress());
  cy.get('input[type="checkbox"]').check();

  //Guardar
  cy.get('button.save').click();
  cy.wait(100);

  // Volver al login
  cy.get('button.back').click();

  // Autenticación
  cy.get('input[formcontrolname="username"]').type(username);
  cy.get('input[formcontrolname="password"]').type(password);
  cy.get('button.login-button').click();

  // Validación de usuario
  cy.get('.username span:first-child').contains(username);
}

export const logout = () => {
  //Log out:
  cy.get('.logout').click();
}

describe('User', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // it('Registro de usuario y autenticación (caso positivo)', () => {
  //   // Generar datos aleatorios del nuevo usuario:
  //   const username = faker.internet.username();
  //   const password = 'Qwerty123*#';

  //   // Login test
  //   login(username, password);

  //   // Logout test
  //   logout();
  // });
});
