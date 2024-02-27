import { buildSignInPath } from '@graasp/sdk';

import { HOME_PATH } from '../../src/config/paths';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
} from '../../src/config/selectors';

const SIGN_IN_PATH = buildSignInPath({
  host: Cypress.env('AUTHENTICATION_HOST'),
});

// catch hook warning from react
Cypress.on('uncaught:exception', (err) => {
  if (err.message.startsWith('Error: Invalid hook call.')) {
    // failing the test
    return true;
  }
  return false;
});

describe('Header', () => {
  describe('User Menu', () => {
    it('view member profile', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      cy.wait('@getCurrentMember');
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID}`).click();
      cy.wait('@goToMemberProfile');
      cy.url().should('contain', Cypress.env('ACCOUNT_HOST'));
    });

    // todo: not available currently because cookie is httpOnly
    // it('Sign in', () => {
    //   cy.setUpApi();
    //   cy.visit(HOME_PATH);

    //   cy.wait('@getCurrentMember');
    //   cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
    //   cy.get(`#${HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID}`).click();
    //   cy.url().should('contain', SIGN_IN_PATH);
    // });

    it('Sign out', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);

      cy.wait('@getCurrentMember');
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}`).click();
      // url also contains redirection
      cy.url().should('contain', SIGN_IN_PATH);
    });

    // todo: not available since cookie is httpOnly
    // it('Switch users', () => {
    //   cy.setUpApi({ storedSessions: MOCK_SESSIONS });
    //   cy.visit(HOME_PATH);

    //   cy.wait('@getCurrentMember');
    //   cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();

    //   MOCK_SESSIONS.forEach(({ id }) => {
    //     cy.get(`#${buildMemberMenuItemId(id)}`).should('be.visible');
    //   });

    //   // switch to first user
    //   cy.get(`#${buildMemberMenuItemId(MOCK_SESSIONS[0].id)}`)
    //     .click()
    //     .then(() => {
    //       // session cookie should be different
    //       const currentCookie = getCurrentSession();
    //       expect(currentCookie).to.equal(MOCK_SESSIONS[0].token);
    //     });
    // });
  });
});
