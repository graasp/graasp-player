import { buildMainPath } from '../../src/config/paths';
import {
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_CHATBOX_ID,
  PANEL_CLOSE_BUTTON_SELECTOR,
} from '../../src/config/selectors';
import { LOAD_CHATBOX_PAUSE } from '../fixtures/constants';
import { GRAASP_DOCUMENT_ITEM_WITH_CHAT_BOX } from '../fixtures/documents';
import { ITEM_WITHOUT_CHAT_BOX, ITEM_WITH_CHAT_BOX } from '../fixtures/items';
import { expectDocumentViewScreenLayout } from '../support/integrationUtils';

describe('Chatbox', () => {
  beforeEach(() => {
    cy.setUpApi({
      items: [
        ITEM_WITH_CHAT_BOX,
        ITEM_WITHOUT_CHAT_BOX,
        GRAASP_DOCUMENT_ITEM_WITH_CHAT_BOX,
      ],
    });
  });

  it('Chatbox button should toggle chatbox visibility', () => {
    cy.visit(buildMainPath({ rootId: ITEM_WITH_CHAT_BOX.id, id: null }));

    cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).should('exist');
    cy.get(`#${ITEM_CHATBOX_ID}`).should('not.exist');

    cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).click();

    cy.wait(LOAD_CHATBOX_PAUSE);

    cy.get(`#${ITEM_CHATBOX_ID}`).should('be.visible');
  });

  it('Side panel button should hide chatbox', () => {
    cy.visit(buildMainPath({ rootId: ITEM_WITH_CHAT_BOX.id, id: null }));

    cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).should('exist');
    cy.get(`#${ITEM_CHATBOX_ID}`).should('not.be.exist');

    cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).click();

    cy.wait(LOAD_CHATBOX_PAUSE);
    cy.get(`#${ITEM_CHATBOX_ID}`).should('be.visible');

    cy.get(PANEL_CLOSE_BUTTON_SELECTOR).click();
    cy.get(`#${ITEM_CHATBOX_ID}`).should('not.be.visible');
  });

  it('Disabled chatbox should not have button', () => {
    cy.visit(buildMainPath({ rootId: ITEM_WITHOUT_CHAT_BOX.id, id: null }));

    cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).should('not.exist');
    cy.get(`#${ITEM_CHATBOX_ID}`).should('not.exist');
  });

  it('Chatbox button is clickable on document', () => {
    cy.visit(
      buildMainPath({
        rootId: GRAASP_DOCUMENT_ITEM_WITH_CHAT_BOX.id,
        id: null,
      }),
    );
    expectDocumentViewScreenLayout(GRAASP_DOCUMENT_ITEM_WITH_CHAT_BOX);
    cy.get(`#${ITEM_CHATBOX_BUTTON_ID}`).should('be.visible').click();
  });
});
