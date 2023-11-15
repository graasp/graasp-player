import {
  ItemTagType,
  ItemType,
  PermissionLevel,
  buildPathFromIds,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import {
  GRAASP_DOCUMENT_ITEM,
  GRAASP_DOCUMENT_ITEM_HIDDEN,
  GRAASP_DOCUMENT_ITEM_PUBLIC_HIDDEN,
  GRAASP_DOCUMENT_ITEM_PUBLIC_VISIBLE,
  GRAASP_DOCUMENT_ITEM_VISIBLE,
} from './documents';
import { CURRENT_USER, MEMBERS } from './members';
import { MockItem } from './mockTypes';
import { mockItemTag } from './tags';

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
  creator: CURRENT_USER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  type: ItemType.FOLDER,
  settings: {
    isPinned: false,
    showChatbox: false,
  },
  memberships: [
    { memberId: MEMBERS.BOB.id, permission: PermissionLevel.Read },
    { memberId: MEMBERS.CEDRIC.id, permission: PermissionLevel.Write },
  ],
};

export const ITEM_WITH_CHAT_BOX: MockItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent folder',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  settings: {
    isPinned: false,
    showChatbox: true,
  },
};

export const ITEM_WITHOUT_CHAT_BOX: MockItem = {
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
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
      name: 'child of child folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003.fdf09f5a_5688_11eb_ae93_0242ac130005',
      settings: {
        isPinned: true,
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
      tags: [mockItemTag({ type: ItemTagType.Public })],
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
      tags: [mockItemTag({ type: ItemTagType.Public })],
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
      tags: [mockItemTag({ type: ItemTagType.Public })],
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
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130012',
      name: 'hidden folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130008.ecafbd2a-5688-11eb-ae93-0242ac130012',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
      tags: [mockItemTag({ type: ItemTagType.Hidden })],
    },
  ],
};

export const FOLDER_WITH_COLLAPSIBLE_SHORTCUT_ITEMS: { items: MockItem[] } = {
  items: [
    // original for the shortcut
    GRAASP_DOCUMENT_ITEM,
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
    // shortcut with collapse enabled
    {
      ...GRAASP_DOCUMENT_ITEM_VISIBLE,
      name: 'Shortcut to original document',
      type: ItemType.SHORTCUT,
      extra: {
        [ItemType.SHORTCUT]: { target: 'ecafbd2a-5688-12eb-ae91-0242ac130002' },
      },
      settings: { isCollapsible: true },
    },
  ],
};

export const PUBLIC_FOLDER_WITH_HIDDEN_ITEMS: { items: MockItem[] } = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130008',
      name: 'public parent folder with hidden child',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130008',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
      tags: [mockItemTag({ type: ItemTagType.Public })],
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

export const generateLotsOfFoldersOnHome = ({
  folderCount,
  creator = DEFAULT_FOLDER_ITEM.creator,
  memberships = DEFAULT_FOLDER_ITEM.memberships,
}: {
  folderCount: number;
  creator?: MockItem['creator'];
  memberships?: MockItem['memberships'];
}): MockItem[] =>
  Array.from(Array(folderCount)).map(() => {
    const itemId = v4();
    return {
      ...DEFAULT_FOLDER_ITEM,
      id: itemId,
      name: itemId,
      path: buildPathFromIds(itemId),
      type: ItemType.FOLDER,
      settings: {
        isPinned: false,
        showChatbox: false,
      },
      memberships,
      creator,
    };
  });

export const HOME_FOLDERS: { items: MockItem[] } = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'gcefbd2a-5688-11eb-ae92-0242ac130002',
      name: 'folder',
      path: 'gcefbd2a_5688_11eb_ae92_0242ac130002',
      type: ItemType.FOLDER,
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'gcefbd2a-5688-11eb-ae92-0242ac130002',
      name: 'folder',
      path: 'gcefbd2a_5688_11eb_ae92_0242ac130002',
      type: ItemType.FOLDER,
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'gcefbd2a-5688-11eb-ae92-0242ac130002',
      name: 'folder',
      path: 'gcefbd2a_5688_11eb_ae92_0242ac130002',
      type: ItemType.FOLDER,
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'gcefbd2a-5688-11eb-ae92-0242ac130002',
      name: 'folder',
      path: 'gcefbd2a_5688_11eb_ae92_0242ac130002',
      type: ItemType.FOLDER,
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'gcefbd2a-5688-11eb-ae92-0242ac130002',
      name: 'folder',
      path: 'gcefbd2a_5688_11eb_ae92_0242ac130002',
      type: ItemType.FOLDER,
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'gcefbd2a-5688-11eb-ae92-0242ac130002',
      name: 'folder',
      path: 'gcefbd2a_5688_11eb_ae92_0242ac130002',
      type: ItemType.FOLDER,
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
  ],
};
