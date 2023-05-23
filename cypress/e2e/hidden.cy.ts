import { buildMainPath } from '../../src/config/paths';
import {
  buildDocumentId,
  buildHiddenWrapperId,
} from '../../src/config/selectors';
import {
  FOLDER_WITH_HIDDEN_ITEMS,
  PUBLIC_FOLDER_WITH_HIDDEN_ITEMS,
} from '../fixtures/items';
import { MEMBERS } from '../fixtures/members';

describe('Hidden Items', () => {
  it('Display Hidden items with hidden wrapper', () => {
    cy.setUpApi({
      items: FOLDER_WITH_HIDDEN_ITEMS.items,
    });

    const parent = FOLDER_WITH_HIDDEN_ITEMS.items[0];
    cy.visit(buildMainPath({ rootId: parent.id }));

    cy.wait(['@getCurrentMember', '@getItem', '@getItemTags']);
    cy.get(`#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[1].id)}`).should(
      'exist',
    );
    // hidden item should have wrapper
    cy.get(
      `#${buildHiddenWrapperId(FOLDER_WITH_HIDDEN_ITEMS.items[2].id, true)}`,
    );
    // hidden elements should not be shown in the navigation
    cy.get(
      `#${buildHiddenWrapperId(FOLDER_WITH_HIDDEN_ITEMS.items[3].id, true)}`,
    );
  });

  it("Don't display Hidden items when viewing as reader", () => {
    cy.setUpApi({
      currentMember: MEMBERS.BOB,
      items: FOLDER_WITH_HIDDEN_ITEMS.items,
    });

    const parent = FOLDER_WITH_HIDDEN_ITEMS.items[0];
    cy.visit(buildMainPath({ rootId: parent.id }));

    cy.get(
      `#${buildHiddenWrapperId(FOLDER_WITH_HIDDEN_ITEMS.items[1].id, false)}`,
    ).should('exist');

    // hidden document should not be displayed when in public
    cy.get(`#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[2].id)}`).should(
      'not.exist',
    );
    cy.get(
      `#${buildHiddenWrapperId(FOLDER_WITH_HIDDEN_ITEMS.items[2].id, true)}`,
    ).should('not.exist');
  });

  it("Don't display Hidden items when viewing as public", () => {
    cy.setUpApi({
      currentMember: MEMBERS.CEDRIC,
      items: PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items,
    });

    const parent = PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[0];
    cy.visit(buildMainPath({ rootId: parent.id }));

    cy.get(
      `#${buildHiddenWrapperId(
        PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[1].id,
        false,
      )}`,
    ).should('exist');

    // hidden document should not be displayed when in public
    cy.get(
      `#${buildDocumentId(PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[2].id)}`,
    ).should('not.exist');
    cy.get(
      `#${buildHiddenWrapperId(
        PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[2].id,
        true,
      )}`,
    ).should('not.exist');
  });
});
