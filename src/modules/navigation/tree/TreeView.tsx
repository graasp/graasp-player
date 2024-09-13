import AccessibleTreeView, {
  INode,
  INodeRendererProps,
  flattenTree,
} from 'react-accessible-treeview';
import { useParams } from 'react-router-dom';

import { Box, SxProps, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  ItemType,
  UnionOfConst,
  getIdsFromPath,
} from '@graasp/sdk';

import { ErrorBoundary } from '@sentry/react';

import { GRAASP_MENU_ITEMS } from '@/config/constants';
import { ItemMetaData, getItemTree } from '@/utils/tree';

import Node from './Node';
import TreeErrorBoundary from './TreeErrorBoundary';

type Props = {
  id: string;
  header?: string;
  rootItems: DiscriminatedItem[];
  items?: DiscriminatedItem[];
  onTreeItemSelect?: (value: string) => void;
  onlyShowContainerItems?: boolean;
  firstLevelStyle?: object;
  sx?: SxProps;
};

const TreeView = ({
  id,
  header,
  items,
  rootItems,
  onTreeItemSelect,
  onlyShowContainerItems = true,
  firstLevelStyle,
  sx = {},
}: Props): JSX.Element => {
  const { itemId } = useParams();
  const itemsToShow = items?.filter((item) =>
    onlyShowContainerItems ? GRAASP_MENU_ITEMS.includes(item.type) : true,
  );
  const focusedItem = itemsToShow?.find((i) => i.id === itemId);

  // types based on TreeView types
  const onSelect = (value: string) => {
    onTreeItemSelect?.(value);
  };

  const nodeRenderer = ({
    element,
    getNodeProps,
    isBranch,
    isSelected,
    isExpanded,
    level,
  }: INodeRendererProps) => (
    <Node
      element={element as INode<ItemMetaData>}
      getNodeProps={getNodeProps}
      isBranch={isBranch}
      isSelected={isSelected}
      isExpanded={isExpanded}
      level={level}
      firstLevelStyle={firstLevelStyle}
      onSelect={onSelect}
    />
  );

  const itemTree = getItemTree(itemsToShow ?? [], rootItems);
  const tree = Object.values(itemTree);

  const defaultExpandedIds = rootItems[0]?.id ? [rootItems[0].id] : [];

  const selectedIds = itemId ? [itemId] : [];
  const expandedIds = focusedItem
    ? getIdsFromPath(focusedItem.path)
    : defaultExpandedIds;

  // need to filter the expandedIds to only include items that are present in the tree
  // we should not include parents that are above the current player root
  const availableItemIds = itemsToShow?.map(({ id: elemId }) => elemId);
  // filter the items to expand to only keep the ones that are present in the tree.
  // if there are no items in the tree we short circuit the filtering
  const accessibleExpandedItems = availableItemIds?.length
    ? expandedIds.filter((e) => availableItemIds?.includes(e))
    : [];

  return (
    <ErrorBoundary fallback={<TreeErrorBoundary />}>
      <Box
        id={id}
        sx={{
          ml: -1,
          '.tree, .tree-node, .tree-node-group': {
            listStyle: 'none',
            paddingInlineStart: 'unset',
            paddingLeft: '17px',
          },
          ...sx,
        }}
      >
        {header && (
          <Typography sx={{ ml: 2, fontWeight: 'bold' }} variant="body1">
            {header}
          </Typography>
        )}
        <AccessibleTreeView
          defaultExpandedIds={defaultExpandedIds}
          data={flattenTree<{ type: UnionOfConst<typeof ItemType> }>({
            // here there should be a root item for all children which basically is gonna be an empty name
            name: '',
            children: tree,
          })}
          nodeRenderer={nodeRenderer}
          selectedIds={selectedIds}
          expandedIds={accessibleExpandedItems}
        />
      </Box>
    </ErrorBoundary>
  );
};

export default TreeView;
