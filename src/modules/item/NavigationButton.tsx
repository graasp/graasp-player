import { useParams } from 'react-router';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AppBar, Box, Toolbar } from '@mui/material';

import { ActionTriggers, DiscriminatedItem, ItemType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';
import { useItemContext } from '@/contexts/ItemContext';

import isArray from 'lodash.isarray';

const NavigationButton = ({
  item,
}: {
  item: DiscriminatedItem;
}): JSX.Element | null => {
  const { rootId } = useParams();
  const { setFocusedItemId } = useItemContext();
  const { mutate: triggerAction } = mutations.usePostItemAction();
  const { data: rootItem } = hooks.useItem(rootId);

  const { data: descendants, isLoading } = hooks.useDescendants({
    // not correct but enabled
    id: rootId ?? '',
    enabled: Boolean(rootId),
  });

  const prevRoot: DiscriminatedItem | null = rootItem || null;
  let prev: DiscriminatedItem | null = null;
  let next: DiscriminatedItem | null = null;

  // if there are no descendants then there is no need to navigate
  if (!isArray(descendants)) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  // we only navigate through folders
  const folderHierarchy: DiscriminatedItem[] = descendants.filter(
    ({ type }) => type === ItemType.FOLDER,
  );

  // when focusing on the root item
  if (item.id === rootId && folderHierarchy.length) {
    // there is no previous and the nex in the first item in the hierarchy
    [next] = folderHierarchy;
  // when focusing on the descendants
  } else {
    const idx = folderHierarchy.findIndex(({ id }) => id === item.id) ?? -1;

    // if index is not found, then do not show navigation
    if (idx < 0) {
      return null;
    }

    // if index is 0, previous is root
    prev = idx === 0 ? prevRoot : folderHierarchy[idx - 1];
    // if you reach the end, next will be undefined and not show
    next = folderHierarchy[idx + 1];
  }

  const handleClickNavigationButton = (itemId: string) => {
    triggerAction({ itemId, payload: { type: ActionTriggers.ItemView } });
    setFocusedItemId(itemId);
  };

  return (
    <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        {prev ? (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              if (prev && prev.id) {
                handleClickNavigationButton(prev.id);
              }
            }}
          >
            {prev.name}
          </Button>
        ) : (
          <p />
        )}
        <Box sx={{ flexGrow: 1 }} />
        {next ? (
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              if (next && next.id) {
                handleClickNavigationButton(next.id);
              }
            }}
          >
            {next.name}
          </Button>
        ) : (
          <p />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationButton;
