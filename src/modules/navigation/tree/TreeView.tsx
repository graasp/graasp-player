import AccessibleTreeView, {
  INode,
  INodeRendererProps,
  flattenTree,
} from 'react-accessible-treeview';

import { Box, SxProps, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import {
  ActionTriggers,
  DiscriminatedItem,
  ItemType,
  UnionOfConst,
  getIdsFromPath,
} from '@graasp/sdk';

import { GRAASP_MENU_ITEMS } from '@/config/constants';
import { hooks, mutations } from '@/config/queryClient';
import { useItemContext } from '@/contexts/ItemContext';
import { ItemMetaData, getItemTree } from '@/utils/tree';

import Node from './Node';

type Props = {
  id: string;
  header?: string;
  rootItems: DiscriminatedItem[];
  items?: DiscriminatedItem[];
  onTreeItemSelect?: (value: string) => void;
  isLoading?: boolean;
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
  isLoading = false,
  onlyShowContainerItems = true,
  firstLevelStyle,
  sx = {},
}: Props): JSX.Element => {
  const { mutate: triggerAction } = mutations.usePostItemAction();

  const itemsToShow = items?.filter((item) =>
    onlyShowContainerItems ? GRAASP_MENU_ITEMS.includes(item.type) : true,
  );

  const { focusedItemId } = useItemContext();

  const { data: focusedItem } = hooks.useItem(focusedItemId);

  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  // types based on TreeView types
  const onSelect = (value: string) => {
    // trigger player Action for item view
    triggerAction({
      itemId: value,
      payload: { type: ActionTriggers.ItemView },
    });

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

  const selectedIds = focusedItemId ? [focusedItemId] : [];
  const expandedIds = focusedItem
    ? getIdsFromPath(focusedItem.path)
    : defaultExpandedIds;

  // need to filter the expandedIds to only include items that are present in the tree
  // we should not include parents that are above the current player root
  const availableItemIds = itemsToShow?.map(({ id: itemId }) => itemId);
  // filter the items to expand to only keep the ones that are present in the tree.
  // if there are no items in the tree we short circuit the filtering
  const accessibleExpandedItems = availableItemIds?.length
    ? expandedIds.filter((e) => availableItemIds?.includes(e))
    : [];

  return (
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
  );
};

export default TreeView;
