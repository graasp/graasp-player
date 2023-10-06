import React, { useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeView from '@mui/lab/TreeView';
import { Box, Button, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { DiscriminatedItem, Triggers } from '@graasp/sdk';

import { GRAASP_MENU_ITEMS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { SHOW_MORE_ITEMS_ID } from '@/config/selectors';

import CustomTreeItem from './CustomTreeItem';

const MAX_NUM_ITEMS = 10;

type Props = {
  id: string;
  header?: string;
  items?: DiscriminatedItem[];
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
  const { mutate: triggerAction } = mutations.usePostItemAction();

  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  // types based on TreeView types
  const onSelect = (_event: unknown, value: string) => {
    // trigger player Action for item view
    triggerAction({ itemId: value, payload: { type: Triggers.ItemView } });

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
    showAll ? itemsToShow?.length : MAX_NUM_ITEMS,
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
      {shownItems &&
        itemsToShow &&
        shownItems?.length < itemsToShow?.length && (
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
