import {
  AppItemType,
  DiscriminatedItem,
  DocumentItemType,
  EmbeddedLinkItemType,
  ItemType,
  LocalFileItemType,
  MimeTypes,
  S3FileItemType,
  getDocumentExtra,
  getEmbeddedLinkExtra,
  getFileExtra,
  getParentFromPath,
  getS3FileExtra,
} from '@graasp/sdk';
import { DEFAULT_LINK_SHOW_BUTTON } from '@graasp/ui';

import qs from 'qs';

import {
  MAIN_MENU_ID,
  buildAppId,
  buildDocumentId,
  buildFileId,
  buildTreeItemClass,
} from '../../src/config/selectors';
import { LOAD_FOLDER_CONTENT_PAUSE } from './constants';

export const expectLinkViewScreenLayout = ({
  id,
  extra,
  settings,
}: EmbeddedLinkItemType): void => {
  const { url, html } = getEmbeddedLinkExtra(extra) || {};

  // embedded element
  if (html) {
    cy.get(`#${id}`).then((element) => {
      // transform innerhtml content to match provided html
      const parsedHtml = element.html().replaceAll('=""', '');
      expect(parsedHtml).to.contain(html);
    });
  } else if (settings?.showLinkIframe) {
    cy.get(`iframe#${id}`).should('have.attr', 'src', url);
  }

  if (!html) {
    if (settings?.showLinkButton ?? DEFAULT_LINK_SHOW_BUTTON) {
      cy.get('[data-testid="OpenInNewIcon"]').should('be.visible');
    } else {
      // button should not be shown when the setting is false
      cy.get('[data-testid="OpenInNewIcon"]').should('not.exist');
    }
  }
};

export const expectAppViewScreenLayout = ({ id, extra }: AppItemType): void => {
  const { url } = extra.app;

  const appUrl = `${url}${qs.stringify(
    { itemId: id },
    {
      addQueryPrefix: true,
    },
  )}`;

  cy.get(`iframe#${buildAppId(id)}`).should('have.attr', 'src', appUrl);
};

export const expectFileViewScreenLayout = ({
  id,
  type,
  extra,
}: LocalFileItemType | S3FileItemType): void => {
  let mimetype = '';
  switch (type) {
    case ItemType.LOCAL_FILE:
      mimetype = getFileExtra(extra)?.mimetype || '';
      break;
    case ItemType.S3_FILE:
      mimetype = getS3FileExtra(extra)?.mimetype || '';
      break;
    default:
  }
  // embedded element
  let selector = '';
  if (MimeTypes.isImage(mimetype)) {
    selector = `img#${buildFileId(id)}`;
  } else if (MimeTypes.isVideo(mimetype)) {
    selector = `video#${buildFileId(id)}`;
  } else if (MimeTypes.isPdf(mimetype)) {
    selector = `embed#${buildFileId(id)}`;
  }
  cy.get(selector).should('exist');
};

export const expectDocumentViewScreenLayout = ({
  id,
  extra,
}: DocumentItemType): void => {
  cy.get(`#${buildDocumentId(id)}`).then((editor) => {
    expect(editor.html()).to.contain(getDocumentExtra(extra)?.content);
  });
};

export const expectFolderButtonLayout = ({ name }: { name: string }): void => {
  // mainmenu
  const menu = cy.get(`#${MAIN_MENU_ID}`);
  menu.get(`#${MAIN_MENU_ID}`).contains(name);
};

export const expectFolderLayout = ({
  rootId,
  items,
}: {
  rootId: string;
  items: DiscriminatedItem[];
}): void => {
  const children = items.filter(
    (item) => getParentFromPath(item.path) === rootId,
  );

  children.forEach((item) => {
    switch (item.type) {
      case ItemType.FOLDER:
        expectFolderButtonLayout(item);
        break;
      case ItemType.S3_FILE:
      case ItemType.LOCAL_FILE:
        expectFileViewScreenLayout(item);
        break;
      case ItemType.LINK:
        expectLinkViewScreenLayout(item);
        break;
      case ItemType.DOCUMENT:
        expectDocumentViewScreenLayout(item);
        break;
      case ItemType.APP:
        expectAppViewScreenLayout(item);
        break;
      default:
        throw new Error(`No defined case for item of type ${item.type}`);
    }
  });

  children
    .filter(({ type }) => type === ItemType.FOLDER)
    .forEach(({ id }) => {
      // click in mainmenu
      cy.get(`.${buildTreeItemClass(id)}`).click();
      cy.wait(LOAD_FOLDER_CONTENT_PAUSE);

      expectFolderLayout({ rootId: id, items });
    });
};
