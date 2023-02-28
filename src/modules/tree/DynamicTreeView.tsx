/* This file is a copy of DynamicTreeView in graasp-ui.
  A lot of features have been stripped to accomodate the simple needs of hidden items.
  The main goal is to add the ability to filter the item based on their tags. The Tree
  check for each element in the tree if it should be displayed (no hidden tag).
  This feature should be ported to graasp-ui. */
import React, { useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import Skeleton from '@mui/material/Skeleton';

import { ItemType } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { GRAASP_MENU_ITEMS } from '@/config/constants';

import CustomContentTree from './CustomContentTree';
import CustomLabel from './CustomLabel';
import CustomTreeItem from './CustomTreeItem';

type Props = {
  id: string;
  rootLabel?: string;
  rootId: string;
  rootExtra?: ItemRecord['extra'];
  rootType?: `${ItemType}`;
  items: List<ItemRecord>;
  initialExpendedItems: string[];
  selectedId?: string;
  onTreeItemSelect?: (value: string) => void;
  isLoading?: boolean;
};

const DynamicTreeView = ({
  id,
  rootLabel = '',
  rootId,
  rootExtra,
  rootType = ItemType.FOLDER,
  initialExpendedItems = [],
  items,
  selectedId,
  onTreeItemSelect,
  isLoading = false,
}: Props): JSX.Element => {
  const [expandedItems, setExpandedItems] = useState(initialExpendedItems);

  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  // types based on TreeView types
  const onSelect = (_event: unknown, value: string) =>
    onTreeItemSelect?.(value);

  // types based on TreeView types
  const onToggle = (_event: unknown, nodeIds: string[]) =>
    setExpandedItems(nodeIds);

  // show only folder items in the navigation tree
  const itemsFiltered = items.filter((item) =>
    GRAASP_MENU_ITEMS.includes(item.type),
  );

  return (
    <TreeView
      id={id}
      onNodeSelect={onSelect}
      onNodeToggle={onToggle}
      expanded={expandedItems}
      aria-label="icon expansion"
      defaultCollapseIcon={<ExpandMoreIcon sx={{ mt: 0.4 }} />}
      defaultExpandIcon={<ChevronRightIcon sx={{ mt: 0.4 }} />}
      defaultSelected={rootId}
    >
      <TreeItem
        ContentComponent={CustomContentTree}
        nodeId={rootId}
        label={
          <CustomLabel type={rootType} extra={rootExtra} text={rootLabel} />
        }
      >
        {itemsFiltered.map((item) => (
          <CustomTreeItem
            key={item.id}
            expandedItems={expandedItems}
            selectedId={selectedId}
            itemProp={item}
          />
        ))}
      </TreeItem>
    </TreeView>
  );
};

export default DynamicTreeView;
