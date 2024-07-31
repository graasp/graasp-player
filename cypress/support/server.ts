import { API_ROUTES } from '@graasp/query-client';
import {
  ChatMessage,
  DiscriminatedItem,
  HttpMethod,
  ItemTag,
  Member,
  PermissionLevel,
  ResultOf,
  getIdsFromPath,
  isDescendantOf,
  isRootItem,
} from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';

import { ID_FORMAT } from '../../src/utils/item';
import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';
import { MEMBERS } from '../fixtures/members';
import { MockItem, MockItemTag } from '../fixtures/mockTypes';
import {
  ACCOUNT_HOST,
  ANALYTICS_HOST,
  API_HOST,
  AUTH_HOST,
  BUILDER_HOST,
} from './env';
import {
  DEFAULT_DELETE,
  DEFAULT_GET,
  DEFAULT_PATCH,
  DEFAULT_POST,
  EMAIL_FORMAT,
  checkMemberHasAccess,
  getChatMessagesById,
  getChildren,
  getItemById,
  parseStringToRegExp,
} from './utils';

const {
  buildDownloadFilesRoute,
  buildGetItemChatRoute,
  buildGetItemLoginSchemaRoute,
  buildGetItemMembershipsForItemsRoute,
  buildGetItemRoute,
  buildGetItemTagsRoute,
  buildGetMembersByEmailRoute,
  buildGetMembersByIdRoute,
  buildGetCurrentMemberRoute,
  GET_OWN_ITEMS_ROUTE,
  SHARED_ITEM_WITH_ROUTE,
  SIGN_OUT_ROUTE,
  buildGetItemGeolocationRoute,
} = API_ROUTES;

export const isError = (error?: { statusCode: number }): boolean =>
  Boolean(error?.statusCode);

export const mockGetOwnItems = ({
  items,
  currentMember,
}: {
  items: MockItem[];
  currentMember: Member | null;
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
  currentMember: Member | null;
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

export const mockGetAccessibleItems = (items: DiscriminatedItem[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/accessible`),
    },
    ({ url, reply }) => {
      const params = new URL(url).searchParams;

      const page = parseInt(params.get('page') ?? '1', 10);
      const pageSize = parseInt(params.get('pageSize') ?? '10', 10);

      // as { page: number; pageSize: number };

      // warning: we don't check memberships
      const root = items.filter(isRootItem);

      // todo: filter

      const result = root.slice((page - 1) * pageSize, page * pageSize);

      reply({ data: result, totalCount: root.length });
    },
  ).as('getAccessibleItems');
};

export const mockGetCurrentMember = (
  currentMember: Member | null = MEMBERS.ANNA,
  shouldThrowError = false,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${buildGetCurrentMemberRoute()}`,
    },
    ({ reply }) => {
      // simulate member accessing without log in
      if (currentMember == null) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED });
      }
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      // avoid sign in redirection
      return reply(currentMember);
    },
  ).as('getCurrentMember');
};

export const mockGetItem = (
  { items, currentMember }: { items: MockItem[]; currentMember: Member | null },
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
  currentMember: Member | null,
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
      const itemIds = new URLSearchParams(new URL(url).search).getAll('itemId');
      const selectedItems = items.filter(({ id }) => itemIds?.includes(id));
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

export const mockGetChildren = (
  items: MockItem[],
  member: Member | null,
): void => {
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
      const children = getChildren(items, item, member);
      return reply(children);
    },
  ).as('getChildren');
};

export const mockGetDescendants = (
  items: MockItem[],
  member: Member | null,
): void => {
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
          checkMemberHasAccess({ item: newItem, items, member }) ===
            undefined &&
          newItem.path !== item.path,
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
        `${API_HOST}/${parseStringToRegExp(buildGetMembersByEmailRoute([EMAIL_FORMAT]))}`,
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
  { items, currentMember }: { items: MockItem[]; currentMember: Member | null },
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
      const replyUrl = new URLSearchParams(new URL(url).search).get('replyUrl');
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

export const mockGetItemTags = (
  items: MockItem[],
  member: Member | null,
): void => {
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
        .filter((i) => item.path.startsWith(i.path) && (i.public || i.hidden))
        .map(
          (i) =>
            [i.public, i.hidden].filter(Boolean).map((t) => ({
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

export const mockGetItemsTags = (
  items: MockItem[],
  member: Member | null,
): void => {
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
                    [item.id]: ([item.public, item.hidden]
                      .filter(Boolean)
                      .map((t) => ({ item, ...t })) ?? []) as ItemTag[],
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
  itemLogins: { [key: string]: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  member: Member | null,
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
      const itemLogin = itemLogins[itemId];

      if (itemLogin) {
        return reply(itemLogin);
      }
      return reply({
        statusCode: StatusCodes.NOT_FOUND,
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

export const mockBuilder = (): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${BUILDER_HOST}`),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('builder');
};

export const mockAnalytics = (): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(ANALYTICS_HOST),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('analytics');
};

export const mockGetMembers = (members: Member[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${buildGetMembersByIdRoute([''])}*`,
    },
    ({ url, reply }) => {
      const memberIds = new URLSearchParams(url).getAll('id');
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
      url: new RegExp(ACCOUNT_HOST),
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
      url: new RegExp(AUTH_HOST),
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

export const mockGetItemGeolocation = (items: MockItem[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${buildGetItemGeolocationRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => id === itemId);

      if (!item) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      if (item?.geolocation) {
        return reply(item?.geolocation);
      }

      const parentIds = getIdsFromPath(item.path);
      // suppose return only one
      const geolocs = items
        .filter((i) => parentIds.includes(i.id))
        .filter(Boolean)
        .map((i) => i.geolocation);

      if (geolocs.length) {
        return reply(geolocs[0]!);
      }

      return reply({ statusCode: StatusCodes.NOT_FOUND });
    },
  ).as('getItemGeolocation');
};

export const mockGetItemsInMap = (
  items: MockItem[],
  currentMember: Member | null,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/geolocation`),
    },
    ({ reply, url }) => {
      const itemId = new URL(url).searchParams.get('parentItemId');
      const item = items.find(({ id }) => id === itemId);

      if (!item) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      const children = getChildren(items, item, currentMember);

      const geolocs = [
        item?.geolocation,
        ...children.map((c) => c.geolocation),
      ].filter(Boolean);

      return reply(geolocs);
    },
  ).as('getItemsInMap');
};
