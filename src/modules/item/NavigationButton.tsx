import { useParams } from 'react-router';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { hooks } from '@/config/queryClient';

const NavigationButton = ({
  item,
}: {
  item: DiscriminatedItem;
}): JSX.Element | null => {
  const { rootId } = useParams();

  const { data: descendants, isLoading } = hooks.useDescendants({
    // not correct but enabled
    id: rootId ?? '',
    enabled: Boolean(rootId),
  });

  if (isLoading) {
    return null;
  }

  let prev = null;
  let next = null;

  const folderHierarchy = descendants?.filter(
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
  return (
    <Box flexDirection="row" display="flex" justifyContent="space-between">
      {prev ? (
        <Button sx={{}} variant="outlined" startIcon={<ArrowBackIcon />}>
          {prev.name}
        </Button>
      ) : (
        <p />
      )}
      {next ? (
        <Button sx={{}} endIcon={<ArrowForwardIcon />}>
          {next.name}
        </Button>
      ) : (
        <p />
      )}
    </Box>
  );
};

export default NavigationButton;
