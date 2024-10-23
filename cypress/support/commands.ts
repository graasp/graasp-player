/// <reference types="cypress" />
import { ChatMessage, CookieKeys, Member } from '@graasp/sdk';

import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import { MockItem } from '../fixtures/mockTypes';
import {
  mockAnalytics,
  mockAppApiAccessToken,
  mockAuthPage,
  mockBuilder,
  mockDefaultDownloadFile,
  mockDeleteAppData,
  mockGetAccessibleItems,
  mockGetAppData,
  mockGetAppLink,
  mockGetChildren,
  mockGetCurrentMember,
  mockGetDescendants,
  mockGetItem,
  mockGetItemChat,
  mockGetItemGeolocation,
  mockGetItemMembershipsForItem,
  mockGetItemTags,
  mockGetItemsInMap,
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
    itemLogins = {},
    chatMessages = [],
    members = Object.values(MEMBERS),
    currentMember = CURRENT_USER,
    getItemError = false,
    getMemberError = false,
    getAppLinkError = false,
    getCurrentMemberError = false,
  } = {}) => {
    if (currentMember) {
      cy.setCookie(CookieKeys.AcceptCookies, 'true');
    }
    mockGetAccessibleItems(items);
    mockGetItem(
      { items, currentMember },
      getItemError || getCurrentMemberError,
    );
    mockGetItemChat({ chatMessages });
    mockGetItemMembershipsForItem(items, currentMember);

    mockGetItemTags(items, currentMember);

    mockGetItemsTags(items, currentMember);
    mockGetLoginSchemaType(itemLogins);

    mockGetChildren(items, currentMember);

    mockGetDescendants(items, currentMember);

    mockGetMemberBy(members, getMemberError);

    mockGetCurrentMember(currentMember, getCurrentMemberError);

    mockDefaultDownloadFile({ items, currentMember });

    mockBuilder();
    mockAnalytics();
    mockSignOut();
    mockProfilePage();

    mockGetMembers(members);
    mockAuthPage();
    mockGetAppLink(getAppLinkError);
    mockAppApiAccessToken(getAppLinkError);
    mockGetAppData(getAppLinkError);
    mockPostAppData(getAppLinkError);
    mockPatchAppData(getAppLinkError);
    mockDeleteAppData(getAppLinkError);

    mockGetItemGeolocation(items);
    mockGetItemsInMap(items, currentMember);
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
        itemLogins,
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
        itemLogins?: { [key: string]: string };
        members?: Member[];
        chatMessages?: ChatMessage[];
        currentMember?: Member | null;
        storedSessions?: { id: string; token: string; createdAt: number }[];
        getItemError?: boolean;
        getMemberError?: boolean;
        getCurrentMemberError?: boolean;
        getAppLinkError?: boolean;
      }): Chainable<void>;

      getIframeDocument(iframeSelector: string): Chainable;
      getIframeBody(iframeSelector: string): Chainable;

      checkContentInElementInIframe(
        iframeSelector: string,
        elementSelector: string,
        text: string,
      ): Chainable;
    }
  }
}
