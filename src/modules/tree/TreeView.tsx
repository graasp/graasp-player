import React, { useState } from 'react';
import AccessibleTreeView, {
  INode,
  flattenTree,
} from 'react-accessible-treeview';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, Button, IconButton, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { deepPurple } from '@mui/material/colors';

import { DiscriminatedItem, Triggers, UUID } from '@graasp/sdk';

import { GRAASP_MENU_ITEMS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { SHOW_MORE_ITEMS_ID, buildTreeItemClass } from '@/config/selectors';
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

// Props here is passed from TreeView react-accessible-treeview component
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
  <Box
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...getNodeProps()}
    className={`${buildTreeItemClass(element.id as string)}`}
    display="flex"
    sx={{ alignItems: 'center' }}
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
        background: isSelected ? deepPurple[50] : 'none',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(element?.id as UUID)}
    >
      <FolderIcon fontSize="small" />
      {element.name}
    </Typography>
  </Box>
);

const TreeView = ({
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
      <AccessibleTreeView
        data={flattenTree({
          // here there's should be a root item for all children which basically gonna be an empty name
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
        aria-label={`${mainItem?.name} tree`}
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

export default TreeView;
