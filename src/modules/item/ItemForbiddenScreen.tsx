import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BlockIcon from '@mui/icons-material/Block';
import { IconButton, Stack, Typography } from '@mui/material';

import { Context } from '@graasp/sdk';
import { AUTH } from '@graasp/translations';
import { Button, Main } from '@graasp/ui';

import { useAuthTranslation } from '@/config/i18n';
import HeaderNavigation from '@/modules/header/HeaderNavigation';
import HeaderRightContent from '@/modules/header/HeaderRightContent';
import UserSwitchWrapper from '@/modules/userSwitch/UserSwitchWrapper';

const ItemForbiddenScreen: FC = () => {
  const { t: translateAuth } = useAuthTranslation();
  const { t } = useTranslation();

  const ButtonContent = (
    <Button variant="outlined" startIcon={<AccountCircleIcon />}>
      {translateAuth(AUTH.SWITCH_ACCOUNT_TEXT)}
    </Button>
  );

  return (
    <Main
      open={false}
      context={Context.PLAYER}
      headerLeftContent={<HeaderNavigation topItemName="" />}
      headerRightContent={<HeaderRightContent />}
    >
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
          {
            // todo: add translations
            t('You cannot access this item')
          }
        </Typography>
        <Typography variant="body1">
          {
            // todo: add translations
            t(
              'Your current account does not have the rights to access this item.',
            )
          }
        </Typography>
        <UserSwitchWrapper ButtonContent={ButtonContent} />
      </Stack>
    </Main>
  );
};

export default ItemForbiddenScreen;
