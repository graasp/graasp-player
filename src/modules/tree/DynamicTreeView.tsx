import React, { useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeItem } from '@mui/lab';
import TreeView from '@mui/lab/TreeView';
import { Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { ItemRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { GRAASP_MENU_ITEMS } from '@/config/constants';

import CustomTreeItem from './CustomTreeItem';

const MAX_NUM_ITEMS = 5;
const SHOW_MORE_NODE = 'show-more';

type Props = {
  id: string;
  header: string;
  items?: List<ItemRecord>;
  initialExpendedItems?: string[];
  selectedId?: string;
  onTreeItemSelect?: (value: string) => void;
  isLoading?: boolean;
  onlyShowContainerItems?: boolean;
};

const DynamicTreeView = ({
  id,
  header,
  items,
  initialExpendedItems = [],
  selectedId,
  onTreeItemSelect,
  isLoading = false,
  onlyShowContainerItems = true,
}: Props): JSX.Element => {
  const [expandedItems, setExpandedItems] = useState(initialExpendedItems);
  const [showAll, setShowAll] = useState(false);

  // const {
  //   data: children,
  //   isLoading: isLoadingChildren,
  //   isError: isErrorChildren,
  // } = useDescendants(rootId, {
  //   enabled: isFolder,
  //   getUpdates: isFolder,
  // });

  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  // types based on TreeView types
  const onSelect = (_event: unknown, value: string) => {
    if (value === SHOW_MORE_NODE) {
      setShowAll(true);
    } else {
      onTreeItemSelect?.(value);
    }
  };

  // types based on TreeView types
  const onToggle = (_event: unknown, nodeIds: string[]) =>
    setExpandedItems(nodeIds);

  // show only folder items in the navigation tree
  // const itemsFiltered = items?.filter((item) =>
  //   GRAASP_MENU_ITEMS.includes(item.type),
  // );

  const itemsToShow = items?.filter((item) =>
    onlyShowContainerItems ? GRAASP_MENU_ITEMS.includes(item.type) : true,
  );
  const shownItems = itemsToShow?.slice(
    0,
    showAll ? itemsToShow?.size : MAX_NUM_ITEMS,
  );

  return (
    <>
      <Typography sx={{ ml: 2 }} variant="body1">
        {header}
      </Typography>
      <TreeView
        id={id}
        onNodeSelect={onSelect}
        onNodeToggle={onToggle}
        expanded={expandedItems}
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon sx={{ mt: 0.4 }} />}
        defaultExpandIcon={<ChevronRightIcon sx={{ mt: 0.4 }} />}
      >
        {shownItems?.map((item) => (
          <CustomTreeItem
            key={item.id}
            expandedItems={expandedItems}
            selectedId={selectedId}
            itemProp={item}
          />
        ))}
        {shownItems && itemsToShow && shownItems?.size < itemsToShow?.size && (
          <TreeItem
            sx={{ opacity: 0.5 }}
            label="Show More..."
            nodeId={SHOW_MORE_NODE}
          />
        )}
      </TreeView>
    </>
  );
};

export default DynamicTreeView;
