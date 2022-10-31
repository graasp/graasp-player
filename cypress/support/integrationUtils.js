import qs from 'qs';

import { DEFAULT_LINK_SHOW_BUTTON } from '../../src/config/constants';
import {
  MAIN_MENU_ID,
  buildAppId,
  buildDocumentId,
  buildFileId,
  buildTreeItemClass,
} from '../../src/config/selectors';
import { ITEM_TYPES, MIME_TYPES } from '../../src/enums';
import { getDirectParentId } from '../../src/utils/item';
import {
  getDocumentExtra,
  getEmbeddedLinkExtra,
  getFileExtra,
  getS3FileExtra,
} from '../../src/utils/itemExtra';
import { LOAD_FOLDER_CONTENT_PAUSE } from './constants';

export const expectLinkViewScreenLayout = ({ id, extra, settings }) => {
  const { url, html } = getEmbeddedLinkExtra(extra);

  // embedded element
  if (html) {
    cy.get(`#${id}`).then((element) => {
      // transform innerhtml content to match provided html
      const parsedHtml = element.html().replaceAll('=""', '');
      expect('eee').to.contain('eee');
      expect(parsedHtml).to.contain(html);
    });
  } else if (settings?.showLinkIframe) {
    cy.get(`iframe#${id}`).should('have.attr', 'src', url);
  }

  if (!html && (settings?.showLinkButton ?? DEFAULT_LINK_SHOW_BUTTON)) {
    cy.get('[data-testid="OpenInNewIcon"]').should('be.visible');
  }
};

export const expectAppViewScreenLayout = ({ id, extra }) => {
  const { url } = extra.app;

  const appUrl = `${url}${qs.stringify(
    { itemId: id },
    {
      addQueryPrefix: true,
    },
  )}`;

  cy.get(`iframe#${buildAppId(id)}`).should('have.attr', 'src', appUrl);
};

export const expectFileViewScreenLayout = ({ id, extra }) => {
  const mimetype =
    getFileExtra(extra)?.mimetype || getS3FileExtra(extra)?.mimetype;

  // embedded element
  let selector = null;
  if (MIME_TYPES.IMAGE.includes(mimetype)) {
    selector = `img#${buildFileId(id)}`;
  } else if (MIME_TYPES.VIDEO.includes(mimetype)) {
    selector = `video#${buildFileId(id)}`;
  } else if (MIME_TYPES.PDF.includes(mimetype)) {
    selector = `embed#${buildFileId(id)}`;
  }
  cy.get(selector).should('exist');
};

export const expectDocumentViewScreenLayout = ({ id, extra }) => {
  cy.get(`#${buildDocumentId(id)}`).then((editor) => {
    expect(editor.html()).to.contain(getDocumentExtra(extra)?.content);
  });
};

export const expectFolderButtonLayout = ({ name }) => {
  // mainmenu
  const menu = cy.get(`#${MAIN_MENU_ID}`);
  menu.get(`#${MAIN_MENU_ID}`).contains(name);
};

export const expectFolderLayout = ({ rootId, items }) => {
  const children = items.filter(
    (item) => getDirectParentId(item.path) === rootId,
  );

  children.forEach((item) => {
    switch (item.type) {
      case ITEM_TYPES.FOLDER:
        expectFolderButtonLayout(item);
        break;
      case ITEM_TYPES.S3_FILE:
      case ITEM_TYPES.FILE:
        expectFileViewScreenLayout(item);
        break;
      case ITEM_TYPES.LINK:
        expectLinkViewScreenLayout(item);
        break;
      case ITEM_TYPES.DOCUMENT:
        expectDocumentViewScreenLayout(item);
        break;
      case ITEM_TYPES.APP:
        expectAppViewScreenLayout(item);
        break;
      default:
        throw new Error(`No defined case for item of type ${item.type}`);
    }
  });

  children
    .filter(({ type }) => type === ITEM_TYPES.FOLDER)
    .forEach(({ id }) => {
      // click in mainmenu
      cy.get(`.${buildTreeItemClass(id)}`).click();
      cy.wait(LOAD_FOLDER_CONTENT_PAUSE);

      expectFolderLayout({ rootId: id, items });
    });
};
