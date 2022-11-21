import { buildSignInPath } from '@graasp/sdk';

import { ITEM_TYPES } from '../enums';
import env from '../env.json';

const {
  API_HOST: ENV_API_HOST,
  SHOW_NOTIFICATIONS: ENV_SHOW_NOTIFICATIONS,
  AUTHENTICATION_HOST: ENV_AUTHENTICATION_HOST,
  GRAASP_COMPOSE_HOST: ENV_GRAASP_COMPOSE_HOST,
  GRAASP_EXPLORE_HOST: ENV_GRAASP_EXPLORE_HOST,
  H5P_INTEGRATION_URL: ENV_H5P_INTEGRATION_URL,
  NODE_ENV: ENV_NODE_ENV,
  GA_MEASUREMENT_ID: ENV_GA_MEASUREMENT_ID,
  HIDDEN_ITEM_TAG_ID: ENV_HIDDEN_ITEM_TAG_ID,
  DOMAIN: ENV_DOMAIN,
  REACT_APP_SENTRY_DSN: ENV_SENTRY_DSN,
} = env;

export const APP_NAME = 'Graasp';

export const ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
};

export const NODE_ENV =
  ENV_NODE_ENV ||
  process.env.REACT_APP_NODE_ENV ||
  process.env.NODE_ENV ||
  ENV.DEVELOPMENT;

export const SENTRY_DSN = ENV_SENTRY_DSN || process.env.REACT_APP_SENTRY_DSN;

export const API_HOST =
  ENV_API_HOST || process.env.REACT_APP_API_HOST || 'http://localhost:3112';

export const DOMAIN = ENV_DOMAIN || process.env.REACT_APP_DOMAIN;

export const SHOW_NOTIFICATIONS =
  ENV_SHOW_NOTIFICATIONS ||
  process.env.REACT_APP_SHOW_NOTIFICATIONS === 'true' ||
  false;

export const AUTHENTICATION_HOST =
  ENV_AUTHENTICATION_HOST ||
  process.env.REACT_APP_AUTHENTICATION_HOST ||
  'http://localhost:3001';

export const GRAASP_COMPOSE_HOST =
  ENV_GRAASP_COMPOSE_HOST ||
  process.env.REACT_APP_GRAASP_COMPOSE_HOST ||
  'http://localhost:3111';

export const GRAASP_EXPLORE_HOST =
  ENV_GRAASP_EXPLORE_HOST ||
  process.env.REACT_APP_GRAASP_EXPLORE_HOST ||
  'http://localhost:3005';

export const H5P_INTEGRATION_URL =
  ENV_H5P_INTEGRATION_URL ||
  process.env.REACT_APP_H5P_INTEGRATION_URL ||
  `${API_HOST}/p/h5p-integration`;

export const HIDDEN_ITEM_TAG_ID =
  ENV_HIDDEN_ITEM_TAG_ID || process.env.REACT_APP_HIDDEN_ITEM_TAG_ID || false;

export const GA_MEASUREMENT_ID =
  ENV_GA_MEASUREMENT_ID || process.env.REACT_APP_GA_MEASUREMENT_ID;

// define a max height depending on the screen height
// use a bit less of the height because of the header and some margin
export const SCREEN_MAX_HEIGHT = window.innerHeight * 0.8;

export const buildGraaspPlayerItemRoute = (id) =>
  `${window.location.origin}/${id}`;

export const ITEM_CARD_MAX_LENGTH = 18;
export const HEADER_HEIGHT = 64;
export const DRAWER_WIDTH = 400;
export const DESCRIPTION_MAX_LENGTH = 130;

export const DEFAULT_IMAGE_SRC =
  'https://pbs.twimg.com/profile_images/1300707321262346240/IsQAyu7q_400x400.jpg';

// signin page path from auth host
export const SIGN_IN_PATH = buildSignInPath({ host: AUTHENTICATION_HOST });

export const MEMBER_PROFILE_PATH = `${GRAASP_COMPOSE_HOST}/profile`;

// todo: use from graasp utils
export const Context = {
  BUILDER: 'builder',
  PLAYER: 'player',
  EXPLORER: 'explorer',
  ANALYZER: 'analyzer',
};

export const HOST_MAP = {
  [Context.BUILDER]: GRAASP_COMPOSE_HOST,
  [Context.EXPLORER]: GRAASP_EXPLORE_HOST,
  [Context.PLAYER]: '/',
};

export const GRAASP_LOGO_HEADER_HEIGHT = 40;
export const FLOATING_BUTTON_Z_INDEX = 10;

export const GRAASP_MENU_ITEMS = [ITEM_TYPES.FOLDER, ITEM_TYPES.SHORTCUT];

export const buildBuilderTabName = (id) => `builder-tab-${id}`;

export const DEFAULT_LINK_SHOW_BUTTON = true;
export const DEFAULT_RESIZABLE_SETTING = false;

// todo: move to graasp sdk to reuse in builder
export const PDF_VIEWER_LINK = process.env.REACT_APP_GRAASP_ASSETS_URL
  ? `https://${process.env.REACT_APP_GRAASP_ASSETS_URL}/pdf-viewer/web/viewer.html?file=`
  : '';
