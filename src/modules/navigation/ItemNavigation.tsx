import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Alert } from '@mui/material';

import { ItemType } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';
import { MainMenu } from '@graasp/ui';

import { useMessagesTranslation } from '@/config/i18n';
import { ROOT_ID_PATH, buildContentPagePath } from '@/config/paths';
import { axios, hooks } from '@/config/queryClient';
import { MAIN_MENU_ID, TREE_VIEW_ID } from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext.tsx';
import TreeView from '@/modules/navigation/tree/TreeView';
import { combineUuids, shuffleAllButLastItemInArray } from '@/utils/shuffle.ts';

import LoadingTree from './tree/LoadingTree';

const { useItem, useDescendants } = hooks;

const DrawerNavigation = (): JSX.Element | null => {
  const rootId = useParams()[ROOT_ID_PATH];
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: member } = useCurrentMemberContext();
  const [prevRootId, setPrevRootId] = useState(rootId);

  useEffect(() => {
    setPrevRootId(rootId);
  }, [rootId]);

  const shuffle = Boolean(searchParams.get('shuffle') === 'true');

  const { t: translateMessage } = useMessagesTranslation();

  const { data: descendants, isLoading: isLoadingTree } = useDescendants({
    id: rootId ?? '',
    types: [ItemType.FOLDER],
    // remove hidden
    showHidden: false,
  });

  const { data: rootItem, isLoading, isError, error } = useItem(rootId);
  const handleNavigationOnClick = (newItemId: string) => {
    navigate(
      buildContentPagePath({
        rootId,
        itemId: newItemId,
        searchParams: searchParams.toString(),
      }),
    );
  };

  // on root change, we need to destroy the tree
  // since it keeps the same data on reload despite prop changes
  // we cannot rely on isLoading because the data is taken from the cache
  // bc of our query client optimization
  if (prevRootId !== rootId) {
    return <LoadingTree />;
  }

  let shuffledDescendants = [...(descendants || [])];
  if (shuffle) {
    const baseId = rootId ?? '';
    const memberId = member?.id ?? '';
    const combinedUuids = combineUuids(baseId, memberId);
    shuffledDescendants = shuffleAllButLastItemInArray(
      shuffledDescendants,
      combinedUuids,
    );
  }

  if (rootItem) {
    if (descendants) {
      return (
        <MainMenu id={MAIN_MENU_ID}>
          <TreeView
            id={TREE_VIEW_ID}
            rootItems={[rootItem]}
            items={[rootItem, ...shuffledDescendants]}
            firstLevelStyle={{ fontWeight: 'bold' }}
            onTreeItemSelect={handleNavigationOnClick}
          />
        </MainMenu>
      );
    }
    if (isLoadingTree) {
      return <LoadingTree />;
    }
  }

  if (isLoading) {
    return <LoadingTree />;
  }

  if (isError) {
    // this is an expected error that can occur if user does not have access to the item
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return null;
    }
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }

  return null;
};

export default DrawerNavigation;
