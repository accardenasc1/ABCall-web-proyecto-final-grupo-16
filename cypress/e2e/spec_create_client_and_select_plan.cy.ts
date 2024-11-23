import { faker } from '@faker-js/faker';
import { login, logout } from './spec_user.cy';

describe('Create Client and Select Plan', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Create a user, change role to client, create a client, and select a plan', () => {
    // Generar datos aleatorios del nuevo usuario:
    const username = faker.internet.userName();
    const password = 'Qwerty123*#';

    // Paso 1: Crear un nuevo usuario
    login(username, password);
    logout();
    // Paso 2: Iniciar sesión como administrador
    // Autenticación
    cy.get('input[formcontrolname="username"]').type('admin');
    cy.get('input[formcontrolname="password"]').type('Camda96*');
    cy.get('button.login-button').click();

    // Ir a la página de usuarios
    cy.get('mat-list-item[routerlink="/app/user"]').click();

    // Abrir el modal de edición para el usuario recién creado
    cy.get(`td:contains(${username})`).parent().find('button[aria-label="CPermission change"]').click();

    // Cambiar el rol a "Cliente"
    cy.get('select[formcontrolname="type"]').select('Cliente');

    // Guardar los cambios
    cy.get('button[aria-label="Save"]').click();

    // Logout del administrador
    logout();

    // Paso 3: Iniciar sesión con el usuario cliente creado
    cy.get('input[formcontrolname="username"]').type(username);
    cy.get('input[formcontrolname="password"]').type(password);
    cy.get('button.login-button').click();

    // Paso 4: Crear un cliente
    const clientName = faker.company.name();
    const clientNit = faker.number.int(50);
    const clientEmail = faker.internet.email();
    const clientPhone = faker.number.int(10);
    const clientAddress = faker.address.streetAddress();
    const clientDepartment = 'Cundinamarca'; // Puedes cambiar esto según tus datos
    const clientCity = 'Bogotá'; // Puedes cambiar esto según tus datos

    // Ir a crear cliente
    cy.get('mat-list-item[routerlink="/app/client"]').click();

    // Llenar el formulario con valores válidos
    cy.get('input[formcontrolname="name"]').type(clientName);
    cy.get('input[formcontrolname="nit"]').type(clientNit.toString());
    cy.get('input[formcontrolname="email"]').type(clientEmail);
    cy.get('input[formcontrolname="phone"]').type(clientPhone.toString());
    cy.get('select[formcontrolname="department"]').select(clientDepartment);
    cy.get('select[formcontrolname="city"]').select(clientCity);
    cy.get('input[formcontrolname="address"]').type(clientAddress);

    // Guardar el cliente
    cy.get('button.save').click();
    cy.wait(100);


    // Seleccionar un plan
    cy.get('button.select-button').first().click({ force: true });

    // Cerrar el modal y volver al home
    cy.contains('button', 'Aceptar').click({ force: true });

    // Logout del usuario cliente
    logout();
  });
});