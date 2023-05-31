import React, { useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeView from '@mui/lab/TreeView';
import { Box, Button, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { ItemRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { GRAASP_MENU_ITEMS } from '@/config/constants';
import { SHOW_MORE_ITEMS_ID } from '@/config/selectors';

import CustomTreeItem from './CustomTreeItem';

const MAX_NUM_ITEMS = 10;

type Props = {
  id: string;
  header?: string;
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

  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  // types based on TreeView types
  const onSelect = (_event: unknown, value: string) => {
    onTreeItemSelect?.(value);
  };

  // types based on TreeView types
  const onToggle = (_event: unknown, nodeIds: string[]) =>
    setExpandedItems(nodeIds);

  const itemsToShow = items?.filter((item) =>
    onlyShowContainerItems ? GRAASP_MENU_ITEMS.includes(item.type) : true,
  );
  const shownItems = itemsToShow?.slice(
    0,
    showAll ? itemsToShow?.size : MAX_NUM_ITEMS,
  );

  return (
    <Box id={id}>
      {header && (
        <Typography sx={{ ml: 2 }} variant="body1">
          {header}
        </Typography>
      )}
      <TreeView
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
      </TreeView>
      {shownItems && itemsToShow && shownItems?.size < itemsToShow?.size && (
        <Button
          id={SHOW_MORE_ITEMS_ID}
          sx={{ ml: 2 }}
          onClick={() => setShowAll(true)}
          size="small"
        >
          Show More...
        </Button>
      )}
    </Box>
  );
};

export default DynamicTreeView;
