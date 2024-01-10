import { DiscriminatedItem, ItemTag, ItemTagType, ItemType } from '@graasp/sdk';

export const getParentsIdsFromPath = (
  path: string,
  { ignoreSelf = false } = {},
): string[] => {
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

export const isError = (error?: { statusCode: number }): boolean =>
  Boolean(error?.statusCode);

/**
 * Check that an item is hidden (or one of his parents)
 * @param item Item to check for
 * @param tags a list of item tags
 * @param options an object that may contain the `exactPath` option. In case that option is enabled (true)
 * the paths are checked for equality instead of simply ancestry (default)
 * @returns
 */
export const isHidden = (
  item: DiscriminatedItem,
  tags?: ItemTag[] | { statusCode: number },
  option?: { exactPath: boolean },
): boolean => {
  // if there are not tags then the item is not hidden
  if (!tags) {
    return false;
  }
  // tags might have failed to be fetched and is an error
  if ('statusCode' in tags && isError(tags)) {
    return false;
  }
  if (Array.isArray(tags)) {
    const hiddenTags = tags?.filter(({ type }) => type === ItemTagType.Hidden);
    if (option?.exactPath) {
      return hiddenTags?.some((t) => item.path === t.item.path);
    }
    // check if some item start with the path of the parent
    return hiddenTags?.some((t) => item.path.startsWith(t.item.path));
  }
  // fallback to not hidden
  return false;
};

export const stripHtml = (str?: string | null): string | undefined =>
  str?.replace(/<[^>]*>?/gm, '');

export const paginationContentFilter = (
  items: DiscriminatedItem[],
): DiscriminatedItem[] =>
  items
    .filter((i) => i.type !== ItemType.FOLDER)
    .filter((i) => !i.settings?.isPinned);
