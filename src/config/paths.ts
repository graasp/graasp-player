export const HOME_PATH = '/';
export const ROOT_ID_PATH = 'rootId';
export const ITEM_PARAM = 'itemId';
export const AUTO_LOGIN_PATH = 'autoLogin';
export const buildMainPath = ({ rootId = `:${ROOT_ID_PATH}` } = {}): string =>
  `/${rootId}`;
export const buildContentPagePath = ({
  rootId = `:${ROOT_ID_PATH}`,
  itemId = `:${ITEM_PARAM}`,
  searchParams = '',
} = {}): string => {
  let url = `/${rootId}/${itemId}`;
  // append search parameters if present
  if (searchParams) {
    url = `${url}?${searchParams}`;
  }
  return url;
};
export const buildAutoLoginPath = ({
  rootId = `:${ROOT_ID_PATH}`,
  itemId = `:${ITEM_PARAM}`,
  searchParams = '',
} = {}): string => {
  let url = `/${rootId}/${itemId}/${AUTO_LOGIN_PATH}`;
  // append search parameters if present
  if (searchParams) {
    url = `${url}?${searchParams}`;
  }
  return url;
};
