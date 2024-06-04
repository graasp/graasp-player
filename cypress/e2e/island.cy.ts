import { PackedFolderItemFactory } from '@graasp/sdk';

import { buildContentPagePath } from '@/config/paths';
import {
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_MAP_BUTTON_ID,
  buildTreeItemClass,
} from '@/config/selectors';

import {
  DOCUMENT_WITHOUT_CHAT_BOX,
  DOCUMENT_WITH_CHAT_BOX,
} from '../fixtures/items';

describe('Island', () => {
  it('Show island with chat button on document with chat', () => {
    const item = DOCUMENT_WITH_CHAT_BOX;
    cy.setUpApi({
      items: [item],
    });
    cy.visit(buildContentPagePath({ rootId: item.id, itemId: item.id }));
    cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).should('be.visible');
  });

  it('Hide island on document without chat', () => {
    const item = DOCUMENT_WITHOUT_CHAT_BOX;
    cy.setUpApi({
      items: [item],
    });
    cy.visit(buildContentPagePath({ rootId: item.id, itemId: item.id }));
    cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).should('not.exist');
  });

  describe('map', () => {
    it('Do not show button for no geolocation', () => {
      const parentItem = PackedFolderItemFactory({ settings: {} });
      cy.setUpApi({
        items: [parentItem],
      });
      cy.visit(
        buildContentPagePath({ rootId: parentItem.id, itemId: parentItem.id }),
      );
      cy.get(`#${ITEM_MAP_BUTTON_ID} button`).should('not.exist');
    });

    // temporarily disable
    it.skip('Show map button for parent geolocation', () => {
      const parentItem = PackedFolderItemFactory({ settings: {} });
      const child = PackedFolderItemFactory({ parentItem, settings: {} });
      const geolocation = { lat: 0, lng: 0, item: parentItem };
      cy.setUpApi({
        items: [{ ...parentItem, geolocation }, child],
      });
      cy.visit(
        buildContentPagePath({ rootId: parentItem.id, itemId: parentItem.id }),
      );
      cy.get(`#${ITEM_MAP_BUTTON_ID} button`)
        .should('be.visible')
        .should('not.be.disabled');
      // check is parent link
      cy.get(`#${ITEM_MAP_BUTTON_ID}`)
        .parent()
        .should('have.attr', 'href')
        .should('include', parentItem.id)
        .should('include', 'mode=map');

      cy.get(`.${buildTreeItemClass(child.id)}:visible`).click();
      cy.get(`#${ITEM_MAP_BUTTON_ID} button`)
        .should('be.visible')
        .should('not.be.disabled');
      // check is parent link
      cy.get(`#${ITEM_MAP_BUTTON_ID}`)
        .parent()
        .should('have.attr', 'href')
        .should('include', parentItem.id)
        .should('include', 'mode=map');
    });

    // temporarily disable
    it.skip('Show map button for child geolocation', () => {
      const parentItem = PackedFolderItemFactory({ settings: {} });
      const child1 = PackedFolderItemFactory({ parentItem, settings: {} });
      const child2 = PackedFolderItemFactory({ parentItem, settings: {} });
      const geolocation = { lat: 0, lng: 0, item: child1 };
      cy.setUpApi({
        items: [parentItem, { ...child1, geolocation }, child2],
      });
      cy.visit(
        buildContentPagePath({ rootId: parentItem.id, itemId: parentItem.id }),
      );
      cy.get(`#${ITEM_MAP_BUTTON_ID} button`)
        .should('be.visible')
        .should('be.disabled');

      cy.get(`.${buildTreeItemClass(child1.id)}:visible`).click();

      cy.get(`#${ITEM_MAP_BUTTON_ID} button`)
        .should('be.visible')
        .should('not.be.disabled');
      // check is parent link
      cy.get(`#${ITEM_MAP_BUTTON_ID}`)
        .parent()
        .should('have.attr', 'href')
        .should('include', child1.id)
        .should('include', 'mode=map');

      cy.get(`.${buildTreeItemClass(child2.id)}:visible`).click();

      cy.get(`#${ITEM_MAP_BUTTON_ID} button`)
        .should('be.visible')
        .should('be.disabled');
    });
  });
});
