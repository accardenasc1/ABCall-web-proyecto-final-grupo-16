import { faker } from '@faker-js/faker';
import { login, logout } from './spec_user.cy';

describe('Chatbot', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Hacer preguntas al chatbot', () => {
    // Generar datos aleatorios del nuevo usuario:
    const username = faker.internet.username();
    const password = 'Qwerty123*#';

    // Login test
    login(username, password);

    // Abrir chatbot
    cy.get('.chat-button').click();

    // Escribir primer mensaje
    cy.get('input[formcontrolname="message"]').type(faker.lorem.words(3));
    cy.get('.chat-send').click();
    cy.wait(2100);

    // Escribir Segundo mensaje
    cy.get('input[formcontrolname="message"]').type(faker.lorem.words(3));
    cy.get('.chat-send').click();
    cy.wait(2100);

    // Escribir Tercer mensaje
    cy.get('input[formcontrolname="message"]').type(faker.lorem.words(3));
    cy.get('.chat-send').click();
    cy.wait(2100);

    //Cerrar chat
    cy.get('.chat-button').click();
    cy.wait(100);

    // Logout test
    logout();
  });
});
