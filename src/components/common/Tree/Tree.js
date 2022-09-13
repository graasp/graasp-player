/* This file is a copy of DynamicTreeView in graasp-ui.
  A lot of features have been stripped to accomodate the simple needs of hidden items. 
  The main goal is to add the ability to filter the item based on their tags. The Tree
  check for each element in the tree if it should be displayed (no hidden tag).
  This feature should be ported to graasp-ui. */
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Skeleton } from '@material-ui/lab';

import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';

import { GRAASP_MENU_ITEMS } from '../../../config/constants';
import CustomContentTree from './CustomContentTree';
import CustomTreeItem from './CustomTreeItem';

const DynamicTreeView = ({
  id,
  rootLabel,
  rootId,
  initialExpendedItems = [],
  items,
  selectedId,
  onTreeItemSelect,
  isLoading,
}) => {
  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  const [expandedItems, setExpandedItems] = useState(initialExpendedItems);

  // types based on TreeView types
  const onSelect = (_event, value) => onTreeItemSelect?.(value);

  // types based on TreeView types
  const onToggle = (_event, nodeIds) => setExpandedItems(nodeIds);

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
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultSelected={rootId}
    >
      <TreeItem
        ContentComponent={CustomContentTree}
        nodeId={rootId}
        label={rootLabel}
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

DynamicTreeView.propTypes = {
  id: PropTypes.string.isRequired,
  rootLabel: PropTypes.string.isRequired,
  rootId: PropTypes.string.isRequired,
  items: PropTypes.any.isRequired,
  initialExpendedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedId: PropTypes.string.isRequired,
  onTreeItemSelect: PropTypes.any.isRequired,
  isLoading: PropTypes.bool,
};

export default DynamicTreeView;
