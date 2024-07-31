import { FolderItemFactory, ItemLoginSchemaType } from '@graasp/sdk';

import { buildContentPagePath } from '@/config/paths';

describe('Pseudonimized access', () => {
  it('Logged out', () => {
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
  });

  it('Signed in', () => {
    const rootItem = FolderItemFactory({ name: 'pseudo' });
    const items = [rootItem];
    cy.setUpApi({
      items,
      itemLogins: { [rootItem.id]: `${ItemLoginSchemaType.Username}` },
    });

    cy.visit(
      buildContentPagePath({ rootId: rootItem.id, itemId: rootItem.id }),
    );
  });
});
