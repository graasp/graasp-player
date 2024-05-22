import {
  PackedFolderItemFactory,
  PackedShortcutItemFactory,
} from '@graasp/sdk';

import 'cypress-iframe';
import { v4 } from 'uuid';

import { buildContentPagePath } from '@/config/paths';
import { BACK_TO_SHORTCUT_ID, buildFolderButtonId } from '@/config/selectors';

describe('Shortcuts', () => {
  it('Come back from shortcut navigation', () => {
    const parentItem = PackedFolderItemFactory({ name: 'parent item' });
    const toShortcut = PackedFolderItemFactory({ name: 'target folder' });
    const shortcut = PackedShortcutItemFactory({
      name: 'shortcut',
      parentItem,
      settings: {},
      extra: { shortcut: { target: toShortcut.id } },
    });
    cy.setUpApi({ items: [parentItem, shortcut, toShortcut] });

    cy.visit(
      buildContentPagePath({ rootId: parentItem.id, itemId: parentItem.id }),
    );

    // click on folder shortcut
    cy.get(`#${buildFolderButtonId(toShortcut.id)}`).click();
    cy.url().should('contain', parentItem.id).should('contain', 'from');

    // go back to origin
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).click();
    cy.url().should('contain', parentItem.id);
  });

  it('No from name does not show button', () => {
    const parentItem = PackedFolderItemFactory({ name: 'parent item' });
    cy.setUpApi({ items: [parentItem] });

    cy.visit(
      `${buildContentPagePath({
        rootId: parentItem.id,
        itemId: parentItem.id,
      })}?from=/${v4()}`,
    );

    // need wait for wrongly shown button to appear
    cy.wait(1000);

    // should not show from button
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).should('not.exist');
  });

  it('Hacking query params is safe', () => {
    const parentItem = PackedFolderItemFactory({ name: 'parent item' });
    cy.setUpApi({ items: [parentItem] });

    cy.visit(
      `${buildContentPagePath({
        rootId: parentItem.id,
        itemId: parentItem.id,
      })}?from=/idid&fromName=shouldnotdisplay`,
    );

    // need wait for wrongly shown button to appear
    cy.wait(1000);

    // should not show from button
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).should('not.exist');
  });

  it.only('Hacking from url with external url is safe', () => {
    const parentItem = PackedFolderItemFactory({ name: 'parent item' });
    cy.setUpApi({ items: [parentItem] });

    cy.visit(
      `${buildContentPagePath({
        rootId: parentItem.id,
        itemId: parentItem.id,
      })}?from=http://example.org&fromName=shouldnotdisplay`,
    );

    // need wait for wrongly shown button to appear
    cy.wait(1000);

    // should not show from button
    cy.get(`#${BACK_TO_SHORTCUT_ID}`).should('not.exist');
  });
});
