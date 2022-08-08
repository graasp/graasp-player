import { getCurrentSession } from '@graasp/sdk';

import { MEMBER_PROFILE_PATH, SIGN_IN_PATH } from '../../src/config/constants';
import { HOME_PATH } from '../../src/config/paths';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
  buildMemberMenuItemId,
} from '../../src/config/selectors';
import { LOAD_HOME_PAGE_PAUSE } from '../fixtures/constants';
import { MOCK_SESSIONS } from '../fixtures/members';

describe('Header', () => {
  describe('User Menu', () => {
    it('view member profile', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      cy.wait(LOAD_HOME_PAGE_PAUSE);

      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID}`).click();
      cy.url().should('equal', MEMBER_PROFILE_PATH);
    });

    it('Sign in', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      cy.wait(LOAD_HOME_PAGE_PAUSE);

      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID}`).click();
      cy.url().should('contain', SIGN_IN_PATH);
    });

    it('Sign out', () => {
      cy.setUpApi();
      cy.visit(HOME_PATH);
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();
      cy.get(`#${HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}`).click();
      cy.url().should('equal', SIGN_IN_PATH);
    });

    it('Switch users', () => {
      cy.setUpApi({ storedSessions: MOCK_SESSIONS });
      cy.visit(HOME_PATH);
      cy.get(`#${HEADER_MEMBER_MENU_BUTTON_ID}`).click();

      MOCK_SESSIONS.forEach(({ id }) => {
        cy.get(`#${buildMemberMenuItemId(id)}`).should('be.visible');
      });

      // switch to first user
      cy.get(`#${buildMemberMenuItemId(MOCK_SESSIONS[0].id)}`)
        .click()
        .then(() => {
          // session cookie should be different
          const currentCookie = getCurrentSession();
          expect(currentCookie).to.equal(MOCK_SESSIONS[0].token);
        });
    });
  });
});
