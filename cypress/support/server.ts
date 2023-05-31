import { API_ROUTES } from '@graasp/query-client';
import {
  ChatMessage,
  DiscriminatedItem,
  ItemTag,
  ItemTagType,
  Member,
  PermissionLevel,
  PermissionLevelCompare,
  ResultOf,
  isChildOf,
  isDescendantOf,
  isRootItem,
} from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';
import * as qs from 'qs';

import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';
import { MEMBERS } from '../fixtures/members';
import { MockItem, MockItemTag } from '../fixtures/mockTypes';
import {
  DEFAULT_DELETE,
  DEFAULT_GET,
  DEFAULT_PATCH,
  DEFAULT_POST,
  EMAIL_FORMAT,
  ID_FORMAT,
  getChatMessagesById,
  getItemById,
  parseStringToRegExp,
} from './utils';

export const MEMBER_PROFILE_PATH = `${Cypress.env(
  'GRAASP_COMPOSE_HOST',
)}/profile`;

const {
  buildDownloadFilesRoute,
  buildGetItemChatRoute,
  buildGetItemLoginSchemaRoute,
  buildGetItemMembershipsForItemsRoute,
  buildGetItemRoute,
  buildGetItemTagsRoute,
  buildGetMembersBy,
  buildGetMembersRoute,
  GET_CURRENT_MEMBER_ROUTE,
  GET_OWN_ITEMS_ROUTE,
  SHARED_ITEM_WITH_ROUTE,
  SIGN_OUT_ROUTE,
} = API_ROUTES;

const API_HOST = Cypress.env('API_HOST');

export const isError = (error?: { statusCode: number }): boolean =>
  Boolean(error?.statusCode);

const checkMemberHasAccess = ({
  item,
  items,
  member,
}: {
  item: MockItem;
  items: MockItem[];
  member: Member;
}) => {
  // mock membership
  const { creator } = item;
  const haveWriteMembership =
    creator?.id === member.id ||
    items.find(
      (i) =>
        item.path.startsWith(i.path) &&
        i.memberships?.find(
          ({ memberId, permission }) =>
            memberId === member.id &&
            PermissionLevelCompare.gte(permission, PermissionLevel.Write),
        ),
    );
  const haveReadMembership =
    items.find(
      (i) =>
        item.path.startsWith(i.path) &&
        i.memberships?.find(
          ({ memberId, permission }) =>
            memberId === member.id &&
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

export const mockGetOwnItems = ({
  items,
  currentMember,
}: {
  items: MockItem[];
  currentMember: Member;
}): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${GET_OWN_ITEMS_ROUTE}`,
    },
    ({ reply }) => {
      if (!currentMember) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
      }
      const own = items.filter(
        ({ creator, path }) =>
          creator?.id === currentMember.id && !path.includes('.'),
      );
      return reply(own);
    },
  ).as('getOwnItems');
};

export const mockGetSharedItems = ({
  items,
  currentMember,
}: {
  items: MockItem[];
  currentMember: Member;
}): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${SHARED_ITEM_WITH_ROUTE}`,
    },
    ({ reply }) => {
      if (!currentMember) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
      }
      const shared = items.filter(
        ({ memberships, path }) =>
          memberships?.find((m) => m.memberId === currentMember.id) &&
          isRootItem({ path }),
      );
      return reply(shared);
    },
  ).as('getSharedItems');
};

export const mockGetCurrentMember = (
  currentMember = MEMBERS.ANNA,
  shouldThrowError = false,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${GET_CURRENT_MEMBER_ROUTE}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      // avoid sign in redirection
      return reply(currentMember);
    },
  ).as('getCurrentMember');
};

export const mockGetItem = (
  { items, currentMember }: { items: MockItem[]; currentMember: Member },
  shouldThrowError?: boolean,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, itemId);

      // item does not exist in db
      if (!item || shouldThrowError) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({
        item,
        items,
        member: currentMember,
      });
      if (isError(error)) {
        return reply(error);
      }

      return reply({
        body: item,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItem');
};

export const mockGetItemChat = ({
  chatMessages,
}: {
  chatMessages: ChatMessage[];
}): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemChatRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const itemChat = getChatMessagesById(chatMessages, itemId);

      return reply({
        body: itemChat,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItemChat');
};

export const mockGetItemMembershipsForItem = (
  items: MockItem[],
  currentMember: Member,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildGetItemMembershipsForItemsRoute([]),
        )}`,
      ),
    },
    ({ reply, url }) => {
      const itemId = qs.parse(url.slice(url.indexOf('?') + 1))
        .itemId as string[];
      const selectedItems = items.filter(({ id }) => itemId?.includes(id));
      const allMemberships = selectedItems.map(
        ({ creator, id, memberships }) => {
          // build default membership depending on current member
          // if the current member is the creator, it has membership
          // otherwise it should return an error
          const defaultMembership =
            creator?.id === currentMember?.id
              ? [
                  {
                    permission: PermissionLevel.Admin,
                    memberId: creator,
                    itemId: id,
                  },
                ]
              : { statusCode: StatusCodes.UNAUTHORIZED };

          // if the defined memberships does not contain currentMember, it should throw
          const currentMemberHasMembership = memberships?.find(
            ({ memberId }) => memberId === currentMember?.id,
          );
          if (!currentMemberHasMembership) {
            return defaultMembership;
          }

          return memberships || defaultMembership;
        },
      );
      reply(allMemberships);
    },
  ).as('getItemMemberships');
};

export const mockGetChildren = (items: MockItem[], member: Member): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/children`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id: thisId }) => id === thisId);

      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({ item, items, member });
      if (isError(error)) {
        return reply(error);
      }
      const children = items.filter(
        (newItem) =>
          isChildOf(newItem.path, item.path) &&
          checkMemberHasAccess({ item: newItem, items, member }) === undefined,
      );
      return reply(children);
    },
  ).as('getChildren');
};

export const mockGetDescendants = (items: MockItem[], member: Member): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/descendants`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id: thisId }) => id === thisId);

      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({ item, items, member });
      if (isError(error)) {
        return reply(error);
      }
      const descendants = items.filter(
        (newItem) =>
          isDescendantOf(newItem.path, item.path) &&
          checkMemberHasAccess({ item: newItem, items, member }) === undefined,
      );
      return reply(descendants);
    },
  ).as('getDescendants');
};

export const mockGetMemberBy = (
  members: Member[],
  shouldThrowError?: boolean,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(buildGetMembersBy([EMAIL_FORMAT]))}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const emailReg = new RegExp(EMAIL_FORMAT);
      const mail = emailReg.exec(url)?.[0];
      const member = members.find(({ email }) => email === mail);

      return reply([member]);
    },
  ).as('getMemberBy');
};

export const mockDefaultDownloadFile = (
  { items, currentMember }: { items: MockItem[]; currentMember: Member },
  shouldThrowError?: boolean,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildDownloadFilesRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id: thisId }) => id === thisId);
      const { replyUrl } = qs.parse(url.slice(url.indexOf('?') + 1));
      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({
        item,
        items,
        member: currentMember,
      });
      if (isError(error)) {
        return reply(error);
      }

      // either return the file url or the fixture data
      // info: we don't test fixture data anymore since the frontend uses url only
      if (replyUrl && item.filepath) {
        return reply(item.filepath);
      }

      return reply({ fixture: item.filefixture });
    },
  ).as('downloadFile');
};

export const mockGetItemTags = (items: MockItem[], member: Member): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemTagsRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => id === itemId);

      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkMemberHasAccess({ item, items, member });
      if (isError(error)) {
        return reply(error);
      }

      const itemTags = items
        .filter((i) => item.path.startsWith(i.path) && Boolean(i.tags))
        .map(
          (i) =>
            i.tags?.map((t) => ({
              ...t,
              item: i as DiscriminatedItem,
            })) as ItemTag[],
        );
      const result =
        itemTags.reduce<MockItemTag[]>((acc, tags) => [...acc, ...tags], []) ||
        [];
      return reply(result);
    },
  ).as('getItemTags');
};

export const mockGetItemsTags = (items: MockItem[], member: Member): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/tags\\?id\\=`),
    },
    ({ reply, url }) => {
      const ids = new URL(url).searchParams.getAll('id');

      const result = items
        .filter(({ id }) => ids.includes(id))
        .reduce(
          (acc, item) => {
            const error = checkMemberHasAccess({ item, items, member });

            return isError(error)
              ? { ...acc, error: [...acc.errors, error] }
              : {
                  ...acc,
                  data: {
                    ...acc.data,
                    [item.id]: item.tags?.map((t) => ({ item, ...t })) ?? [],
                  },
                };
          },
          { data: {}, errors: [] } as ResultOf<ItemTag[]>,
        );
      reply({
        statusCode: StatusCodes.OK,
        body: result,
      });
    },
  ).as('getItemsTags');
};

export const mockGetLoginSchemaType = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  items: MockItem[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: Member,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemLoginSchemaRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemId = url.slice(API_HOST.length).split('/')[2];

      // todo: add response for itemLoginSchemaType

      reply({
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getLoginSchemaType');
};

export const redirectionReply = {
  headers: { 'content-type': 'text/html' },
  statusCode: StatusCodes.OK,
  body: `
  <!DOCTYPE html>
  <html lang="en">
    <body>Hello</body>
  </html>
  `,
};

export const mockSignOut = (): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(SIGN_OUT_ROUTE),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('signOut');
};

export const mockGetMembers = (members: Member[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${buildGetMembersRoute([''])}*`,
    },
    ({ url, reply }) => {
      let memberIds = qs.parse(url.slice(url.indexOf('?') + 1)).id as
        | string
        | string[];
      if (typeof memberIds === 'string') {
        memberIds = [memberIds] as string[];
      }
      const allMembers = memberIds?.map((id) =>
        members.find(({ id: mId }) => mId === id),
      );
      // member does not exist in db
      if (!allMembers) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return reply({
        body: allMembers,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getMembers');
};

export const mockProfilePage = (): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: MEMBER_PROFILE_PATH,
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('goToMemberProfile');
};

export const mockAuthPage = (): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${Cypress.env('AUTHENTICATION_HOST')}`),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('goToAuthPage');
};

export const mockGetAppLink = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildAppItemLinkForTest()}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const filepath = url.slice(API_HOST.length).split('?')[0];
      return reply({ fixture: filepath });
    },
  ).as('getAppLink');
};

export const mockAppApiAccessToken = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildAppApiAccessTokenRoute(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ token: 'token' });
    },
  ).as('appApiAccessToken');
};

export const mockGetAppData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'get app data' });
    },
  ).as('getAppData');
};

export const mockPostAppData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'post app data' });
    },
  ).as('postAppData');
};

export const mockDeleteAppData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'delete app data' });
    },
  ).as('deleteAppData');
};

export const mockPatchAppData = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'patch app data' });
    },
  ).as('patchAppData');
};
