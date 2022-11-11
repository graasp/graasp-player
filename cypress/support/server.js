import { StatusCodes } from 'http-status-codes';
import qs from 'qs';

import { API_ROUTES } from '@graasp/query-client';
import { PermissionLevel } from '@graasp/sdk';

import { DEFAULT_GET } from '../../src/api/utils';
import { MEMBER_PROFILE_PATH } from '../../src/config/constants';
import { getItemById, isChild, isError } from '../../src/utils/item';
import { MEMBERS } from '../fixtures/members';
import { EMAIL_FORMAT, ID_FORMAT, parseStringToRegExp } from './utils';

const {
  buildGetChildrenRoute,
  buildGetItemRoute,
  buildGetMembersBy,
  buildGetItemTagsRoute,
  GET_CURRENT_MEMBER_ROUTE,
  buildDownloadFilesRoute,
  GET_OWN_ITEMS_ROUTE,
  buildGetPublicItemRoute,
  buildGetPublicChildrenRoute,
  buildPublicDownloadFilesRoute,
  SIGN_OUT_ROUTE,
  buildGetMembersRoute,
  buildGetItemMembershipsForItemsRoute,
} = API_ROUTES;

const API_HOST = Cypress.env('API_HOST');
const PUBLIC_TAG_ID = Cypress.env('PUBLIC_TAG_ID');

const checkMemberHasAccess = ({ item, member }) => {
  // mock membership
  const creator = item?.creator;
  const haveMembership =
    creator === member.id ||
    item.memberships?.find(({ memberId }) => memberId === member.id);

  if (haveMembership) {
    return {};
  }
  return { statusCode: StatusCodes.FORBIDDEN };
};

const checkIsPublic = (item) => {
  const isPublic = item?.tags?.find(({ tagId }) => tagId === PUBLIC_TAG_ID);
  if (!isPublic) {
    return { statusCode: StatusCodes.UNAUTHORIZED };
  }
  return {};
};

export const mockGetOwnItems = ({ items, currentMember }) => {
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
) => {
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

export const mockGetItem = ({ items, currentMember }, shouldThrowError) => {
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

      const error = checkMemberHasAccess(
        { item, member: currentMember },
        reply,
      );
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

export const mockGetItemMembershipsForItem = (items, currentMember) => {
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
      const { itemId } = qs.parse(url.slice(url.indexOf('?') + 1));
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

export const mockGetPublicItem = ({ items }, shouldThrowError) => {
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

export const mockGetChildren = (items, member) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetChildrenRoute(ID_FORMAT)}`),
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
      const children = items.filter(isChild(id));
      return reply(children);
    },
  ).as('getChildren');
};

export const mockGetPublicChildren = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetPublicChildrenRoute(ID_FORMAT)}`),
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

      const children = items.filter(isChild(id));
      return reply(children);
    },
  ).as('getPublicChildren');
};

export const mockGetMemberBy = (members, shouldThrowError) => {
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
      const mail = emailReg.exec(url)[0];
      const member = members.find(({ email }) => email === mail);

      return reply([member]);
    },
  ).as('getMemberBy');
};

export const mockDefaultDownloadFile = (
  { items, currentMember },
  shouldThrowError,
) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildDownloadFilesRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id: thisId }) => id === thisId);

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
      return reply({ fixture: item.filepath });
    },
  ).as('downloadFile');
};

export const mockPublicDefaultDownloadFile = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${buildPublicDownloadFilesRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

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

      return reply({ fixture: item.filepath });
    },
  ).as('publicDownloadFile');
};

export const mockGetItemTags = (items, member) => {
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

export const mockGetItemsTags = (items, member) => {
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
  headers: { 'content-type': 'application/json' },
  statusCode: StatusCodes.OK,
  body: null,
};

export const mockSignOut = () => {
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

export const mockGetMembers = (members) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${buildGetMembersRoute([''])}*`,
    },
    ({ url, reply }) => {
      let { id: memberIds } = qs.parse(url.slice(url.indexOf('?') + 1));
      if (typeof memberIds === 'string') {
        memberIds = [memberIds];
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

export const mockProfilePage = () => {
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

export const mockAuthPage = () => {
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
