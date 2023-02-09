import {
  Context,
  ItemType,
  buildPdfViewerLink,
  buildSignInPath,
} from '@graasp/sdk';

export const APP_NAME = 'Graasp';

export const ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
};

export const NODE_ENV =
  process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || ENV.DEVELOPMENT;

export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

export const API_HOST =
  process.env.REACT_APP_API_HOST || 'http://localhost:3112';

export const DOMAIN = process.env.REACT_APP_DOMAIN;

export const SHOW_NOTIFICATIONS =
  process.env.REACT_APP_SHOW_NOTIFICATIONS === 'true' || false;

export const AUTHENTICATION_HOST =
  process.env.REACT_APP_AUTHENTICATION_HOST || 'http://localhost:3001';

export const GRAASP_COMPOSE_HOST =
  process.env.REACT_APP_GRAASP_COMPOSE_HOST || 'http://localhost:3111';

export const GRAASP_EXPLORE_HOST =
  process.env.REACT_APP_GRAASP_EXPLORE_HOST || 'http://localhost:3005';

export const GRAASP_ANALYTICS_HOST =
  process.env.REACT_APP_GRAASP_ANALYTICS_HOST || 'http://localhost:3012';

export const H5P_INTEGRATION_URL =
  process.env.REACT_APP_H5P_INTEGRATION_URL || `${API_HOST}/p/h5p-integration`;

export const HIDDEN_ITEM_TAG_ID =
  process.env.REACT_APP_HIDDEN_ITEM_TAG_ID || false;

export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

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

export const MEMBER_PROFILE_PATH = `${GRAASP_COMPOSE_HOST}/profile`;

export const HOST_MAP = {
  [Context.BUILDER]: GRAASP_COMPOSE_HOST,
  [Context.LIBRARY]: GRAASP_EXPLORE_HOST,
  [Context.ANALYTICS]: GRAASP_ANALYTICS_HOST,
  [Context.PLAYER]: '/',
  [Context.ANALYZER]: GRAASP_ANALYTICS_HOST,
  [Context.EXPLORER]: GRAASP_EXPLORE_HOST,
};

export const GRAASP_LOGO_HEADER_HEIGHT = 40;
export const FLOATING_BUTTON_Z_INDEX = 10;

export const GRAASP_MENU_ITEMS = [ItemType.FOLDER, ItemType.SHORTCUT];

export const buildBuilderTabName = (id: string): string => `builder-tab-${id}`;

export const DEFAULT_LINK_SHOW_BUTTON = true;
export const DEFAULT_RESIZABLE_SETTING = false;

export const PDF_VIEWER_LINK = buildPdfViewerLink(
  process.env.REACT_APP_GRAASP_ASSETS_URL,
);

// todo: remove when files that use this are in TS
export const APP_CONTEXT = Context.PLAYER;
