import { buildMainPath } from '../../src/config/paths';
import { FOLDER_WITH_HIDDEN_ITEMS } from '../fixtures/items';
import { buildDocumentId } from '../../src/config/selectors';

describe('Hidden Items', () => {
  it("Don't display Hidden items", () => {
    cy.setUpApi({
      items: FOLDER_WITH_HIDDEN_ITEMS.items,
    });

    const parent = FOLDER_WITH_HIDDEN_ITEMS.items[0];
    cy.visit(buildMainPath({ rootId: parent.id, id: null }));

    cy.get(
      `#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[1].id)}`,
    ).should('exist');
    cy.get(
      `#${buildDocumentId(FOLDER_WITH_HIDDEN_ITEMS.items[2].id)}`,
    ).should('not.exist');
  });

  // todo: uncomment when public tags are implemented
  // it("Don't display Hidden items for public items", () => {
  //   cy.setUpApi({
  //     ...PUBLIC_FOLDER_WITH_HIDDEN_ITEMS,
  //     currentMember: MEMBERS.BOB,
  //   });
  //   const parent = PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[0];
  //   cy.visit(buildMainPath({ rootId: parent.id, id: null }));

  //   cy.get(
  //     `#${buildFolderButtonId(PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[1].id)}`,
  //   ).should('exist');
  //   cy.get(
  //     `#${buildFolderButtonId(PUBLIC_FOLDER_WITH_HIDDEN_ITEMS.items[2].id)}`,
  //   ).should('not.exist');
  // });
});
