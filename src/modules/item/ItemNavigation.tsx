import { useParams } from 'react-router';

import { Alert } from '@mui/material';

import { ItemType } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';
import { MainMenu } from '@graasp/ui';

import { List } from 'immutable';

import { useMessagesTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { MAIN_MENU_ID, TREE_VIEW_ID } from '@/config/selectors';
import { useItemContext } from '@/contexts/ItemContext';
import DynamicTreeView from '@/modules/tree/DynamicTreeView';

const { useItem, useChildren } = hooks;

const ItemNavigation = (): JSX.Element | null => {
  const { rootId } = useParams();
  const { t: translateMessage } = useMessagesTranslation();
  const { setFocusedItemId, focusedItemId } = useItemContext();

  const {
    data: rootItem,
    isLoading: rootItemIsLoading,
    isError: rootItemIsError,
  } = useItem(rootId);

  const isFolder = Boolean(rootItem && rootItem.type === ItemType.FOLDER);
  const {
    data: children,
    isLoading,
    isError: childrenIsError,
  } = useChildren(rootId, {
    enabled: isFolder,
    getUpdates: isFolder,
  });

  // display nothing when no item is defined
  if (!rootId) {
    return null;
  }

  if (childrenIsError || rootItemIsError) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }

  return (
    <MainMenu id={MAIN_MENU_ID}>
      {/* todo: add styles to tree */}
      <div style={{ height: 10 }} />
      <DynamicTreeView
        id={TREE_VIEW_ID}
        rootLabel={rootItem?.name}
        rootId={rootId}
        rootType={rootItem?.type}
        rootExtra={rootItem?.extra}
        initialExpendedItems={[rootId]}
        selectedId={focusedItemId}
        onTreeItemSelect={(payload) => {
          setFocusedItemId(payload);
        }}
        items={children && !children.isEmpty() ? children : List()}
        isLoading={isLoading || rootItemIsLoading}
      />
    </MainMenu>
  );
};

export default ItemNavigation;
