import { HIDDEN_ITEM_TAG_ID } from '../config/constants';
import { ITEM_TYPES } from '../enums';

// eslint-disable-next-line no-useless-escape
export const transformIdForPath = (id) => id.replace(/\-/g, '_');

export const getParentsIdsFromPath = (path, { ignoreSelf = false } = {}) => {
  if (!path) {
    return [];
  }

  let p = path;
  // ignore self item in path
  if (ignoreSelf) {
    // split path in half parents / self
    // eslint-disable-next-line no-useless-escape
    const els = path.split(/\.[^\.]*$/);
    // if els has only one element, the item has no parent
    if (els.length <= 1) {
      return [];
    }
    [p] = els;
  }
  const ids = p.replace(/_/g, '-').split('.');
  return ids;
};

export const buildPath = ({ prefix, ids }) =>
  `${prefix}${ids.map((id) => transformIdForPath(id)).join('.')}`;

export const getItemById = (items, id) =>
  items.find(({ id: thisId }) => id === thisId);

export const getItemsById = (items, ids) =>
  items.filter(({ id: thisId }) => ids.includes(thisId));

export const getDirectParentId = (path) => {
  const ids = getParentsIdsFromPath(path);
  const parentIdx = ids.length - 2;
  if (parentIdx < 0) {
    return null;
  }
  return ids[parentIdx];
};

export const isChild = (id) => {
  const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
  return ({ path }) => path.match(reg);
};

export const getChildren = (items, id) => items.filter(isChild(id));

export const isError = (error) => error?.statusCode;

export const isHidden = (tags) => {
  // tags might have failed to be fetched and is an error
  if (isError(tags)) {
    return false;
  }
  return Boolean(
    tags?.filter(({ tagId }) => tagId === HIDDEN_ITEM_TAG_ID).length,
  );
};

export const areItemsEqual = (i1, i2) => {
  if (!i1 && !i2) return true;

  if (!i1 || !i2) return false;

  return i1.updatedAt === i2.updatedAt;
};

export const isUrlValid = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)+' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return str && pattern.test(str);
};

export const stripHtml = (str) => str?.replace(/<[^>]*>?/gm, '');

export const paginationContentFilter = (items) =>
  items
    .filter((i) => i.type !== ITEM_TYPES.FOLDER)
    .filter((i) => !i.settings?.isPinned);
