import { Link, useSearchParams } from 'react-router-dom';

import { Button, Stack } from '@mui/material';

import { DoorOpenIcon } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { BACK_TO_SHORTCUT_ID } from '@/config/selectors';
import { PLAYER } from '@/langs/constants';
import { ID_FORMAT } from '@/utils/item';

const FromShortcutButton = (): JSX.Element | null => {
  const [searchParams] = useSearchParams();
  const { t } = usePlayerTranslation();
  const fromUrl = searchParams.get('from');
  const fromName = searchParams.get('fromName');

  if (
    !fromUrl ||
    !fromName ||
    // should match player item url
    !new RegExp(`/${ID_FORMAT}`).exec(fromUrl)?.length
  ) {
    return null;
  }

  // keep params, remove from values
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.delete('fromName');
  newSearchParams.delete('from');

  if (fromUrl) {
    return (
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Button
          id={BACK_TO_SHORTCUT_ID}
          component={Link}
          to={{ pathname: fromUrl, search: newSearchParams.toString() }}
          variant="outlined"
          startIcon={<DoorOpenIcon />}
          color="warning"
          sx={{ textTransform: 'unset' }}
        >
          {t(PLAYER.FROM_SHORTCUT_BUTTON_TEXT, { name: fromName })}
        </Button>
      </Stack>
    );
  }

  return null;
};

export default FromShortcutButton;
