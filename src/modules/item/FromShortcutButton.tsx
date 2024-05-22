import { Link, useSearchParams } from 'react-router-dom';

import { Button, Stack } from '@mui/material';

import { DoorOpenIcon } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { PLAYER } from '@/langs/constants';

const FromShortcutButton = (): JSX.Element | null => {
  const [searchParams] = useSearchParams();
  const { t } = usePlayerTranslation();
  const fromUrl = searchParams.get('from');
  const fromName = searchParams.get('fromName');

  if (!fromUrl || !fromName || !fromUrl.startsWith(window.location.origin)) {
    return null;
  }

  if (fromUrl) {
    return (
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Button
          component={Link}
          to={fromUrl}
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
