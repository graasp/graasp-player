export const HOME_PATH = '/';
export const buildMainPath = ({ rootId = ':rootId' } = {}): string =>
  `/${rootId}`;
