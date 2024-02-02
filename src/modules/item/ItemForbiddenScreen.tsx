import { useTranslation } from 'react-i18next';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BlockIcon from '@mui/icons-material/Block';
import { IconButton, Stack, Typography } from '@mui/material';

import { Button } from '@graasp/ui';

import { PLAYER } from '@/langs/constants';
import UserSwitchWrapper from '@/modules/userSwitch/UserSwitchWrapper';

const ItemForbiddenScreen = (): JSX.Element => {
  const { t } = useTranslation();

  const ButtonContent = (
    <Button variant="outlined" startIcon={<AccountCircleIcon />}>
      {t(PLAYER.SIGN_IN_BUTTON_TEXT)}
    </Button>
  );

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      margin="auto"
      height="100%"
    >
      <Typography variant="h4">
        <IconButton size="large">
          <BlockIcon />
        </IconButton>
        {t(PLAYER.ERROR_ACCESSING_ITEM)}
      </Typography>
      <Typography variant="body1">
        {t(PLAYER.ERROR_ACCESSING_ITEM_HELPER)}
      </Typography>
      <UserSwitchWrapper ButtonContent={ButtonContent} preserveUrl />
    </Stack>
  );
};

export default ItemForbiddenScreen;
