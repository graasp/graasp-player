import {
  FolderItemFactory,
  LinkItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { buildContentPagePath, buildMainPath } from '@/config/paths';
import {
  HOME_PAGE_PAGINATION_ID,
  TREE_VIEW_ID,
  buildHomePaginationId,
  buildTreeItemClass,
} from '@/config/selectors';

import {
  FOLDER_WITH_SUBFOLDER_ITEM,
  FOLDER_WITH_SUBFOLDER_ITEM_AND_PARTIAL_ORDER,
  generateLotsOfFoldersOnHome,
} from '../fixtures/items';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';

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
    cy.get(`#${HOME_PAGE_PAGINATION_ID}`).scrollIntoView().should('be.visible');
    cy.get(`#${buildHomePaginationId(2)}`).click();
  });

  it('Expand folder when navigating', () => {
    cy.setUpApi({ items: FOLDER_WITH_SUBFOLDER_ITEM.items });
    const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[0];
    cy.visit(buildMainPath({ rootId: parent.id }));

    const child = FOLDER_WITH_SUBFOLDER_ITEM.items[1];
    const childOfChild = FOLDER_WITH_SUBFOLDER_ITEM.items[3];
    // we need to to use the `:visible` meta selector because there are 2 navigations (one for mobile hidden, and one for desktop)
    cy.get(`.${buildTreeItemClass(child.id)}:visible`).click();
    cy.get(`.${buildTreeItemClass(childOfChild.id)}:visible`).should(
      'be.visible',
    );
  });

  it('Show all folders for partial order', () => {
    cy.setUpApi({ items: FOLDER_WITH_SUBFOLDER_ITEM_AND_PARTIAL_ORDER.items });
    const parent = FOLDER_WITH_SUBFOLDER_ITEM_AND_PARTIAL_ORDER.items[0];
    cy.visit(buildMainPath({ rootId: parent.id }));

    const child = FOLDER_WITH_SUBFOLDER_ITEM_AND_PARTIAL_ORDER.items[1];
    const child1 = FOLDER_WITH_SUBFOLDER_ITEM_AND_PARTIAL_ORDER.items[2];
    cy.get(`.${buildTreeItemClass(child.id)}`).should('be.visible');
    cy.get(`.${buildTreeItemClass(child1.id)}`).should('be.visible');
  });

  it('Navigate successfully when opening child as root', () => {
    cy.setUpApi({ items: FOLDER_WITH_SUBFOLDER_ITEM.items });
    const child = FOLDER_WITH_SUBFOLDER_ITEM.items[1];
    cy.visit(buildMainPath({ rootId: child.id }));

    const childOfChild = FOLDER_WITH_SUBFOLDER_ITEM.items[3];
    // we need to to use the `:visible` meta selector because there are 2 navigations (one for mobile hidden, and one for desktop)
    cy.get(`.${buildTreeItemClass(child.id)}:visible`).click();
    cy.get(`.${buildTreeItemClass(childOfChild.id)}:visible`).should(
      'be.visible',
    );
  });
});

describe('Internal navigation', () => {
  it('Open a /:rootId link works', () => {
    const firstCourse = FolderItemFactory({
      name: 'Parent',
      creator: CURRENT_USER,
    });
    const target = FolderItemFactory({ name: 'Target', creator: CURRENT_USER });
    const url = new URL(target.id, window.location.origin).toString();
    const link = LinkItemFactory({
      name: 'Link to target',
      extra: {
        embeddedLink: {
          url,
        },
      },
      settings: { isCollapsible: false },
      parentItem: firstCourse,
      creator: CURRENT_USER,
    });
    cy.setUpApi({
      items: [target, firstCourse, link],
    });
    cy.visit(
      buildContentPagePath({ rootId: firstCourse.id, itemId: firstCourse.id }),
    );
    cy.get('h2').should('contain', firstCourse.name);
    cy.get(`#${link.id}`).click();

    cy.url().should('contain', url);

    cy.get('h2').should('contain', target.name);

    cy.get(`#${TREE_VIEW_ID}`).should('contain', target.name);
  });
});
