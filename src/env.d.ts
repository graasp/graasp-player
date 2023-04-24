/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_PORT: number;
  readonly VITE_SHOW_NOTIFICATIONS: string;
  readonly VITE_GRAASP_AUTH_HOST: string;
  readonly VITE_GRAASP_H5P_INTEGRATION_URL: string;
  readonly VITE_PUBLIC_TAG_ID: string;
  readonly VITE_HIDDEN_ITEM_TAG_ID: string;
  readonly VITE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
