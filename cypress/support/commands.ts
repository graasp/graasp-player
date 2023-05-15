/// <reference types="cypress" />
import { COOKIE_KEYS, ChatMessage, Member } from '@graasp/sdk';

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
  mockGetDescendants,
  mockGetItem,
  mockGetItemChat,
  mockGetItemMembershipsForItem,
  mockGetItemTags,
  mockGetItemsTags,
  mockGetLoginSchemaType,
  mockGetMemberBy,
  mockGetMembers,
  mockPatchAppData,
  mockPostAppData,
  mockProfilePage,
  mockSignOut,
} from './server';

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    chatMessages = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    getItemError = false,
    getMemberError = false,
    getAppLinkError = false,
    getCurrentMemberError = false,
  } = {}) => {
    if (currentMember) {
      cy.setCookie(COOKIE_KEYS.SESSION_KEY, 'somecookie');
    }

    mockGetItem(
      { items, currentMember },
      getItemError || getCurrentMemberError,
    );
    mockGetItemChat({ chatMessages });
    mockGetItemMembershipsForItem(items, currentMember);
    // mockGetPublicItem({ items: cachedItems });

    mockGetItemTags(items, currentMember);

    mockGetItemsTags(items, currentMember);
    mockGetLoginSchemaType(items, currentMember);

    mockGetChildren(items, currentMember);
    // mockGetPublicChildren(cachedItems);

    mockGetDescendants(items, currentMember);

    mockGetMemberBy(members, getMemberError);

    mockGetCurrentMember(currentMember, getCurrentMemberError);

    mockDefaultDownloadFile({ items, currentMember });
    // mockPublicDefaultDownloadFile(cachedItems);

    mockSignOut();

    mockGetMembers(members);
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
  (iframeSelector: string, elementSelector, text) =>
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
        chatMessages,
        currentMember,
        storedSessions,
        getItemError,
        getMemberError,
        getCurrentMemberError,
        getAppLinkError,
      }?: {
        items?: MockItem[];
        members?: Member[];
        chatMessages?: ChatMessage[];
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
