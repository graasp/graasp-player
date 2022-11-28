/* This file is a copy of CustomTreeItem in graasp-ui.
  A lot of features have been stripped to accomodate the simple needs of hidden items. 
  The main goal is to add the ability to filter the item based on their tags. The Tree
  check for each element in the tree if it should be displayed (no hidden tag).
  This feature should be ported to graasp-ui. */
import { Record } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import TreeItem from '@mui/lab/TreeItem';
import Skeleton from '@mui/material/Skeleton';

import { GRAASP_MENU_ITEMS } from '../../../config/constants';
import { hooks } from '../../../config/queryClient';
import { buildTreeItemClass } from '../../../config/selectors';
import { ITEM_TYPES } from '../../../enums';
import { isHidden } from '../../../utils/item';
import CustomContentTree from './CustomContentTree';
import CustomLabel from './CustomLabel';
import CustomTreeShortcutItem from './CustomTreeShortcutItem';

const { useItem, useItemTags, useItemsTags, useChildren } = hooks;

const LoadingTreeItem = <Skeleton variant="text" />;

const CustomTreeItem = ({ itemProp, expandedItems = [], selectedId }) => {
  const itemId =
    itemProp.type === ITEM_TYPES.SHORTCUT && itemProp.extra?.shortcut?.target
      ? itemProp.extra?.shortcut?.target
      : itemProp.id;

  const { data: item, isLoading, isError } = useItem(itemId);
  const { data: tags, isLoading: isTagLoading } = useItemTags(itemId);
  const showItem =
    item && (!tags || tags.isEmpty() || (tags && !isHidden(tags.toJS())));
  const { data: children, isLoading: childrenIsLoading } = useChildren(itemId, {
    enabled: Boolean(
      item &&
        showItem &&
        item.type === ITEM_TYPES.FOLDER &&
        itemProp.type === ITEM_TYPES.FOLDER,
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

  if (item.type !== ITEM_TYPES.FOLDER) {
    return null;
  }

  const renderChildrenItems = () => {
    if (childrenIsLoading || isChildrenTagsLoading) {
      return LoadingTreeItem;
    }
    const filteredChildren = children?.filter(
      (child, idx) =>
        !isHidden(childrenTags?.get(idx)) &&
        GRAASP_MENU_ITEMS.includes(child.type),
    );

    if (!filteredChildren?.size) {
      return null;
    }

    return filteredChildren.map((childItem) => (
      <CustomTreeItem
        key={childItem.id}
        expandedItems={expandedItems}
        selectedId={selectedId}
        itemProp={childItem}
      />
    ));
  };

  const content = childrenIsLoading ? (
    LoadingTreeItem
  ) : (
    <CustomLabel extra={item.extra} type={item.type} text={item.name} />
  );

  // render CustomTreeShortcutItem when original item is a shortcut
  if (itemProp.type === ITEM_TYPES.SHORTCUT) {
    return <CustomTreeShortcutItem itemId={itemId} content={content} />;
  }

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
  expandedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedId: PropTypes.string.isRequired,
  itemProp: PropTypes.instanceOf(Record).isRequired,
};

export default CustomTreeItem;
