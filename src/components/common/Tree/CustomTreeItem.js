/* This file is a copy of CustomTreeItem in graasp-ui.
  A lot of features have been stripped to accomodate the simple needs of hidden items. 
  The main goal is to add the ability to filter the item based on their tags. The Tree
  check for each element in the tree if it should be displayed (no hidden tag).
  This feature should be ported to graasp-ui. */
import PropTypes from 'prop-types';
import React from 'react';

import Skeleton from '@material-ui/lab/Skeleton';

import TreeItem from '@mui/lab/TreeItem';

import { hooks } from '../../../config/queryClient';
import { buildTreeItemClass } from '../../../config/selectors';
import { ITEM_TYPES } from '../../../enums';
import { isHidden } from '../../../utils/item';
import CustomContentTree from './CustomContentTree';

const { useItem, useItemTags, useItemsTags, useChildren } = hooks;

const LoadingTreeItem = <Skeleton variant="text" />;

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
        ContentComponent={CustomContentTree}
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
      (child, idx) =>
        !isHidden(childrenTags?.get(idx)) && child.type === ITEM_TYPES.FOLDER,
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
      ContentComponent={CustomContentTree}
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
