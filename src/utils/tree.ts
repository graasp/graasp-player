import {
  DiscriminatedItem,
  ItemType,
  UnionOfConst,
  getMimetype,
} from '@graasp/sdk';

import { getParentsIdsFromPath } from './item';

type ItemIdToDirectChildren = {
  [nodeId: string]: DiscriminatedItem[];
};

/**
 * build parent -> children map
 * items without parent are not in the map
 */
const createMapTree = (data: DiscriminatedItem[]): ItemIdToDirectChildren =>
  data.reduce<ItemIdToDirectChildren>((treeMap, elem) => {
    const parentIds = getParentsIdsFromPath(elem.path, { ignoreSelf: true });
    if (parentIds.length) {
      const lastParentId = parentIds[parentIds.length - 1];
      // eslint-disable-next-line no-param-reassign
      treeMap[lastParentId] = (treeMap[lastParentId] ?? []).concat([elem]);
    }
    return treeMap;
  }, {});

// we can't pass all the item as metadata because nested objects are currently not supported by the library.
// we expose the mimetype on the first level of metadata so it can be accessed and the icons of the files can be rendered
export type ItemMetaData = {
  type: UnionOfConst<typeof ItemType>;
  mimetype?: string;
};

type PartialItemWithChildren = {
  id: string;
  name: string;
  metadata: ItemMetaData;
} & {
  children?: PartialItemWithChildren[];
};

type TreeNode = {
  [nodeId: string]: PartialItemWithChildren;
};

// handle item children tree
const buildItemsTree = (
  data: DiscriminatedItem[],
  rootItems: DiscriminatedItem[],
) => {
  const tree: TreeNode = {};
  if (data.length === 1) {
    // this for non children one item as tree map build based on children to parent relation
    tree[data[0].id] = {
      id: data[0].id,
      name: data[0].name,
      metadata: { type: data[0].type, mimetype: getMimetype(data[0].extra) },
      children: [],
    };
  }
  const mapTree = createMapTree(data);

  const buildTree = (node: DiscriminatedItem) => {
    if (node.type === ItemType.FOLDER && mapTree[node.id]) {
      // sort by children order or default to all if not defined
      const children = node.extra.folder?.childrenOrder?.length
        ? (node.extra.folder.childrenOrder
            .map((id) =>
              mapTree[node.id].find(({ id: childId }) => childId === id),
            )
            .filter(Boolean) as DiscriminatedItem[])
        : mapTree[node.id];

      const entry: PartialItemWithChildren = {
        id: node.id,
        name: node.name,
        metadata: { type: node.type },
        children: children.map((child) => buildTree(child)),
      };
      return entry;
    }
    // root items are not in the map
    return {
      id: node.id,
      name: node.name,
      metadata: {
        type: node.type,
        mimetype: getMimetype(node.extra),
      },
    };
  };

  rootItems.forEach((ele) => {
    tree[ele.id] = buildTree(ele);
  });

  return tree;
};

// eslint-disable-next-line import/prefer-default-export
export const getItemTree = (
  data: DiscriminatedItem[],
  rootItems: DiscriminatedItem[],
): TreeNode => {
  const res = data.filter((ele) => ele.type === ItemType.FOLDER);
  const rootItemTree = buildItemsTree(res, rootItems);
  return rootItemTree;
};
