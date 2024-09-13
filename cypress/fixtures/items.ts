import {
  DocumentItemFactory,
  FolderItemFactory,
  ItemType,
  PermissionLevel,
  ShortcutItemFactory,
  buildPathFromIds,
} from '@graasp/sdk';
import { DEFAULT_LANG } from '@graasp/translations';

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
import { mockHiddenTag, mockPublicTag } from './tags';

export const DEFAULT_FOLDER_ITEM: MockItem = {
  description: '',
  id: '',
  name: '',
  displayName: 'default Display Name',
  path: '',
  type: ItemType.FOLDER,
  extra: {
    [ItemType.FOLDER]: {},
  },
  creator: CURRENT_USER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lang: DEFAULT_LANG,
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

export const DOCUMENT_WITH_CHAT_BOX: MockItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent folder',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  type: 'document',
  extra: { document: { content: 'hello this is a document' } },
  settings: {
    isPinned: false,
    showChatbox: true,
  },
};

export const DOCUMENT_WITHOUT_CHAT_BOX: MockItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent folder',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  type: 'document',
  extra: { document: { content: 'hello this is a document with no chatbox' } },
  settings: {
    isPinned: false,
    showChatbox: false,
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
      type: ItemType.FOLDER,
      extra: {
        [ItemType.FOLDER]: {},
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
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130006',
      name: 'document inside of child folder',
      type: 'document',
      extra: { document: { content: 'hello I am a document' } },
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003.fdf09f5a_5688_11eb_ae93_0242ac130005.fdf09f5a_5688_11eb_ae93_0242ac130006',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
    },
  ],
};
export const FOLDER_WITH_SUBFOLDER_ITEM_AND_PARTIAL_ORDER: {
  items: MockItem[];
} = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'parent folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        [ItemType.FOLDER]: {},
      },
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'child folder 1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child folder 2',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
      name: 'child of child folder 1',
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

const getPinnedElementWithoutInheritance = (): MockItem[] => {
  const parent = FolderItemFactory({
    name: 'Parent folder',
    creator: CURRENT_USER,
  });
  const children = [
    DocumentItemFactory({
      name: 'pinned from root',
      extra: { document: { content: 'I am pinned from parent' } },
      settings: { isPinned: true },
      parentItem: parent,
      creator: CURRENT_USER,
    }),
    FolderItemFactory({
      name: 'child folder 1',
      settings: { isPinned: false },
      parentItem: parent,
      creator: CURRENT_USER,
    }),
    FolderItemFactory({
      name: 'child folder 2',
      settings: { isPinned: false },
      parentItem: parent,
      creator: CURRENT_USER,
    }),
  ];
  const childrenOfChildren = [
    DocumentItemFactory({
      name: 'text in children 1',
      extra: { document: { content: 'Not pinned' } },
      settings: { isPinned: false },
      parentItem: children[1],
      creator: CURRENT_USER,
    }),
    DocumentItemFactory({
      name: 'pinned text in children 2',
      extra: { document: { content: 'I am pinned from child 2' } },
      parentItem: children[2],
      settings: { isPinned: true },
      creator: CURRENT_USER,
    }),
  ];
  const items = [parent, ...children, ...childrenOfChildren];
  return items;
};

export const PINNED_ITEMS_SHOULD_NOT_INHERIT =
  getPinnedElementWithoutInheritance();

export const PINNED_AND_HIDDEN_ITEM: { items: MockItem[] } = {
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
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130007',
      name: 'PINNED & hidden',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130005.fdf09f5a_5688_11eb_ae93_0242ac130007',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
      hidden: mockHiddenTag(),
    },
    {
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130008',
      name: 'Normal child',
      displayName: 'Normal child',
      description: 'I am a normal item',
      type: ItemType.DOCUMENT,
      extra: { [ItemType.DOCUMENT]: { content: 'hello' } },
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130005.fdf09f5a_5688_11eb_ae93_0242ac130008',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
      lang: DEFAULT_LANG,
      creator: CURRENT_USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      public: mockPublicTag(),
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
      public: mockPublicTag(),
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
      public: mockPublicTag(),
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
      hidden: mockHiddenTag(),
    },
  ],
};

export const getFolderWithShortcutFixture = (): MockItem[] => {
  const parent = FolderItemFactory({ name: 'Lesson', creator: CURRENT_USER });
  const child = FolderItemFactory({
    parentItem: parent,
    name: 'Part 1',
    creator: CURRENT_USER,
  });
  const documentItem = DocumentItemFactory({
    extra: { document: { content: 'I am a document' } },
    creator: CURRENT_USER,
  });
  return [
    parent,
    documentItem,
    child,
    DocumentItemFactory({ parentItem: parent, creator: CURRENT_USER }),
    ShortcutItemFactory({
      parentItem: parent,
      creator: CURRENT_USER,
      extra: { shortcut: { target: documentItem.id } },
    }),
  ];
};

export const FOLDER_WITH_COLLAPSIBLE_SHORTCUT_ITEMS: { items: MockItem[] } = {
  items: [
    // original for the shortcut
    GRAASP_DOCUMENT_ITEM,
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130008',
      name: 'parent folder',
      displayName: 'parent folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130008',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    // shortcut with collapse enabled
    {
      ...GRAASP_DOCUMENT_ITEM_VISIBLE,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130012',
      name: 'Shortcut to original document',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130008.ecafbd2a_5688_11eb_ae93_0242ac130012',
      type: ItemType.SHORTCUT,
      extra: {
        [ItemType.SHORTCUT]: { target: GRAASP_DOCUMENT_ITEM.id },
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
      public: mockPublicTag(),
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

export const FOLDER_WITHOUT_CHILDREN_ORDER: { items: MockItem[] } = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130122',
      name: 'parent folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130122',
      extra: {
        [ItemType.FOLDER]: {},
      },
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
  ],
};

export const FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS: { items: MockItem[] } = {
  items: [
    // root
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'parent folder',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        [ItemType.FOLDER]: {
          childrenOrder: [
            'fdf09f5a-5688-11eb-ae93-0242ac130003',
            'fdf09f5a-5688-11eb-ae93-0242ac130004',
            'fdf09f5a-5688-11eb-ae93-0242ac130007',
            'fdf09f5a-5688-11eb-ae93-0242ac130008',
            'fdf09f5a-5688-11eb-ae93-0242ac130009',
          ],
        },
      },
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    // children (need to be in order to respect test)
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'child folder 1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child folder 2',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130007',
      name: 'child folder 3',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a-5688-11eb-ae93-0242ac130007',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130008',
      name: 'child folder 4',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a-5688-11eb-ae93-0242ac130008',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130009',
      name: 'child folder 5',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a-5688-11eb-ae93-0242ac130009',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
  ],
};

export const ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS: {
  items: MockItem[];
} = {
  items: [
    // root
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'acafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'parent folder',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        [ItemType.FOLDER]: {
          childrenOrder: [
            'fdf09f5a-5688-11eb-ae93-0242ac130003',
            'fdf09f5a-5688-11eb-ae93-0242ac130004',
            'fdf09f5a-5688-11eb-ae93-0242ac130007',
            'fdf09f5a-5688-11eb-ae93-0242ac130008',
            'fdf09f5a-5688-11eb-ae93-0242ac130009',
          ],
        },
      },
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    // children (need to be in order to respect test)
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'child folder 1',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child folder 2',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130007',
      name: 'child folder 3',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a-5688-11eb-ae93-0242ac130007',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130008',
      name: 'child folder 4',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a-5688-11eb-ae93-0242ac130008',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130009',
      name: 'child folder 5',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a-5688-11eb-ae93-0242ac130009',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
  ],
};

export const YET_ANOTHER_FOLDER_WITH_FIVE_ORDERED_SUBFOLDER_ITEMS: {
  items: MockItem[];
} = {
  items: [
    // root
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'acafbd2a-5688-11eb-ae93-0242ac130012',
      name: 'parent folder',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130012',
      extra: {
        [ItemType.FOLDER]: {
          childrenOrder: [
            'fdf09f5a-5688-11eb-ae93-0242ac130013',
            'fdf09f5a-5688-11eb-ae93-0242ac130014',
            'fdf09f5a-5688-11eb-ae93-0242ac130017',
            'fdf09f5a-5688-11eb-ae93-0242ac130018',
            'fdf09f5a-5688-11eb-ae93-0242ac130019',
          ],
        },
      },
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    // children (need to be in order to respect test)
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130013',
      name: 'child folder 1',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130012.fdf09f5a_5688_11eb_ae93_0242ac130013',
      settings: {
        isPinned: true,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130014',
      name: 'child folder 2',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130012.fdf09f5a_5688_11eb_ae93_0242ac130014',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130017',
      name: 'child folder 3',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130012.fdf09f5a-5688-11eb-ae93-0242ac130017',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130018',
      name: 'child folder 4',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130012.fdf09f5a-5688-11eb-ae93-0242ac130018',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130019',
      name: 'child folder 5',
      path: 'acafbd2a_5688_11eb_ae93_0242ac130012.fdf09f5a-5688-11eb-ae93-0242ac130019',
      settings: {
        isPinned: false,
        showChatbox: false,
      },
    },
  ],
};
