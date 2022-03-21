import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { PermissionedComponent, Loader } from '@graasp/ui';
import PropTypes from 'prop-types';
import { Tooltip, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import { hooks } from '../../config/queryClient';
import { buildGraaspComposeItemRoute } from '../../config/constants';
import { isRegularUser } from '../../utils/user';

const useStyles = makeStyles(() => ({
  iconButton: {
    float: 'right',
  },
}));

const BuilderButton = ({ id }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data: user, isLoading } = hooks.useCurrentMember();

  const onClickComposeView = () => {
    window.location.href = buildGraaspComposeItemRoute(id);
  };

  if (isLoading) {
    <Loader />;
  }

  const ActionButtons = (
    <Tooltip title={t('Compose View')}>
      <IconButton
        className={classes.iconButton}
        aria-label={t('Compose view')}
        onClick={onClickComposeView}
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <PermissionedComponent
      component={ActionButtons}
      checkPermissions={() => isRegularUser(user)}
    />
  );
};

BuilderButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default BuilderButton;
