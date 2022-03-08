/* This file is a copy of DynamicTreeView in graasp-ui.
  A lot of features have been stripped to accomodate the simple needs of hidden items. 
  The main goal is to add the ability to filter the item based on their tags. The Tree
  check for each element in the tree if it should be displayed (no hidden tag).
  This feature should be ported to graasp-ui. */

/* eslint-disable react/forbid-prop-types */
/* eslint-disable prefer-arrow-callback */
import React, { useState } from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import CustomTreeItem from './CustomTreeItem';

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

CustomContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  displayIcon: PropTypes.node.isRequired,
  expansionIcon: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.node.isRequired,
  nodeId: PropTypes.string.isRequired,
};

const DynamicTreeView = ({
  id,
  rootLabel,
  rootId,
  initialExpendedItems = [],
  items,
  selectedId,
  onTreeItemSelect,
}) => {
  const [expandedItems, setExpandedItems] = useState(initialExpendedItems);

  // types based on TreeView types
  const onSelect = (_event, value) => onTreeItemSelect?.(value);

  // types based on TreeView types
  const onToggle = (_event, nodeIds) => setExpandedItems(nodeIds);

  // show only folder items in the navigation tree
  const itemsFiltered = items.filter(item => item.type === "folder");

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
      <TreeItem ContentComponent={CustomContent} nodeId={rootId} label={rootLabel}>
        {itemsFiltered.map(({ id: itemId }) => (
          <CustomTreeItem
            key={itemId}
            itemId={itemId}
            expandedItems={expandedItems}
            selectedId={selectedId}
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
};

export default DynamicTreeView;
