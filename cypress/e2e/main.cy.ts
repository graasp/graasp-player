import { buildMainPath } from '../../src/config/paths';
import {
  FOLDER_NAME_TITLE_CLASS,
  MAIN_MENU_ID
} from '../../src/config/selectors';
import { GRAASP_APP_ITEM } from '../fixtures/apps';
import { GRAASP_DOCUMENT_ITEM } from '../fixtures/documents';
import {
  IMAGE_ITEM_DEFAULT,
  PDF_ITEM_DEFAULT,
  VIDEO_ITEM_DEFAULT
} from '../fixtures/files';
import { FOLDER_WITH_SUBFOLDER_ITEM } from '../fixtures/items';
import { GRAASP_LINK_ITEM, YOUTUBE_LINK_ITEM } from '../fixtures/links';
import { MEMBERS } from '../fixtures/members';
import {
  PUBLIC_STATIC_ELECTRICITY,
  STATIC_ELECTRICITY
} from '../fixtures/useCases/staticElectricity';
import {
  expectAppViewScreenLayout,
  expectDocumentViewScreenLayout,
  expectFileViewScreenLayout,
  expectFolderButtonLayout,
  expectFolderLayout,
  expectLinkViewScreenLayout
} from '../support/integrationUtils';

describe('Main Screen', () => {
  describe('Individual Items', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [
          GRAASP_LINK_ITEM,
          YOUTUBE_LINK_ITEM,
          IMAGE_ITEM_DEFAULT,
          VIDEO_ITEM_DEFAULT,
          PDF_ITEM_DEFAULT,
          GRAASP_DOCUMENT_ITEM,
          GRAASP_APP_ITEM,
          ...FOLDER_WITH_SUBFOLDER_ITEM.items,
        ],
      });
    });

    describe('Links', () => {
      it('Website link', () => {
        const { id } = GRAASP_LINK_ITEM;
        cy.visit(buildMainPath({ rootId: id }));

        expectLinkViewScreenLayout(GRAASP_LINK_ITEM);
      });
      it('Youtube link', () => {
        const { id } = YOUTUBE_LINK_ITEM;
        cy.visit(buildMainPath({ rootId: id }));

        expectLinkViewScreenLayout(YOUTUBE_LINK_ITEM);
      });
    });

    describe('Files', () => {
      it('Image', () => {
        const { id } = IMAGE_ITEM_DEFAULT;
        cy.visit(buildMainPath({ rootId: id }));

        expectFileViewScreenLayout(IMAGE_ITEM_DEFAULT);
      });
      it('Video', () => {
        const { id } = VIDEO_ITEM_DEFAULT;
        cy.visit(buildMainPath({ rootId: id }));

        expectFileViewScreenLayout(VIDEO_ITEM_DEFAULT);
      });
      it('Pdf', () => {
        const { id } = PDF_ITEM_DEFAULT;
        cy.visit(buildMainPath({ rootId: id }));

        expectFileViewScreenLayout(PDF_ITEM_DEFAULT);
      });
    });

    describe('Documents', () => {
      it('Graasp Document', () => {
        cy.visit(buildMainPath({ rootId: GRAASP_DOCUMENT_ITEM.id }));

        expectDocumentViewScreenLayout(GRAASP_DOCUMENT_ITEM);
      });
    });

    describe('Apps', () => {
      it('App', () => {
        cy.visit(buildMainPath({ rootId: GRAASP_APP_ITEM.id }));

        expectAppViewScreenLayout(GRAASP_APP_ITEM);
      });
    });

    describe('Folders', () => {
      it('Display sub Folder', () => {
        const parent = FOLDER_WITH_SUBFOLDER_ITEM.items[0];
        cy.visit(buildMainPath({ rootId: parent.id }));

        cy.get(`.${FOLDER_NAME_TITLE_CLASS}`).should('contain', parent.name);

        expectFolderButtonLayout(FOLDER_WITH_SUBFOLDER_ITEM.items[1]);
      });
    });
  });

  describe('Use cases', () => {
    it(`Display ${STATIC_ELECTRICITY.items[0].name}`, () => {
      cy.setUpApi(STATIC_ELECTRICITY);
      const parentFolder = STATIC_ELECTRICITY.items[0];
      const rootId = parentFolder.id;
      cy.visit(buildMainPath({ rootId }));

      expectFolderLayout({ rootId, items: STATIC_ELECTRICITY.items });
    });
    it(`Cannot display ${STATIC_ELECTRICITY.items[0].name} if does not have membership`, () => {
      cy.setUpApi({
        items: STATIC_ELECTRICITY.items,
        currentMember: MEMBERS.BOB,
      });
      const parentFolder = STATIC_ELECTRICITY.items[0];
      const rootId = parentFolder.id;
      cy.visit(buildMainPath({ rootId }));
      cy.get(`#${MAIN_MENU_ID}`).should('not.exist');
    });
    it(`Display ${PUBLIC_STATIC_ELECTRICITY.items[0].name}`, () => {
      cy.setUpApi({ ...PUBLIC_STATIC_ELECTRICITY, currentMember: MEMBERS.BOB });
      const parentFolder = PUBLIC_STATIC_ELECTRICITY.items[0];
      const rootId = parentFolder.id;
      cy.visit(buildMainPath({ rootId }));

      expectFolderLayout({ rootId, items: PUBLIC_STATIC_ELECTRICITY.items });
    });
  });

  describe('Write access', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [GRAASP_DOCUMENT_ITEM, ...FOLDER_WITH_SUBFOLDER_ITEM.items],
      });
    });
    // todo: check that the builder can be accessed using the navigation
  });
});
