import { buildContentPagePath } from '@/config/paths';
import { ITEM_CHATBOX_BUTTON_ID } from '@/config/selectors';

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
});
