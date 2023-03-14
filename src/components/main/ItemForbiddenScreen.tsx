import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BlockIcon from '@mui/icons-material/Block';
import { Grid, IconButton, Typography } from '@mui/material';

import { Button, Main } from '@graasp/ui';

import UserSwitchWrapper from '../common/UserSwitchWrapper';
import HeaderNavigation from './HeaderNavigation';
import HeaderRightContent from './HeaderRightContent';

const ItemForbiddenScreen: FC = () => {
  const { t } = useTranslation();

  const ButtonContent = (
    <Button variant="outlined" startIcon={<AccountCircleIcon />}>
      {t('Switch account')}
    </Button>
  );

  return (
    <Main
      open={false}
      headerLeftContent={<HeaderNavigation />}
      headerRightContent={<HeaderRightContent />}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        height="90vh"
      >
        <Grid item>
          <Typography variant="h4">
            <IconButton size="large">
              <BlockIcon />
            </IconButton>
            {t('You cannot access this item')}
          </Typography>
          <Typography variant="body1">
            {t(
              'Your current account does not have the rights to access this item.',
            )}
          </Typography>
          <UserSwitchWrapper ButtonContent={ButtonContent} />
        </Grid>
      </Grid>
    </Main>
  );
};

export default ItemForbiddenScreen;
