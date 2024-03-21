import { buildContentPagePath } from '../../src/config/paths';
import { buildDocumentId } from '../../src/config/selectors';
import {
  FOLDER_WITH_HIDDEN_ITEMS,
  PUBLIC_FOLDER_WITH_HIDDEN_ITEMS,
} from '../fixtures/items';
import { MEMBERS } from '../fixtures/members';

describe('Hidden Items', () => {
  it("Don't display Hidden items when viewing as admin", () => {
    cy.setUpApi({
      items: FOLDER_WITH_HIDDEN_ITEMS.items,
    });

    const parent = FOLDER_WITH_HIDDEN_ITEMS.items[0];
    cy.visit(buildContentPagePath({ rootId: parent.id, itemId: parent.id }));

    // hidden document should not be displayed
    cy.get(`#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[1].id)}`).should(
      'be.visible',
    );
    cy.get(`#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[2].id)}`).should(
      'not.exist',
    );
  });

  it("Don't display Hidden items when viewing as writer", () => {
    cy.setUpApi({
      currentMember: MEMBERS.CEDRIC,
      items: FOLDER_WITH_HIDDEN_ITEMS.items,
    });

    const parent = FOLDER_WITH_HIDDEN_ITEMS.items[0];
    cy.visit(buildContentPagePath({ rootId: parent.id, itemId: parent.id }));

    cy.get(`#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[1].id)}`).should(
      'be.visible',
    );
    // hidden document should not be displayed
    cy.get(`#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[2].id)}`).should(
      'not.exist',
    );
  });

  it("Don't display Hidden items when viewing as reader", () => {
    cy.setUpApi({
      currentMember: MEMBERS.BOB,
      items: FOLDER_WITH_HIDDEN_ITEMS.items,
    });

    const parent = FOLDER_WITH_HIDDEN_ITEMS.items[0];
    cy.visit(buildContentPagePath({ rootId: parent.id, itemId: parent.id }));

    cy.get(`#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[1].id)}`).should(
      'be.visible',
    );
    // hidden document should not be displayed
    cy.get(`#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[2].id)}`).should(
      'not.exist',
    );
  });

  it("Don't display Hidden items when viewing as public", () => {
    cy.setUpApi({
      currentMember: MEMBERS.CEDRIC,
      items: PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items,
    });

    const parent = PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[0];
    cy.visit(buildContentPagePath({ rootId: parent.id, itemId: parent.id }));

    cy.get(
      `#${buildDocumentId(PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[1].id)}`,
    ).should('be.visible');
    // hidden document should not be displayed
    cy.get(
      `#${buildDocumentId(PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[2].id)}`,
    ).should('not.exist');
  });
});
