import { FolderItemFactory, ItemLoginSchemaType } from '@graasp/sdk';

import { buildContentPagePath } from '@/config/paths';
import {
  ENROLL_BUTTON_SELECTOR,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_USERNAME_INPUT_ID,
  buildDataCyWrapper,
} from '@/config/selectors';
import { ID_FORMAT } from '@/utils/item';

import { API_HOST } from '../support/env';
import { DEFAULT_POST } from '../support/utils';

describe('Pseudonimized access', () => {
  it('Logged out', () => {
    cy.intercept({
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login$`),
    }).as('itemLoginSignIn');

    const rootItem = FolderItemFactory({ name: 'pseudo' });
    const items = [rootItem];
    cy.setUpApi({
      currentMember: null,
      items,
      itemLogins: { [rootItem.id]: `${ItemLoginSchemaType.Username}` },
    });

    cy.visit(
      buildContentPagePath({ rootId: rootItem.id, itemId: rootItem.id }),
    );

    // login
    cy.get(`#${ITEM_LOGIN_USERNAME_INPUT_ID}`).type('pseudo');
    cy.get(`#${ITEM_LOGIN_SIGN_IN_BUTTON_ID}`).click();

    cy.wait('@itemLoginSignIn').then(({ request }) => {
      expect(request.body.username).to.eq('pseudo');
    });
  });

  it('Enroll', () => {
    cy.intercept({
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/enroll$`),
    }).as('enroll');

    const rootItem = FolderItemFactory({ name: 'pseudo' });
    const items = [rootItem];
    cy.setUpApi({
      items,
      itemLogins: { [rootItem.id]: `${ItemLoginSchemaType.Username}` },
    });

    cy.visit(
      buildContentPagePath({ rootId: rootItem.id, itemId: rootItem.id }),
    );

    cy.get(buildDataCyWrapper(ENROLL_BUTTON_SELECTOR)).click();

    cy.wait('@enroll');
  });
});
