import React from 'react';
import { useTranslation } from 'react-i18next';
import BlockIcon from '@material-ui/icons/Block';
import { Main, Button, Navigation, GraaspLogo } from '@graasp/ui';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import HeaderRightContent from './HeaderRightContent';
import {
  Context,
  GRAASP_LOGO_HEADER_HEIGHT,
  HOST_MAP,
  APP_NAME,
} from '../../config/constants';
import { HOME_PATH } from '../../config/paths';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    textAlign: 'center',
    height: '90vh',
  },
  switchButton: {
    margin: theme.spacing(1, 'auto'),
  },
  icon: {
    fontSize: '1.5em',
  },
  logo: {
    fill: 'white',
  },
  title: {
    margin: theme.spacing(0, 2, 0, 1),
  },
  leftContent: {
    display: 'flex',
    marginLeft: theme.spacing(1),
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
  },
}));

function ItemForbiddenScreen() {
  const { t } = useTranslation();
  const classes = useStyles();

  const ButtonContent = (
    <Button
      variant="outlined"
      startIcon={<AccountCircleIcon />}
      className={classes.switchButton}
    >
      {t('Switch account')}
    </Button>
  );

  const leftContent = (
    <div className={classes.leftContent}>
      <Link to={HOME_PATH} className={classes.link}>
        <GraaspLogo
          height={GRAASP_LOGO_HEADER_HEIGHT}
          className={classes.logo}
        />
        <Typography variant="h6" color="inherit" className={classes.title}>
          {APP_NAME}
        </Typography>
      </Link>
      <Navigation hostMap={HOST_MAP} currentValue={Context.PLAYER} />
    </div>
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
        className={classes.wrapper}
      >
        <Grid item>
          <Typography variant="h4">
            <IconButton>
              <BlockIcon className={classes.icon} />
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
