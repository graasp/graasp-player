export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export const API_HOST =
  import.meta.env.VITE_GRAASP_API_HOST || 'http://localhost:3112';

export const DOMAIN = import.meta.env.VITE_GRAASP_DOMAIN;

export const SHOW_NOTIFICATIONS =
  import.meta.env.VITE_SHOW_NOTIFICATIONS === 'true' || false;

export const AUTHENTICATION_HOST =
  import.meta.env.VITE_GRAASP_AUTH_HOST || 'http://localhost:3001';

export const GRAASP_BUILDER_HOST =
  import.meta.env.VITE_GRAASP_BUILDER_HOST || 'http://localhost:3111';

export const GRAASP_LIBRARY_HOST =
  import.meta.env.VITE_GRAASP_LIBRARY_HOST || 'http://localhost:3005';

export const GRAASP_ANALYTICS_HOST =
  import.meta.env.VITE_GRAASP_ANALYTICS_HOST || 'http://localhost:3012';

export const H5P_INTEGRATION_URL =
  import.meta.env.VITE_GRAASP_H5P_INTEGRATION_URL ||
  `${API_HOST}/p/h5p-integration`;

export const HIDDEN_ITEM_TAG_ID =
  import.meta.env.VITE_HIDDEN_ITEM_TAG_ID || false;

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const GRAASP_ASSETS_URL = import.meta.env.VITE_GRAASP_ASSETS_URL;

export const APP_VERSION = import.meta.env.VITE_VERSION || 'latest';
