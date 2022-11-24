import { WebSocket } from '@graasp/websockets/test/mock-client';
import { buildMainPath } from '../../src/config/paths';
import {
  buildFolderButtonId,
  FOLDER_NAME_TITLE_CLASS,
} from '../../src/config/selectors';
import { FOLDER_WITH_SUBFOLDER_ITEM } from '../fixtures/items';
import { expectFolderButtonLayout } from '../support/integrationUtils';

function beforeWs(visitRoute, wsClientStub) {
  cy.setCookie('session', 'somecookie');
  cy.visit(visitRoute, {
    onBeforeLoad: (win) => {
      cy.stub(win, 'WebSocket', () => wsClientStub);
    },
  });
}

describe('Websocket interactions', () => {
  let client;
  const { items } = FOLDER_WITH_SUBFOLDER_ITEM;
  const newChild = {
    ...FOLDER_WITH_SUBFOLDER_ITEM.items[1],
    id: 'deadbeef-aaaa-bbbb-cccc-0242ac130002',
    name: 'newChild',
  };

  beforeEach(() => {
    client = new WebSocket();
    cy.setUpApi(FOLDER_WITH_SUBFOLDER_ITEM);
  });

  it('Displays create child update', () => {
    const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[0];
    beforeWs(buildMainPath({ rootId: parent.id, id: null }), client);

    cy.get(`.${FOLDER_NAME_TITLE_CLASS}`)
      .should('contain', parent.name)
      .then(() => {
        expectFolderButtonLayout(FOLDER_WITH_SUBFOLDER_ITEM.items[1]);

        // also add to mock data to avoid error while refetching
        items.push(newChild);
        // receive create update for subfolder
        client.receive({
          realm: 'notif',
          type: 'update',
          topic: 'item',
          channel: parent.id,
          body: {
            kind: 'child',
            op: 'create',
            item: newChild,
          },
        });

        expectFolderButtonLayout(newChild);
      });
  });

  it('Displays remove child update', () => {
    const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[0];
    beforeWs(buildMainPath({ rootId: parent.id, id: null }), client);

    // button should exist
    cy.get(`#${buildFolderButtonId(newChild.id)}`)
      .should('exist')
      .then(() => {
        expectFolderButtonLayout(FOLDER_WITH_SUBFOLDER_ITEM.items[1]);

        // receive remove update for subfolder
        client.receive({
          realm: 'notif',
          type: 'update',
          topic: 'item',
          channel: parent.id,
          body: {
            kind: 'child',
            op: 'delete',
            item: newChild,
          },
        });

        // button should be removed
        cy.get(`#${buildFolderButtonId(newChild.id)}`).should('not.exist');
      });
  });
});
