/// <reference types="cypress" />
import { COOKIE_KEYS, Member } from '@graasp/sdk';

import { MockItem } from '@/../cypress/fixtures/items';

import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import {
  mockAuthPage,
  mockDefaultDownloadFile,
  mockGetChildren,
  mockGetCurrentMember,
  mockGetItem,
  mockGetItemMembershipsForItem,
  mockGetItemTags,
  mockGetItemsTags,
  mockGetMemberBy,
  mockGetMembers,
  mockGetPublicChildren,
  mockGetPublicItem,
  mockProfilePage,
  mockPublicDefaultDownloadFile,
  mockSignOut,
} from './server';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    storedSessions = [],
    getItemError = false,
    getMemberError = false,
    getCurrentMemberError = false,
  } = {}) => {
    // why do we do this ???
    const cachedItems = items;
    const cachedMembers = JSON.parse(JSON.stringify(members));
    if (currentMember) {
      cy.setCookie(COOKIE_KEYS.SESSION_KEY, 'somecookie');
    }
    cy.setCookie(
      COOKIE_KEYS.STORED_SESSIONS_KEY,
      JSON.stringify(storedSessions),
    );

    mockGetItem(
      { items: cachedItems, currentMember },
      getItemError || getCurrentMemberError,
    );
    mockGetItemMembershipsForItem(items, currentMember);
    mockGetPublicItem({ items: cachedItems });

    mockGetItemTags(items, currentMember);

    mockGetItemsTags(items, currentMember);

    mockGetChildren(cachedItems, currentMember);
    mockGetPublicChildren(cachedItems);

    mockGetMemberBy(cachedMembers, getMemberError);

    mockGetCurrentMember(currentMember, getCurrentMemberError);

    mockDefaultDownloadFile({ items: cachedItems, currentMember });
    mockPublicDefaultDownloadFile(cachedItems);

    mockSignOut();

    mockGetMembers(cachedMembers);
    mockProfilePage();
    mockAuthPage();
  },
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      setUpApi({
        items,
        members,
        currentMember,
        storedSessions,
        getItemError,
        getMemberError,
        getCurrentMemberError,
      }?: {
        items?: MockItem[];
        members?: Member[];
        currentMember?: Member;
        storedSessions?: { id: string; token: string; createdAt: number }[];
        getItemError?: boolean;
        getMemberError?: boolean;
        getCurrentMemberError?: boolean;
      }): Chainable<void>;
    }
  }
}
