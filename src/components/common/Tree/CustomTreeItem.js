/* This file is a copy of CustomTreeItem in graasp-ui.
  A lot of features have been stripped to accomodate the simple needs of hidden items. 
  The main goal is to add the ability to filter the item based on their tags. The Tree
  check for each element in the tree if it should be displayed (no hidden tag).
  This feature should be ported to graasp-ui. */

/* eslint-disable react/forbid-prop-types */
/* eslint-disable prefer-arrow-callback */
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { buildTreeItemClass } from '../../../config/selectors';
import { ITEM_TYPES } from '../../../enums';
import { hooks } from '../../../config/queryClient';
import { isHidden } from '../../../utils/item';

const { useItem, useItemTags, useItemsTags, useChildren } = hooks;

const LoadingTreeItem = <Skeleton variant="text" />;

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

const CustomTreeItem = ({ itemId, expandedItems = [], selectedId }) => {
  const { data: item, isLoading, isError } = useItem(itemId);
  const { data: tags, isLoading: isTagLoading } = useItemTags(itemId);
  const showItem =
    item && (!tags || tags.isEmpty() || (tags && !isHidden(tags.toJS())));
  const { data: children, isLoading: childrenIsLoading } = useChildren(itemId, {
    enabled: Boolean(
      item && showItem && item.get('type') === ITEM_TYPES.FOLDER,
    ),
  });
  const { data: childrenTags, isLoading: isChildrenTagsLoading } = useItemsTags(
    children?.map((child) => child.id).toJS(),
  );

  if (isLoading || isTagLoading) {
    return (
      <TreeItem
        ContentComponent={CustomContent}
        nodeId={`loading-${itemId}`}
        key={itemId}
        label={LoadingTreeItem}
      />
    );
  }
  if (!showItem || !item || isError) {
    return null;
  }

  const renderChildrenItems = () => {
    if (childrenIsLoading || isChildrenTagsLoading) {
      return LoadingTreeItem;
    }
    const filteredChildren = children?.filter(
      (_child, idx) => !isHidden(childrenTags?.get(idx)) && _child.type === "folder",
    );

    if (!filteredChildren?.size) {
      return null;
    }

    return filteredChildren.map(({ id: childId }) => (
      <CustomTreeItem
        key={childId}
        itemId={childId}
        expandedItems={expandedItems}
        selectedId={selectedId}
      />
    ));
  };

  const content = childrenIsLoading ? LoadingTreeItem : item.get('name');

  // recursive display of children
  return (
    <TreeItem
      ContentComponent={CustomContent}
      key={itemId}
      nodeId={itemId}
      label={content}
      className={buildTreeItemClass(itemId)}
    >
      {renderChildrenItems()}
    </TreeItem>
  );
};

CustomTreeItem.propTypes = {
  itemId: PropTypes.string.isRequired,
  expandedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedId: PropTypes.string.isRequired,
};

export default CustomTreeItem;