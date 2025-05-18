/// <reference types="cypress"/>
import BasePage from "../../pages/BasePage";
import LoginPage from "../../pages/LoginPage";

describe('Login Verification', () => {

  const loginPage = new LoginPage();
  const basePage = new BasePage();

  beforeEach(() => {
    cy.visit(Cypress.env("APP_BASE_URL"));
  })

  it('TG11S-T131 -Validate login with valid credentials', () => {

    loginPage.login(Cypress.env('USER'), Cypress.env('PASSWORD'));

    cy.url().should('include', 'weborders');

    basePage.getWebOrdersHeading().should('have.text', 'Web Orders');
    basePage.getLogoutButton().should('have.text', 'Logout');
    basePage.getWelcomeUserInfo().should('include.text', Cypress.env('USER'));
  })

 it("TG11S-T142 - Validate logout", () => {

    loginPage.login(Cypress.env("USER"), Cypress.env("PASSWORD"));
    basePage.getLogoutButton().click();
    cy.url().should("include", "Login");
    loginPage.getLoginForm().should("be.visible");
  });

  [
    {
      title: 'emptyUsernameAndPassword',
      username: "",
      password: "",
    },
    {
      title: 'invalidUsernameValidPassword',
      username: "InvalidUsername",
      password: Cypress.env("PASSWORD"),
    },
    {
      title: 'validUsernameInvalidPassword',
      username: Cypress.env("USER"),
      password: "InvalidPassword",
    },
    {
      title: 'invalidUsernameAndPassword',
      username: "InvalidUsername",
      password: "InvalidPassword",
    },
  ].forEach((creds) => {
    it(`TG11S-T164 - Validate login with invalid credentials ${creds.title}`, () => {

      if(creds.username === '' && creds.password === '') loginPage.clickOnLoginButton();
      else loginPage.login(creds.username, creds.password);

      cy.url().should("include", "login");
      loginPage.getErrorMessage().should('have.text', 'Invalid Login or Password.');
    });
  });
});