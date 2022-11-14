import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BlockIcon from '@mui/icons-material/Block';
import { Grid, IconButton, Typography, styled } from '@mui/material';

import { Button, GraaspLogo, Main, Navigation } from '@graasp/ui';

import {
  APP_NAME,
  Context,
  GRAASP_LOGO_HEADER_HEIGHT,
  HOST_MAP,
} from '../../config/constants';
import { HOME_PATH } from '../../config/paths';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import HeaderRightContent from './HeaderRightContent';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
}));

const LeftContentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  marginLeft: theme.spacing(1),
}));

function ItemForbiddenScreen() {
  const { t } = useTranslation();

  const ButtonContent = (
    <Button
      variant="outlined"
      startIcon={<AccountCircleIcon />}
      mt={1}
      mr={1}
      mx="auto"
    >
      {t('Switch account')}
    </Button>
  );

  const leftContent = (
    <LeftContentWrapper>
      <StyledLink to={HOME_PATH}>
        <GraaspLogo height={GRAASP_LOGO_HEADER_HEIGHT} sx={{ fill: 'white' }} />
        <Typography variant="h6" color="inherit" mr={2} ml={1}>
          {APP_NAME}
        </Typography>
      </StyledLink>
      <Navigation hostMap={HOST_MAP} currentValue={Context.PLAYER} />
    </LeftContentWrapper>
  );

  return (
    <Main
      open={false}
      headerLeftContent={leftContent}
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
}

export default ItemForbiddenScreen;
