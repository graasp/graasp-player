/* This file is a copy of CustomTreeItem in graasp-ui.
  A lot of features have been stripped to accomodate the simple needs of hidden items.
  The main goal is to add the ability to filter the item based on their tags. The Tree
  check for each element in the tree if it should be displayed (no hidden tag).
  This feature should be ported to graasp-ui. */
import TreeItem from '@mui/lab/TreeItem';
import Skeleton from '@mui/material/Skeleton';

import { ItemType, getShortcutExtra } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { GRAASP_MENU_ITEMS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { buildTreeItemClass } from '@/config/selectors';
import { isHidden } from '@/utils/item';

import HiddenWrapper from '../common/HiddenWrapper';
import CustomContentTree from './CustomContentTree';
import CustomLabel from './CustomLabel';
import CustomTreeShortcutItem from './CustomTreeShortcutItem';

const { useItem, useItemTags, useChildren } = hooks;

const LoadingTreeItem = <Skeleton variant="text" />;

type Props = {
  itemProp: ItemRecord;
  expandedItems?: string[];
  selectedId?: string;
};

const CustomTreeItem = ({
  itemProp,
  expandedItems = [],
  selectedId,
}: Props): JSX.Element | null => {
  // define which item to
  let itemId = itemProp.id;
  if (itemProp.type === ItemType.SHORTCUT) {
    const itemTarget = getShortcutExtra(itemProp.extra)?.target;
    if (itemTarget) {
      itemId = itemTarget;
    }
  }

  const { data: item, isLoading, isError } = useItem(itemId);
  const { data: tags, isLoading: isTagLoading } = useItemTags(itemId);

  const { data: children, isLoading: childrenIsLoading } = useChildren(itemId, {
    enabled: Boolean(
      item &&
        item.type === ItemType.FOLDER &&
        itemProp.type === ItemType.FOLDER,
    ),
  });

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
  if (!item || isError) {
    return null;
  }

  const renderChildrenItems = () => {
    if (childrenIsLoading) {
      return LoadingTreeItem;
    }
    const filteredChildren = children?.filter((child) =>
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
  if (itemProp.type === ItemType.SHORTCUT) {
    return <CustomTreeShortcutItem itemId={itemId} content={content} />;
  }

  // recursive display of children
  return (
    <HiddenWrapper
      itemId={itemId}
      hidden={isHidden(item, tags, { exactPath: false })}
    >
      <TreeItem
        ContentComponent={CustomContentTree}
        key={itemId}
        nodeId={itemId}
        label={content}
        className={buildTreeItemClass(itemId)}
      >
        {renderChildrenItems()}
      </TreeItem>
    </HiddenWrapper>
  );
};

export default CustomTreeItem;
