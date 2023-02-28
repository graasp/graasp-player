import { AppItemType, ItemType } from '@graasp/sdk';

import { CURRENT_USER } from './members';

// mock an app with the graasp link
// eslint-disable-next-line import/prefer-default-export
export const GRAASP_APP_ITEM: AppItemType = {
  id: 'baefbd2a-5688-11eb-ae91-0242ac130002',
  type: ItemType.APP,
  name: 'graasp app',
  description: 'a description for graasp app',
  path: 'baefbd2a_5688_11eb_ae93_0242ac130002',
  creator: CURRENT_USER.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  extra: {
    app: { url: 'https://graasp.eu' },
  },
  settings: {
    isPinned: false,
    showChatbox: false,
  },
};
