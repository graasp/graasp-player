import { Item, ItemType } from '@graasp/sdk';

import {
  GRAASP_DOCUMENT_ITEM_HIDDEN,
  GRAASP_DOCUMENT_ITEM_PUBLIC_HIDDEN,
  GRAASP_DOCUMENT_ITEM_PUBLIC_VISIBLE,
  GRAASP_DOCUMENT_ITEM_VISIBLE,
} from './documents';
import { CURRENT_USER } from './members';

const PUBLIC_TAG_ID = Cypress.env('PUBLIC_TAG_ID');

export type MockItem = Item & {
  // for testing
  filepath?: string;
  memberships?: { memberId: string }[];
  tags?: { tagId: string }[];
};

export const DEFAULT_FOLDER_ITEM: MockItem = {
  description: '',
  id: '',
  name: '',
  path: '',
  extra: {
    [ItemType.FOLDER]: {
      childrenOrder: [],
    },
  },
  creator: CURRENT_USER.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  type: ItemType.FOLDER,
  settings: {
    isPinned: false,
    showChatbox: false,
  },
};

export const ITEM_WITH_CHAT_BOX = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent folder',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  settings: {
    isPinned: false,
    showChatbox: true,
  },
};

export const ITEM_WITHOUT_CHAT_BOX = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
  name: 'child folder',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
  settings: {
    isPinned: false,
    showChatbox: false,
  },
};

export const FOLDER_WITH_SUBFOLDER_ITEM: { items: MockItem[] } = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'parent folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        [ItemType.FOLDER]: {
          childrenOrder: [],
        },
      },
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'child folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
  ],
};

export const FOLDER_WITH_PINNED_ITEMS: { items: MockItem[] } = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130005',
      name: 'parent folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130005',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      type: ItemType.LINK,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130006',
      name: 'NOT PINNED',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130005.fdf09f5a_5688_11eb_ae93_0242ac130006',
      extra: {
        [ItemType.LINK]: {
          url: 'http://example.com',
          html: '',
          thumbnails: [],
          icons: [],
        },
      },
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130007',
      name: 'PINNED',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130005.fdf09f5a_5688_11eb_ae93_0242ac130007',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
    },
  ],
};

export const PUBLIC_FOLDER_WITH_PINNED_ITEMS: { items: MockItem[] } = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130005',
      name: 'parent folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130005',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
      tags: [
        {
          tagId: PUBLIC_TAG_ID,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      type: ItemType.LINK,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130006',
      name: 'NOT PINNED',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130005.fdf09f5a_5688_11eb_ae93_0242ac130006',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
      extra: {
        [ItemType.LINK]: {
          url: 'http://example.com',
          html: '',
          thumbnails: [],
          icons: [],
        },
      },
      tags: [
        {
          tagId: PUBLIC_TAG_ID,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130007',
      name: 'PINNED',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130005.fdf09f5a_5688_11eb_ae93_0242ac130007',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
      tags: [
        {
          tagId: PUBLIC_TAG_ID,
        },
      ],
    },
  ],
};

export const FOLDER_WITH_HIDDEN_ITEMS: { items: MockItem[] } = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130008',
      name: 'parent folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130008',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    GRAASP_DOCUMENT_ITEM_VISIBLE,
    GRAASP_DOCUMENT_ITEM_HIDDEN,
  ],
};

export const PUBLIC_FOLDER_WITH_HIDDEN_ITEMS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130008',
      name: 'public parent folder with hidden child',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130008',
      extra: {
        image: 'someimageurl',
      },
      settings: {
        isPinned: false,
        showChatbox: false,
      },
      tags: [
        {
          tagId: PUBLIC_TAG_ID,
        },
      ],
    },
    GRAASP_DOCUMENT_ITEM_PUBLIC_VISIBLE,
    GRAASP_DOCUMENT_ITEM_PUBLIC_HIDDEN,
  ],
};

export const SHORTCUT = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'gcafbd2a-5688-11eb-ae92-0242ac130002',
  name: 'shortcut for own_item_name1',
  path: 'gcafbd2a_5688_11eb_ae92_0242ac130002',
  type: ItemType.SHORTCUT,
  extra: {
    image: 'someimageurl',
  },
  settings: {
    isPinned: false,
    showChatbox: false,
  },
};

export const FOLDER_FIXTURE = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'gcefbd2a-5688-11eb-ae92-0242ac130002',
  name: 'folder',
  path: 'gcefbd2a_5688_11eb_ae92_0242ac130002',
  type: ItemType.FOLDER,
  extra: {
    image: 'someimageurl',
  },
  settings: {
    isPinned: false,
    showChatbox: false,
  },
};
