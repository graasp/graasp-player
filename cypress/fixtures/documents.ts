import {
  DocumentItemType,
  ItemTagType,
  ItemType,
  PermissionLevel,
  buildDocumentExtra,
} from '@graasp/sdk';

import { CURRENT_USER, MEMBERS } from './members';
import { MockItem } from './mockTypes';
import { mockItemTag } from './tags';

export const GRAASP_DOCUMENT_ITEM: DocumentItemType = {
  id: 'ecafbd2a-5688-12eb-ae91-0242ac130002',
  type: ItemType.DOCUMENT,
  name: 'graasp text',
  description: 'a description for graasp text',
  path: 'ecafbd2a_5688_12eb_ae93_0242ac130002',
  creator: CURRENT_USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  extra: buildDocumentExtra({
    content: '<h1>Some Title</h1>',
  }),
  settings: {
    isPinned: false,
    showChatbox: false,
  },
};

export const GRAASP_DOCUMENT_ITEM_VISIBLE: DocumentItemType = {
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130009',
  type: ItemType.DOCUMENT,
  name: 'Visible document',
  description: 'a description for graasp text',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130008.fdf09f5a_5688_11eb_ae93_0242ac130009',
  creator: CURRENT_USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  extra: buildDocumentExtra({
    content: '<h1>Visible document</h1>',
  }),
  settings: {
    isPinned: false,
    showChatbox: false,
  },
};

export const GRAASP_DOCUMENT_ITEM_HIDDEN: MockItem = {
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130010',
  type: ItemType.DOCUMENT,
  name: 'Hidden document',
  description: 'a description for graasp text',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130008.fdf09f5a_5688_11eb_ae93_0242ac130010',
  creator: CURRENT_USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  extra: buildDocumentExtra({
    content: '<h1>Hidden document</h1>',
  }),
  settings: {
    isPinned: false,
    showChatbox: false,
  },
  tags: [mockItemTag({ type: ItemTagType.Hidden })],
  memberships: [{ memberId: MEMBERS.BOB.id, permission: PermissionLevel.Read }],
};

export const GRAASP_DOCUMENT_ITEM_PUBLIC_VISIBLE: MockItem = {
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130009',
  type: ItemType.DOCUMENT,
  name: 'Public visible document',
  description: 'a description for graasp text',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130008.fdf09f5a_5688_11eb_ae93_0242ac130009',
  creator: CURRENT_USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  extra: buildDocumentExtra({
    content: '<h1>Public visible document</h1>',
  }),
  settings: {
    isPinned: false,
    showChatbox: false,
  },
  tags: [mockItemTag({ type: ItemTagType.Public })],
};

export const GRAASP_DOCUMENT_ITEM_PUBLIC_HIDDEN: MockItem = {
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130010',
  type: ItemType.DOCUMENT,
  name: 'Public hidden document',
  description: 'a description for graasp text',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130008.fdf09f5a_5688_11eb_ae93_0242ac130010',
  creator: CURRENT_USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  extra: buildDocumentExtra({
    content: '<h1>Public hidden document</h1>',
  }),
  settings: {
    isPinned: false,
    showChatbox: false,
  },
  tags: [
    mockItemTag({ type: ItemTagType.Public }),
    mockItemTag({ type: ItemTagType.Hidden }),
  ],
};

export const GRAASP_DOCUMENT_ITEM_WITH_CHAT_BOX: DocumentItemType = {
  id: 'ecafbf2a-5688-12eb-ae91-0242ac130002',
  type: ItemType.DOCUMENT,
  name: 'graasp text',
  description: 'a description for graasp text',
  path: 'ecafbf2a_5688_12eb_ae93_0242ac130002',
  creator: CURRENT_USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  extra: buildDocumentExtra({
    content: '<h1>Some Title</h1>',
  }),
  settings: {
    isPinned: false,
    showChatbox: true,
  },
};
