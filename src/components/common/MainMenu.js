import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { Alert } from '@mui/material';

import { MainMenu as GraaspMainMenu } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import { MAIN_MENU_ID, TREE_VIEW_ID } from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import { ItemContext } from '../context/ItemContext';
import DynamicTreeView from './Tree/Tree';

const { useItem, useChildren } = hooks;

const MainMenu = () => {
  const { rootId } = useParams();
  const { t } = useTranslation();
  const { setFocusedItemId, focusedItemId } = useContext(ItemContext);

  const {
    data: rootItem,
    isLoading: rootItemIsLoading,
    isError: rootItemIsError,
  } = useItem(rootId);

  const isFolder = Boolean(rootItem && rootItem.type === ITEM_TYPES.FOLDER);
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
    return <Alert severity="error">{t('An unexpected error occured.')}</Alert>;
  }

  return (
    <GraaspMainMenu id={MAIN_MENU_ID}>
      {/* todo: add styles to tree */}
      <div style={{ height: 10 }} />
      <DynamicTreeView
        id={TREE_VIEW_ID}
        rootLabel={rootItem.name}
        rootId={rootId}
        rootType={rootItem.type}
        rootExtra={rootItem.extra}
        initialExpendedItems={[rootId]}
        selectedId={focusedItemId}
        onTreeItemSelect={(payload) => {
          setFocusedItemId(payload);
        }}
        items={children && !children.isEmpty() ? children : []}
        isLoading={isLoading || rootItemIsLoading}
      />
    </GraaspMainMenu>
  );
};

export default MainMenu;
