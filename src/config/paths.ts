export const HOME_PATH = '/';
export const ROOT_ID_PATH = 'rootId';
export const buildMainPath = ({ rootId = `:${ROOT_ID_PATH}` } = {}): string =>
  `/${rootId}`;
