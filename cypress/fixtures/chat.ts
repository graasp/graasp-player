import { ChatMessage } from '@graasp/sdk';

import { v4 } from 'uuid';

import { ITEM_WITH_CHAT_BOX } from './items';

// eslint-disable-next-line import/prefer-default-export
export const ITEM_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: v4(),
    item: ITEM_WITH_CHAT_BOX,
    creator: ITEM_WITH_CHAT_BOX.creator,
    createdAt: new Date(),
    updatedAt: new Date(),
    body: 'a message',
  },
];
