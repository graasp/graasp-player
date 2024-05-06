import { buildContentPagePath } from '@/config/paths.ts';
import {
  FOLDER_NAME_TITLE_CLASS,
  TREE_NODE_GROUP_CLASS,
  buildTreeItemClass,
} from '@/config/selectors.ts';

import {
  ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS,
  FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS,
} from '../fixtures/items.ts';
import { MEMBERS } from '../fixtures/members.ts';
import { expectFolderLayout } from '../support/integrationUtils.ts';

describe('Shuffle', () => {
  describe('Anna', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [
          ...ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
          ...FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
        ],
      });
    });

    it('displays item with children in order', () => {
      const root = FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[0];
      cy.visit(buildContentPagePath({ rootId: root.id, itemId: root.id }));

      cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', root.name);

      expectFolderLayout({
        rootId: root.id,
        items: FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
      });

      cy.get(`.${buildTreeItemClass(root.id)}`)
        .siblings(`ul.${TREE_NODE_GROUP_CLASS}:first`)
        .children('li')
        .each(($li, index) => {
          // assert the text of each li matches the expected order
          cy.wrap($li).should(
            'have.text',
            FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[index + 1].name,
          );
        });
    });

    it('displays item with children shuffled', () => {
      const root = FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[0];
      cy.visit(
        buildContentPagePath({
          rootId: root.id,
          itemId: root.id,
          searchParams: 'shuffle=true',
        }),
      );

      cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', root.name);

      expectFolderLayout({
        rootId: root.id,
        items: FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
      });

      // shuffled order is always the same for a given member + item id
      const shuffledOrder = [2, 4, 5, 3, 1];

      cy.get(`.${buildTreeItemClass(root.id)}`)
        .siblings(`ul.${TREE_NODE_GROUP_CLASS}:first`)
        .children('li')
        .each(($li, index) => {
          // assert the text of each li matches the expected order
          cy.wrap($li).should(
            'have.text',
            FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[shuffledOrder[index]]
              .name,
          );
        });
    });

    it('displays item with children shuffled in the same order on a second visit', () => {
      const root = FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[0];
      cy.visit(
        buildContentPagePath({
          rootId: root.id,
          itemId: root.id,
          searchParams: 'shuffle=true',
        }),
      );

      cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', root.name);

      expectFolderLayout({
        rootId: root.id,
        items: FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
      });

      // shuffled order is always the same for a given member + item id
      const shuffledOrder = [2, 4, 5, 3, 1];

      cy.get(`.${buildTreeItemClass(root.id)}`)
        .siblings(`ul.${TREE_NODE_GROUP_CLASS}:first`)
        .children('li')
        .each(($li, index) => {
          // assert the text of each li matches the expected order
          cy.wrap($li).should(
            'have.text',
            FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[shuffledOrder[index]]
              .name,
          );
        });
    });

    it('displays item with children shuffled differently for same user but a different item', () => {
      const root = ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[0];
      cy.visit(
        buildContentPagePath({
          rootId: root.id,
          itemId: root.id,
          searchParams: 'shuffle=true',
        }),
      );

      cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', root.name);

      expectFolderLayout({
        rootId: root.id,
        items: ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
      });

      // shuffled order is always the same for a given member + item id
      // this is the value for the other item: [ 2, 4, 5, 3, 1 ]
      const shuffledOrder = [1, 4, 3, 2, 5];

      cy.get(`.${buildTreeItemClass(root.id)}`)
        .siblings(`ul.${TREE_NODE_GROUP_CLASS}:first`)
        .children('li')
        .each(($li, index) => {
          // assert the text of each li matches the expected order
          cy.wrap($li).should(
            'have.text',
            ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[
              shuffledOrder[index]
            ].name,
          );
        });
    });
  });

  describe('Bob', () => {
    beforeEach(() => {
      cy.setUpApi({
        currentMember: MEMBERS.BOB,
        items: [
          ...ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
          ...FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
        ],
      });
    });

    it('displays item with children shuffled differently for a different user', () => {
      const root = FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[0];
      cy.visit(
        buildContentPagePath({
          rootId: root.id,
          itemId: root.id,
          searchParams: 'shuffle=true',
        }),
      );

      cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', root.name);

      expectFolderLayout({
        rootId: root.id,
        items: FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
      });

      // shuffled order is always the same for a given member + item id
      // this is the value for Anna: [2, 4, 5, 3, 1]
      const shuffledOrder = [1, 5, 3, 4, 2];

      cy.get(`.${buildTreeItemClass(root.id)}`)
        .siblings(`ul.${TREE_NODE_GROUP_CLASS}:first`)
        .children('li')
        .each(($li, index) => {
          // assert the text of each li matches the expected order
          cy.wrap($li).should(
            'have.text',
            FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[shuffledOrder[index]]
              .name,
          );
        });
    });

    it('displays item with children shuffled differently for a different user and different item', () => {
      const root = ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[0];
      cy.visit(
        buildContentPagePath({
          rootId: root.id,
          itemId: root.id,
          searchParams: 'shuffle=true',
        }),
      );

      cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', root.name);

      expectFolderLayout({
        rootId: root.id,
        items: ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items,
      });

      // shuffled order is always the same for a given member + item id
      // this is the value for the other item: [1, 5, 3, 4, 2]
      // and this is the value for Anna for this item: [ 1, 4, 3, 2, 5 ]
      const shuffledOrder = [3, 4, 2, 1, 5];

      cy.get(`.${buildTreeItemClass(root.id)}`)
        .siblings(`ul.${TREE_NODE_GROUP_CLASS}:first`)
        .children('li')
        .each(($li, index) => {
          // assert the text of each li matches the expected order
          cy.wrap($li).should(
            'have.text',
            ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS.items[
              shuffledOrder[index]
            ].name,
          );
        });
    });
  });
});
