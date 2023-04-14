import {
  Context,
  ItemType,
  buildPdfViewerLink,
  buildSignInPath,
} from '@graasp/sdk';

import {
  AUTHENTICATION_HOST,
  GRAASP_ANALYTICS_HOST,
  GRAASP_ASSETS_URL,
  GRAASP_BUILDER_HOST,
  GRAASP_LIBRARY_HOST,
} from '@/config/env';

export const APP_NAME = 'Graasp';

export const PDF_VIEWER_LINK = buildPdfViewerLink(GRAASP_ASSETS_URL);

// define a max height depending on the screen height
// use a bit less of the height because of the header and some margin
export const SCREEN_MAX_HEIGHT = window.innerHeight * 0.8;

export const buildGraaspPlayerItemRoute = (id: string): string =>
  `${window.location.origin}/${id}`;

export const ITEM_CARD_MAX_LENGTH = 18;
export const HEADER_HEIGHT = 64;
export const DRAWER_WIDTH = 400;
export const DESCRIPTION_MAX_LENGTH = 130;

// signin page path from auth host
export const SIGN_IN_PATH = buildSignInPath({ host: AUTHENTICATION_HOST });

export const MEMBER_PROFILE_PATH = `${GRAASP_BUILDER_HOST}/profile`;

export const HOST_MAP = {
  [Context.BUILDER]: GRAASP_BUILDER_HOST,
  [Context.LIBRARY]: GRAASP_LIBRARY_HOST,
  [Context.ANALYTICS]: GRAASP_ANALYTICS_HOST,
  [Context.PLAYER]: '/',
  [Context.ANALYZER]: GRAASP_ANALYTICS_HOST,
  [Context.EXPLORER]: GRAASP_LIBRARY_HOST,
};

export const GRAASP_LOGO_HEADER_HEIGHT = 40;
export const FLOATING_BUTTON_Z_INDEX = 10;

export const GRAASP_MENU_ITEMS: string[] = [ItemType.FOLDER, ItemType.SHORTCUT];

export const buildBuilderTabName = (id: string): string => `builder-tab-${id}`;

export const DEFAULT_RESIZABLE_SETTING = false;

// todo: remove when files that use this are in TS
export const APP_CONTEXT = Context.PLAYER;

export const AVATAR_ICON_HEIGHT = 30;
