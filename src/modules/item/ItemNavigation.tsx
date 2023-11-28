import { Alert } from '@mui/material';

import { FAILURE_MESSAGES } from '@graasp/translations';
import { MainMenu, useShortenURLParams } from '@graasp/ui';

import { useMessagesTranslation } from '@/config/i18n';
import { ROOT_ID_PATH } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import { MAIN_MENU_ID, TREE_VIEW_ID } from '@/config/selectors';
import { useItemContext } from '@/contexts/ItemContext';
import DynamicTreeView from '@/modules/tree/DynamicTreeView';
import { isHidden } from '@/utils/item';

const { useItem, useDescendants, useItemsTags } = hooks;

const ItemNavigation = (): JSX.Element | null => {
  const rootId = useShortenURLParams(ROOT_ID_PATH);

  const { t: translateMessage } = useMessagesTranslation();
  const { setFocusedItemId } = useItemContext();

  const { data: descendants } = useDescendants({ id: rootId || '' });
  const { data: itemsTags } = useItemsTags(descendants?.map(({ id }) => id));

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
          items={descendants?.filter(
            (ele) => !isHidden(ele, itemsTags?.data?.[ele.id]),
          )}
          initialExpendedItems={[rootId]}
          mainItem={rootItem}
          onTreeItemSelect={setFocusedItemId}
          isLoading={rootItemIsLoading}
        />
      </MainMenu>
    );
  return null;
};

export default ItemNavigation;
