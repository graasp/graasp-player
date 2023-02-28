import { buildSignInPath } from '@graasp/sdk';

// eslint-disable-next-line import/prefer-default-export
export const LOAD_FOLDER_CONTENT_PAUSE = 2000;

export const MEMBER_PROFILE_PATH = `${Cypress.env(
  'GRAASP_COMPOSE_HOST',
)}/profile`;

export const SIGN_IN_PATH = buildSignInPath({
  host: Cypress.env('AUTHENTICATION_HOST'),
});
