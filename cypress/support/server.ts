import { API_ROUTES } from '@graasp/query-client';
import { Member, PermissionLevel, isChildOf } from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';
import * as qs from 'qs';

import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';
import { MockItem } from '../fixtures/items';
import { MEMBERS } from '../fixtures/members';
import {
  DEFAULT_DELETE,
  DEFAULT_GET,
  DEFAULT_PATCH,
  DEFAULT_POST,
  EMAIL_FORMAT,
  ID_FORMAT,
  getItemById,
  parseStringToRegExp,
} from './utils';

export const MEMBER_PROFILE_PATH = `${Cypress.env(
  'GRAASP_COMPOSE_HOST',
)}/profile`;

const {
  buildGetItemRoute,
  buildGetMembersBy,
  buildGetItemTagsRoute,
  GET_CURRENT_MEMBER_ROUTE,
  buildDownloadFilesRoute,
  GET_OWN_ITEMS_ROUTE,
  buildGetPublicItemRoute,
  buildPublicDownloadFilesRoute,
  SIGN_OUT_ROUTE,
  buildGetMembersRoute,
  buildGetItemMembershipsForItemsRoute,
} = API_ROUTES;

const API_HOST = Cypress.env('API_HOST');

const PUBLIC_TAG_ID = Cypress.env('PUBLIC_TAG_ID');

export const isError = (error?: { statusCode: number }): boolean =>
  Boolean(error?.statusCode);

const checkMemberHasAccess = ({
  item,
  member,
}: {
  item: MockItem;
  member: Member;
}) => {
  // mock membership
  const creator = item?.creator;
  const haveMembership =
    creator === member.id ||
    item.memberships?.find(({ memberId }) => memberId === member.id);

  if (haveMembership) {
    return undefined;
  }
  return { statusCode: StatusCodes.FORBIDDEN };
};

const checkIsPublic = (item: MockItem): { statusCode: number } | undefined => {
  const isPublic = item?.tags?.find(({ tagId }) => tagId === PUBLIC_TAG_ID);
  if (!isPublic) {
    return { statusCode: StatusCodes.UNAUTHORIZED };
  }
  return undefined;
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
          creator === currentMember.id && !path.includes('.'),
      );
      return reply(own);
    },
  ).as('getOwnItems');
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

      const error = checkMemberHasAccess({ item, member: currentMember });
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
            creator === currentMember?.id
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

export const mockGetPublicItem = (
  { items }: { items: MockItem[] },
  shouldThrowError?: boolean,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetPublicItemRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const itemId = url.slice(API_HOST.length).split('/')[3];
      const item = getItemById(items, itemId);

      // item does not exist in db
      if (!item || shouldThrowError) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkIsPublic(item);
      if (isError(error)) {
        return reply(error);
      }

      return reply({
        body: item,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getPublicItem');
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

      const error = checkMemberHasAccess({ item, member });
      if (isError(error)) {
        return reply(error);
      }
      const children = items.filter((newItem) =>
        isChildOf(newItem.path, item.path),
      );
      return reply(children);
    },
  ).as('getChildren');
};

export const mockGetPublicChildren = (items: MockItem[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/p/items/${ID_FORMAT}/children`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[3];
      const item = items.find(({ id: thisId }) => id === thisId);
      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkIsPublic(item);
      if (isError(error)) {
        return reply(error);
      }

      const children = items.filter((testItem) =>
        isChildOf(testItem.path, item.path),
      );
      return reply(children);
    },
  ).as('getPublicChildren');
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

      const error = checkMemberHasAccess({ item, member: currentMember });
      if (isError(error)) {
        return reply(error);
      }

      // either return the file url or the fixture data
      // info: we don't test fixture data anymore since the frontend uses url only
      if (replyUrl) {
        return reply({ url: item.filepath });
      }

      return reply({ fixture: item.filepath });
    },
  ).as('downloadFile');
};

export const mockPublicDefaultDownloadFile = (
  items: MockItem[],
  shouldThrowError?: boolean,
): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${buildPublicDownloadFilesRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const id = url.slice(API_HOST.length).split('/')[3];
      const item = items.find(({ id: thisId }) => id === thisId);
      const { replyUrl } = qs.parse(url.slice(url.indexOf('?') + 1));

      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const error = checkIsPublic(item);
      if (isError(error)) {
        return reply(error);
      }

      // either return the file url or the fixture data
      // info: we don't test fixture data anymore since the frontend uses url only
      if (replyUrl) {
        return reply({ url: item.filepath });
      }

      return reply({ fixture: item.filepath });
    },
  ).as('publicDownloadFile');
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

      const error = checkMemberHasAccess({ item, member });
      if (isError(error)) {
        return reply(error);
      }

      const result = item?.tags || [];
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
        .map((item) => {
          const error = checkMemberHasAccess({ item, member });

          return isError(error) ? error : item?.tags ?? [];
        });
      reply({
        statusCode: StatusCodes.OK,
        body: result,
      });
    },
  ).as('getItemsTags');
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
