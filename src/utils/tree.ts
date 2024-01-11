import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { getParentsIdsFromPath } from './item';

interface ItemIdToDirectChildren {
  [nodeId: string]: DiscriminatedItem[];
}

/**
 * build parent -> children map
 * items without parent are not in the map
 */
const createMapTree = (data: DiscriminatedItem[]) => {
  const childrenTreeMap: ItemIdToDirectChildren = {};
  // eslint-disable-next-line no-plusplus, no-restricted-syntax
  for (const ele of data) {
    const parentIds = getParentsIdsFromPath(ele.path, { ignoreSelf: true });
    if (parentIds.length) {
      const lastParentId = parentIds[parentIds.length - 1];

      childrenTreeMap[lastParentId] = (
        childrenTreeMap[lastParentId] ?? []
      ).concat([ele]);
    }
  }
  return childrenTreeMap;
};

type PartialItemWithChildren = { id: string; name: string } & {
  children?: PartialItemWithChildren[];
};

interface TreeNode {
  [nodeId: string]: PartialItemWithChildren;
}

// handle item children tree
const buildItemsTree = (
  data: DiscriminatedItem[],
  rootItems: DiscriminatedItem[],
) => {
  const tree: TreeNode = {};
  if (data.length === 1) {
    // this for non children one item as tree map build based on children to parent relation
    tree[data[0].id] = { id: data[0].id, name: data[0].name, children: [] };
  }
  const mapTree = createMapTree(data);

  const buildTree = (node: DiscriminatedItem) => {
    if (node.type === ItemType.FOLDER && mapTree[node.id]) {
      // sort by children order or default to all if not defined
      const children = node.extra.folder.childrenOrder?.length
        ? (node.extra.folder.childrenOrder
            .map((id) =>
              mapTree[node.id].find(({ id: childId }) => childId === id),
            )
            .filter(Boolean) as DiscriminatedItem[])
        : mapTree[node.id];

      const entry: PartialItemWithChildren = {
        id: node.id,
        name: node.name,
        children: children.map((child) => buildTree(child)),
      };
      return entry;
    }
    // root items are not in the map
    return { id: node.id, name: node.name };
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
