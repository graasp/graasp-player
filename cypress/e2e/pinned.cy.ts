import { buildContentPagePath, buildMainPath } from '../../src/config/paths';
import {
  ITEM_PINNED_BUTTON_ID,
  ITEM_PINNED_ID,
  buildDocumentId,
  buildFolderButtonId,
} from '../../src/config/selectors';
import {
  FOLDER_WITH_PINNED_ITEMS,
  FOLDER_WITH_SUBFOLDER_ITEM,
  PINNED_AND_HIDDEN_ITEM,
  PUBLIC_FOLDER_WITH_PINNED_ITEMS,
} from '../fixtures/items';
import { MEMBERS } from '../fixtures/members';

describe('Pinned Items', () => {
  describe('Private', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [
          ...FOLDER_WITH_PINNED_ITEMS.items,
          ...FOLDER_WITH_SUBFOLDER_ITEM.items,
        ],
      });
    });

    it('Pinned button should toggle sidebar visibility', () => {
      const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[0];

      cy.visit(buildContentPagePath({ rootId: parent.id, itemId: parent.id }));

      cy.wait('@getChildren');
      cy.get(`#${ITEM_PINNED_BUTTON_ID}`).should('be.visible');
      cy.get(`#${ITEM_PINNED_ID}`).should('be.visible');

      cy.get(`#${ITEM_PINNED_BUTTON_ID}`).click();
      cy.get(`#${parent.id}`).should('not.exist');
    });

    it('Parent folder should display pinned children', () => {
      const parent = FOLDER_WITH_PINNED_ITEMS.items[0];
      const pinned = FOLDER_WITH_PINNED_ITEMS.items[2];
      cy.visit(buildContentPagePath({ rootId: parent.id, itemId: parent.id }));

      cy.get(`#${ITEM_PINNED_ID} #${buildFolderButtonId(pinned.id)}`).should(
        'contain',
        pinned.name,
      );
    });

    it('Children should display pinned siblings', () => {
      const parent = FOLDER_WITH_PINNED_ITEMS.items[0];
      const pinned = FOLDER_WITH_PINNED_ITEMS.items[2];
      cy.visit(buildMainPath({ rootId: parent.id }));

      cy.wait('@getChildren');
      cy.get(`#${ITEM_PINNED_ID} #${buildFolderButtonId(pinned.id)}`).should(
        'contain',
        pinned.name,
      );
    });

    it('If no items are pinned toggle pinned should not exist', () => {
      const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[2];
      cy.visit(buildMainPath({ rootId: parent.id }));

      cy.wait(['@getChildren']);
      cy.get(`#${ITEM_PINNED_BUTTON_ID}`).should('be.disabled');
      cy.get(`#${ITEM_PINNED_ID}`).should('not.exist');
    });
  });

  describe('Public', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: PUBLIC_FOLDER_WITH_PINNED_ITEMS.items,
        currentMember: MEMBERS.BOB,
      });
    });
    it('Public parent folder should display pinned children', () => {
      const parent = FOLDER_WITH_PINNED_ITEMS.items[0];
      const pinned = FOLDER_WITH_PINNED_ITEMS.items[2];
      cy.visit(buildMainPath({ rootId: parent.id }));

      cy.wait('@getChildren');
      cy.get(`#${ITEM_PINNED_ID} #${buildFolderButtonId(pinned.id)}`).should(
        'contain',
        pinned.name,
      );
    });
  });
});

describe('Pinned and hidden children', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: PINNED_AND_HIDDEN_ITEM.items,
    });
  });

  it('Should not open pinned drawer if only pinned item is also hidden', () => {
    const parent = PINNED_AND_HIDDEN_ITEM.items[0];
    const normalDocument = PINNED_AND_HIDDEN_ITEM.items[2];
    cy.visit(buildMainPath({ rootId: parent.id }));

    // check that the document is shown
    cy.get(`#${buildDocumentId(normalDocument.id)}`);
    // check that the pinned icon is not shown
    cy.get(`#${ITEM_PINNED_ID}`).should('not.exist');
  });
});
