import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip, makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import {
  PermissionLevel,
  buildItemLinkForBuilder,
  redirect,
} from '@graasp/sdk';
import { Loader, PermissionedComponent } from '@graasp/ui';

import {
  FLOATING_BUTTON_Z_INDEX,
  GRAASP_COMPOSE_HOST,
  buildBuilderTabName,
} from '../../config/constants';
import { hooks } from '../../config/queryClient';
import { BUILDER_EDIT_BUTTON_ID } from '../../config/selectors';
import { isRegularUser } from '../../utils/user';
import { CurrentMemberContext } from '../context/CurrentMemberContext';

const useStyles = makeStyles(() => ({
  iconButton: {
    float: 'right',
    zIndex: FLOATING_BUTTON_Z_INDEX,
  },
}));

const BuilderButton = ({ id }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data: user, isLoading } = useContext(CurrentMemberContext);
  const { data: itemMemberships, isLoading: isLoadingItemMemberships } =
    hooks.useItemMemberships(id);

  const onClickComposeView = () => {
    const url = buildItemLinkForBuilder({
      origin: GRAASP_COMPOSE_HOST,
      itemId: id,
    });
    redirect(url, {
      openInNewTab: true,
      name: buildBuilderTabName(id),
    });
  };

  if (isLoading || isLoadingItemMemberships) {
    <Loader />;
  }

  // get user permission
  const userPermission = itemMemberships?.find(
    (perms) => perms.memberId === user?.id,
  )?.permission;
  const canOpenBuilder = userPermission
    ? [PermissionLevel.Admin, PermissionLevel.Write].includes(userPermission)
    : false;

  const ActionButtons = (
    <Tooltip title={t('Compose View')}>
      <IconButton
        id={BUILDER_EDIT_BUTTON_ID}
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
      checkPermissions={() => canOpenBuilder}
    />
  );
};

BuilderButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default BuilderButton;
