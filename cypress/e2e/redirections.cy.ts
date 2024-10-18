import { buildContentPagePath, buildMainPath } from '@/config/paths';
import { USER_SWITCH_SIGN_IN_BUTTON_ID } from '@/config/selectors';

import { FOLDER_WITH_SUBFOLDER_ITEM } from '../fixtures/items';

describe('Home Page', () => {
  describe('Logged out', () => {
    beforeEach(() => {
      cy.setUpApi({
        currentMember: null,
      });
    });

    it('Should redirect to auth with url parameter', () => {
      cy.visit('/');

      cy.url().should('include', `?url=`);
    });
  });
});

describe('Item page', () => {
  describe('Logged out', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: FOLDER_WITH_SUBFOLDER_ITEM.items,
        currentMember: null,
      });

      cy.visit(
        buildMainPath({ rootId: FOLDER_WITH_SUBFOLDER_ITEM.items[0].id }),
      );
    });

    it('Should redirect to auth with url parameter', () => {
      cy.get(`#${USER_SWITCH_SIGN_IN_BUTTON_ID}`).should('be.visible').click();
      cy.get(`[role="menuitem"]:visible`).click();
      cy.url().should('include', `?url=`);
    });
  });
});

describe('Platform switch', () => {
  const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[0];
  const child = FOLDER_WITH_SUBFOLDER_ITEM.items[1];
  beforeEach(() => {
    cy.setUpApi({
      items: FOLDER_WITH_SUBFOLDER_ITEM.items,
    });
    // go to child
    cy.visit(buildContentPagePath({ rootId: parent.id, itemId: child.id }));
  });
  ['builder', 'analytics'].forEach((platform) => {
    it(platform, () => {
      cy.get(`[data-testid="${platform}"]`).click();
      cy.wait(`@${platform.toLowerCase()}`);
      cy.url().should('contain', child.id);
    });
  });
});
