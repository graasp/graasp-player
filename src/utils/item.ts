import { ItemType, PackedItem } from '@graasp/sdk';

export const paginationContentFilter = (items: PackedItem[]): PackedItem[] =>
  items
    .filter((i) => i.type !== ItemType.FOLDER)
    .filter((i) => !i.settings?.isPinned);

// use simple id format
export const ID_FORMAT = '(?=.*[0-9])(?=.*[a-zA-Z])([a-z0-9-]+)';
