/// <reference types="cypress" />
import { COOKIE_KEYS, Member } from '@graasp/sdk';

import { MockItem } from '@/../cypress/fixtures/items';

import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import {
  mockAppApiAccessToken,
  mockAuthPage,
  mockDefaultDownloadFile,
  mockDeleteAppData,
  mockGetAppData,
  mockGetAppLink,
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
  mockPatchAppData,
  mockPostAppData,
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
    getAppLinkError = false,
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
    mockGetAppLink(getAppLinkError);
    mockAppApiAccessToken(getAppLinkError);
    mockGetAppData(getAppLinkError);
    mockPostAppData(getAppLinkError);
    mockPatchAppData(getAppLinkError);
    mockDeleteAppData(getAppLinkError);
  },
);

Cypress.Commands.add('getIframeDocument', (iframeSelector) =>
  cy.get(iframeSelector).its('0.contentDocument').should('exist').then(cy.wrap),
);

Cypress.Commands.add('getIframeBody', (iframeSelector) =>
  // retry to get the body until the iframe is loaded
  cy
    .getIframeDocument(iframeSelector)
    .its('body')
    .should('not.be.undefined')
    .then(cy.wrap),
);

Cypress.Commands.add(
  'checkContentInElementInIframe',
  (iframeSelector, elementSelector, text) =>
    cy
      .get(iframeSelector)
      .then(($iframe) =>
        cy
          .wrap($iframe.contents().find(elementSelector))
          .should('contain', text),
      ),
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
        getAppLinkError,
      }?: {
        items?: MockItem[];
        members?: Member[];
        currentMember?: Member;
        storedSessions?: { id: string; token: string; createdAt: number }[];
        getItemError?: boolean;
        getMemberError?: boolean;
        getCurrentMemberError?: boolean;
        getAppLinkError?: boolean;
      }): Chainable<void>;

      getIframeDocument(iframeSelector: string): Chainable;
      getIframeBody(iframeSelector: string): Chainable;

      // clickElementInIframe(
      //   iframeSelector: string,
      //   elementSelector: string,
      // ): Chainable;

      checkContentInElementInIframe(
        iframeSelector: string,
        elementSelector: string,
        text: string,
      ): Chainable;
    }
  }
}
