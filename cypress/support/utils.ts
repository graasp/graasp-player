import {
  ChatMessage,
  ItemTagType,
  Member,
  PermissionLevel,
  PermissionLevelCompare,
  isChildOf,
} from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';

import { MockItem } from '../fixtures/mockTypes';

/**
 * Parse characters of a given string to return a correct regex string
 * This function mainly allows for endpoints to have fixed chain of strings
 * as well as regex descriptions for data validation, eg /items/item-login?parentId=<id>
 *
 * @param {string} inputString
 * @param {string[]} characters
 * @param {boolean} parseQueryString
 * @returns regex string of the given string
 */
export const parseStringToRegExp = (
  inputString: string,
  { characters = ['?', '.'], parseQueryString = false } = {},
): string => {
  const [originalPathname, ...querystrings] = inputString.split('?');
  let pathname = originalPathname;
  let querystring = querystrings.join('?');
  characters.forEach((c) => {
    pathname = pathname.replaceAll(c, `\\${c}`);
  });
  if (parseQueryString) {
    characters.forEach((c) => {
      querystring = querystring.replaceAll(c, `\\${c}`);
    });
  }
  return `${pathname}${querystring.length ? '\\?' : ''}${querystring}`;
};

export const getItemById = (
  items: MockItem[],
  targetId: string,
): MockItem | undefined => items.find(({ id }) => targetId === id);

export const getChatMessagesById = (
  chatMessages: ChatMessage[],
  targetId: string,
): ChatMessage[] | undefined =>
  chatMessages.filter(({ item }) => targetId === item.id);

export const EMAIL_FORMAT = '[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+';

export const DEFAULT_GET = {
  credentials: 'include',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
};

export const DEFAULT_POST = {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

export const DEFAULT_DELETE = {
  method: 'DELETE',
  credentials: 'include',
};

export const DEFAULT_PATCH = {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

export const DEFAULT_PUT = {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const failOnError = (res: { ok: boolean; statusText: string }) => {
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res;
};

export const checkMemberHasAccess = ({
  item,
  items,
  member,
}: {
  item: MockItem;
  items: MockItem[];
  member: Member | null;
}): undefined | { statusCode: number } => {
  if (
    // @ts-expect-error move to packed item
    item.permission &&
    // @ts-expect-error move to packed item
    PermissionLevelCompare.gte(item.permission, PermissionLevel.Read)
  ) {
    return undefined;
  }

  // mock membership
  const { creator } = item;
  const haveWriteMembership =
    creator?.id === member?.id ||
    items.find(
      (i) =>
        item.path.startsWith(i.path) &&
        i.memberships?.find(
          ({ memberId, permission }) =>
            memberId === member?.id &&
            PermissionLevelCompare.gte(permission, PermissionLevel.Write),
        ),
    );
  const haveReadMembership =
    items.find(
      (i) =>
        item.path.startsWith(i.path) &&
        i.memberships?.find(
          ({ memberId, permission }) =>
            memberId === member?.id &&
            PermissionLevelCompare.lt(permission, PermissionLevel.Write),
        ),
    ) ?? false;

  const isHidden =
    items.find(
      (i) =>
        item.path.startsWith(i.path) &&
        i?.tags?.find(({ type }) => type === ItemTagType.Hidden),
    ) ?? false;
  const isPublic =
    items.find(
      (i) =>
        item.path.startsWith(i.path) &&
        i?.tags?.find(({ type }) => type === ItemTagType.Public),
    ) ?? false;
  // user is more than a reader so he can access the item
  if (isHidden && haveWriteMembership) {
    return undefined;
  }
  if (!isHidden && (haveWriteMembership || haveReadMembership)) {
    return undefined;
  }
  // item is public and not hidden
  if (!isHidden && isPublic) {
    return undefined;
  }
  return { statusCode: StatusCodes.FORBIDDEN };
};

export const getChildren = (
  items: MockItem[],
  item: MockItem,
  member: Member | null,
): MockItem[] =>
  items.filter(
    (newItem) =>
      isChildOf(newItem.path, item.path) &&
      checkMemberHasAccess({ item: newItem, items, member }) === undefined,
  );
