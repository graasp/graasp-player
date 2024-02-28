import { useParams } from 'react-router';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box } from '@mui/material';

import { DiscriminatedItem, ItemType, Triggers } from '@graasp/sdk';
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

  const { data: descendants, isLoading } = hooks.useDescendants({
    // not correct but enabled
    id: rootId ?? '',
    enabled: Boolean(rootId),
  });

  if (isLoading) {
    return null;
  }

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

    prev = folderHierarchy[idx - 1];
    next = folderHierarchy[idx + 1];
  }

  const handleClickNavigationButton = (itemId: string) => {
    triggerAction({ itemId, payload: { type: Triggers.ItemView } });
    setFocusedItemId(itemId);
  };

  return (
    <Box
      flexDirection="row"
      sx={{ mt: 3 }}
      display="flex"
      justifyContent="space-between"
    >
      {prev ? (
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => handleClickNavigationButton(prev.id)}
        >
          {prev.name}
        </Button>
      ) : (
        <p />
      )}
      {next ? (
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={() => handleClickNavigationButton(next.id)}
        >
          {next.name}
        </Button>
      ) : (
        <p />
      )}
    </Box>
  );
};

export default NavigationButton;
