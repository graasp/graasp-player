import {
  AppItemType,
  DiscriminatedItem,
  DocumentItemType,
  ItemType,
  LinkItemType,
  LocalFileItemType,
  MimeTypes,
  S3FileItemType,
  appendQueryParamToUrl,
  getDocumentExtra,
  getFileExtra,
  getLinkExtra,
  getParentFromPath,
  getS3FileExtra,
} from '@graasp/sdk';
import { DEFAULT_LINK_SHOW_BUTTON } from '@graasp/ui';

import {
  MAIN_MENU_ID,
  buildAppId,
  buildDocumentId,
  buildFileId,
  buildLinkItemId,
  buildTreeItemClass,
} from '../../src/config/selectors';

export const expectLinkViewScreenLayout = ({
  id,
  extra,
  settings,
}: LinkItemType): void => {
  const { url, html } = getLinkExtra(extra) || {};

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
      cy.get(`#${buildLinkItemId(id)}`).scrollIntoView();
      if (settings?.isCollapsible) {
        cy.get(`#${buildLinkItemId(id)}`).click();
      }
      cy.get('[data-testid="fancy-link-card"]')
        .scrollIntoView()
        .should('be.visible');
    } else {
      // button should not be shown when the setting is false
      cy.get(`#${buildLinkItemId(id)}`).scrollIntoView();
      cy.get(`#${buildLinkItemId(id)} [data-testid="fancy-link-card"]`).should(
        'not.exist',
      );
    }
  }
};

export const expectAppViewScreenLayout = ({ id, extra }: AppItemType): void => {
  const { url } = extra.app;

  const appUrl = appendQueryParamToUrl(url, { itemId: id });

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
  cy.get(`#${MAIN_MENU_ID}`).contains(name);
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
      // there are two because of th two menus
      cy.get(`.${buildTreeItemClass(id)}:visible`).click();

      expectFolderLayout({ rootId: id, items });
    });
};
