import { useParams } from 'react-router';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AppBar, Box, Toolbar } from '@mui/material';

import { ActionTriggers, DiscriminatedItem, ItemType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';
import { useItemContext } from '@/contexts/ItemContext';

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

  if (isLoading) {
    return null;
  }

  const prevRoot: DiscriminatedItem | null = rootItem || null;
  let prev: DiscriminatedItem | null = null;
  let next: DiscriminatedItem | null = null;

  const folderHierarchy: DiscriminatedItem[] | undefined = descendants?.filter(
    ({ type }) => type === ItemType.FOLDER,
  );

  if (item.id === rootId && folderHierarchy?.length) {
    [next] = folderHierarchy;
  } else {
    const idx = folderHierarchy?.findIndex(({ id }) => id === item.id) ?? -1;

    if (!folderHierarchy || idx < 0) {
      return null;
    }

    prev = idx === 0 ? prevRoot : folderHierarchy[idx - 1];
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
