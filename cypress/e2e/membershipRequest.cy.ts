import { PackedFolderItemFactory } from '@graasp/sdk';

import { buildContentPagePath } from '@/config/paths';
import {
  FORBIDDEN_CONTENT_ID,
  REQUEST_MEMBERSHIP_BUTTON_ID,
} from '@/config/selectors';
import { ID_FORMAT } from '@/utils/item';

import { API_HOST } from '../support/env';
import { DEFAULT_GET, DEFAULT_POST } from '../support/utils';

const item = PackedFolderItemFactory();

describe('Membership Request', () => {
  describe('Logged out', () => {
    beforeEach(() => {
      cy.setUpApi({
        currentMember: null,
        items: [{ ...item, permission: null }],
      });
    });

    it('Forbidden', () => {
      cy.visit(buildContentPagePath({ rootId: item.id, itemId: item.id }));

      cy.get(`#${FORBIDDEN_CONTENT_ID}`).should('be.visible');
    });
  });

  describe('Logged in', () => {
    beforeEach(() => {
      cy.setUpApi({
        items: [{ ...item, permission: null }],
      });
    });

    it('Request membership', () => {
      cy.intercept(
        {
          method: DEFAULT_GET.method,
          url: new RegExp(
            `${API_HOST}/items/${ID_FORMAT}/memberships/requests$`,
          ),
        },
        ({ reply }) => {
          reply([]);
        },
      );

      cy.intercept(
        {
          method: DEFAULT_POST.method,
          url: new RegExp(
            `${API_HOST}/items/${ID_FORMAT}/memberships/requests$`,
          ),
        },
        ({ reply }) => {
          reply('ok');
        },
      ).as('request');

      cy.visit(buildContentPagePath({ rootId: item.id, itemId: item.id }));

      cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).click();

      cy.wait('@request');
    });
  });
});
