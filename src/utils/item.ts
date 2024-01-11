import { DiscriminatedItem, ItemTag, ItemTagType, ItemType } from '@graasp/sdk';

/**
 * @deprecated
 */
export const transformIdForPath = (id: string): string =>
  // eslint-disable-next-line no-useless-escape
  id.replace(/\-/g, '_');

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

export const buildPath = ({
  prefix,
  ids,
}: {
  prefix: string;
  ids: string[];
}): string => `${prefix}${ids.map((id) => transformIdForPath(id)).join('.')}`;

// export const getItemById = (items: , id) =>
//   items.find(({ id: thisId }) => id === thisId);

// export const getItemsById = (items, ids) =>
//   items.filter(({ id: thisId }) => ids.includes(thisId));

// export const getDirectParentId = (path) => {
//   const ids = getParentsIdsFromPath(path);
//   const parentIdx = ids.length - 2;
//   if (parentIdx < 0) {
//     return null;
//   }
//   return ids[parentIdx];
// };

// export const isChild = (id) => {
//   const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
//   return ({ path }) => path.match(reg);
// };

// export const getChildren = (items, id) => items.filter(isChild(id));

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

export const areItemsEqual = (
  i1: DiscriminatedItem,
  i2: DiscriminatedItem,
): boolean => {
  if (!i1 && !i2) return true;

  if (!i1 || !i2) return false;

  return i1.updatedAt === i2.updatedAt;
};

export const isUrlValid = (str: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)+' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return Boolean(str && pattern.test(str));
};

export const stripHtml = (str?: string | null): string | undefined =>
  str?.replace(/<[^>]*>?/gm, '');

export const paginationContentFilter = (
  items: DiscriminatedItem[],
): DiscriminatedItem[] =>
  items
    .filter((i) => i.type !== ItemType.FOLDER)
    .filter((i) => !i.settings?.isPinned);

interface Node {
  children: string[];
}

interface Tree {
  [nodeId: string]: Node;
}

const createMapTree = (data: DiscriminatedItem[]) => {
  const childrenTreeMap: Tree = {};
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    const ele = data[i];
    const parents = getParentsIdsFromPath(ele.path, { ignoreSelf: true });
    const lastParent = parents[parents.length - 1];
    if (lastParent) {
      if (childrenTreeMap[lastParent]) {
        childrenTreeMap[lastParent].children = [
          ...childrenTreeMap[lastParent].children,
          ele.id,
        ];
      } else {
        childrenTreeMap[lastParent] = { children: [ele.id] };
      }
    }
  }
  return childrenTreeMap;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemWithChildren = any;

interface TreeNode {
  [nodeId: string]: ItemWithChildren;
}

// handle item children tree
const buildItemsTree = (data: DiscriminatedItem[]) => {
  const tree: TreeNode = {};
  if (data.length === 1) {
    tree[data[0].id] = { ...data[0], children: [] };
  }
  const mapTree: Tree = createMapTree(data);
  const keys = Object.keys(mapTree);
  const allChildren: string[] = keys.reduce((acc: string[], key: string) => {
    const node = mapTree[key as keyof Tree];
    if (node && node.children) {
      acc.push(...node.children);
    }
    return acc;
  }, []);
  const rootKeys = keys.filter((key) => !allChildren.includes(key));

  const buildTree = (nodeId: string) => {
    const node = data.find((ele) => ele.id === nodeId);
    if (mapTree[nodeId]) {
      if (node) {
        (node as ItemWithChildren).children = mapTree[nodeId].children.map(
          (childId) => buildTree(childId),
        );
      }
    }
    return node;
  };

  rootKeys.forEach((ele) => {
    tree[ele] = buildTree(ele);
  });

  return tree;
};

export const getNodeTree = (
  data: (DiscriminatedItem & { name: string })[],
): TreeNode => {
  const res = data.filter((ele) => ele.type === ItemType.FOLDER);

  const rootItemTree = buildItemsTree(res);
  return rootItemTree;
};
