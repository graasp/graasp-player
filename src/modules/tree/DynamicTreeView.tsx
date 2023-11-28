import React, { useState } from 'react';
import TreeView, { INode, flattenTree } from 'react-accessible-treeview';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, Button, IconButton, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { DiscriminatedItem, Triggers } from '@graasp/sdk';

import { UUID } from 'crypto';

import { GRAASP_MENU_ITEMS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { SHOW_MORE_ITEMS_ID } from '@/config/selectors';
import { getNodeTree } from '@/utils/item';

import './style.css';

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
  mainItem?: DiscriminatedItem;
};

interface NodeProps {
  element: INode;
  isBranch: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNodeProps: () => any;
  onSelect: (id: UUID) => void;
}
const RenderedNode = ({
  element,
  isBranch,
  isExpanded,
  getNodeProps,
  onSelect,
  isSelected,
}: NodeProps) => (
  <button
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...getNodeProps()}
    className="flex-center"
    type="button"
  >
    {isBranch &&
      (isExpanded ? (
        <IconButton sx={{ padding: 0 }}>
          <ExpandMoreIcon />
        </IconButton>
      ) : (
        <IconButton sx={{ padding: 0 }}>
          <ChevronRightIcon />
        </IconButton>
      ))}
    <Typography
      component="button"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: isSelected ? '#e0e2e2' : 'none',
      }}
      onClick={() => onSelect(element?.id as UUID)}
    >
      <FolderIcon fontSize="small" />
      {element.name}
    </Typography>
  </button>
);

const DynamicTreeView = ({
  id,
  header,
  items,
  onTreeItemSelect,
  isLoading = false,
  onlyShowContainerItems = true,
  mainItem,
}: Props): JSX.Element => {
  const [showAll, setShowAll] = useState(false);
  const { mutate: triggerAction } = mutations.usePostItemAction();

  const itemsToShow = items?.filter((item) =>
    onlyShowContainerItems ? GRAASP_MENU_ITEMS.includes(item.type) : true,
  );

  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  // types based on TreeView types
  const onSelect = (_event: unknown, value: string) => {
    // trigger player Action for item view
    triggerAction({ itemId: value, payload: { type: Triggers.ItemView } });

    onTreeItemSelect?.(value);
  };

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
        data={flattenTree({
          name: '',
          children: mainItem
            ? [
                {
                  name: mainItem?.name,
                  children: getNodeTree(itemsToShow || []),
                  id: mainItem.id,
                },
              ]
            : itemsToShow,
        })}
        aria-label="directory tree"
        // eslint-disable-next-line react/no-unstable-nested-components
        nodeRenderer={(props) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <RenderedNode {...props} onSelect={onSelect} />
        )}
      />

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
