import { useParams } from 'react-router';

import { Alert } from '@mui/material';

import { FAILURE_MESSAGES } from '@graasp/translations';
import { MainMenu } from '@graasp/ui';

import { List } from 'immutable';

import { useMessagesTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { MAIN_MENU_ID, TREE_VIEW_ID } from '@/config/selectors';
import { useItemContext } from '@/contexts/ItemContext';
import DynamicTreeView from '@/modules/tree/DynamicTreeView';

const { useItem } = hooks;

const ItemNavigation = (): JSX.Element | null => {
  const { rootId } = useParams();
  const { t: translateMessage } = useMessagesTranslation();
  const { setFocusedItemId, focusedItemId } = useItemContext();

  const {
    data: rootItem,
    isLoading: rootItemIsLoading,
    isError: rootItemIsError,
    isSuccess,
  } = useItem(rootId);

  // display nothing when no item is defined
  if (!rootId) {
    return null;
  }

  if (rootItemIsError) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }

  if (isSuccess)
    return (
      <MainMenu id={MAIN_MENU_ID}>
        <div style={{ height: '15px' }} />
        <DynamicTreeView
          id={TREE_VIEW_ID}
          items={List([rootItem])}
          initialExpendedItems={[rootId]}
          selectedId={focusedItemId}
          onTreeItemSelect={(payload) => {
            setFocusedItemId(payload);
          }}
          isLoading={rootItemIsLoading}
        />
      </MainMenu>
    );
  return null;
};

export default ItemNavigation;
