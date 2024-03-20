export const HOME_PATH = '/';
export const ROOT_ID_PATH = 'rootId';
export const ITEM_PARAM = 'itemId';
export const buildMainPath = ({ rootId = `:${ROOT_ID_PATH}` } = {}): string =>
  `/${rootId}`;
export const buildContentPagePath = ({
  rootId = `:${ROOT_ID_PATH}`,
  itemId = `:${ITEM_PARAM}`,
} = {}): string => `/${rootId}/${itemId}`;
