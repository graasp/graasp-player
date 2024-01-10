import { PermissionLevel } from '@graasp/sdk';

import { buildMainPath } from '@/config/paths';
import { SHOW_MORE_ITEMS_ID, buildTreeItemClass } from '@/config/selectors';

import {
  FOLDER_WITH_SUBFOLDER_ITEM,
  generateLotsOfFoldersOnHome,
} from '../fixtures/items';
import { MEMBERS } from '../fixtures/members';

const items = generateLotsOfFoldersOnHome({ folderCount: 20 });
const sharedItems = generateLotsOfFoldersOnHome({
  folderCount: 11,
  creator: MEMBERS.BOB,
  memberships: [
    { memberId: MEMBERS.ANNA.id, permission: PermissionLevel.Read },
  ],
});

describe('Navigation', () => {
  it('Show navigation on Home', () => {
    cy.setUpApi({
      items: [...items, ...sharedItems],
    });
    cy.visit('/');

    cy.wait(['@getCurrentMember', '@getAccessibleItems']);

    cy.get(`#${SHOW_MORE_ITEMS_ID}`).click();
  });

  it('Expand folder when navigating', () => {
    cy.setUpApi({ items: FOLDER_WITH_SUBFOLDER_ITEM.items });
    const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[0];
    cy.visit(buildMainPath({ rootId: parent.id }));

    const child = FOLDER_WITH_SUBFOLDER_ITEM.items[1];
    const childOfChild = FOLDER_WITH_SUBFOLDER_ITEM.items[3];
    cy.get(`.${buildTreeItemClass(child.id)}`).click();
    cy.get(`.${buildTreeItemClass(childOfChild.id)}`);
  });
});
