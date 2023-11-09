/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_PORT: number;
  readonly VITE_SHOW_NOTIFICATIONS: string;
  readonly VITE_GRAASP_AUTH_HOST: string;
  readonly VITE_GRAASP_BUILDER_HOST: string;
  readonly VITE_GRAASP_LIBRARY_HOST: string;
  readonly VITE_GRAASP_ACCOUNT_HOST: string;
  readonly VITE_GRAASP_AUTH_HOST: string;
  readonly VITE_GRAASP_H5P_INTEGRATION_URL: string;
  readonly VITE_SENTRY_ENV: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
