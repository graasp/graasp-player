import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import {
  PermissionLevel,
  UUID,
  buildItemLinkForBuilder,
  redirect,
} from '@graasp/sdk';
import { Loader, PermissionedComponent } from '@graasp/ui';

import {
  FLOATING_BUTTON_Z_INDEX,
  buildBuilderTabName,
} from '@/config/constants';
import { GRAASP_BUILDER_HOST } from '@/config/env';
import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { BUILDER_EDIT_BUTTON_ID } from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';

type Props = {
  itemId: UUID;
};

const BuilderButton = ({ itemId }: Props): JSX.Element => {
  const { t } = usePlayerTranslation();
  const { query: { data: user, isLoading } = {} } = useCurrentMemberContext();
  const { data: itemMemberships, isLoading: isLoadingItemMemberships } =
    hooks.useItemMemberships(itemId);

  const onClickComposeView = () => {
    const url = buildItemLinkForBuilder({
      origin: GRAASP_BUILDER_HOST,
      itemId,
    });
    redirect(url, {
      openInNewTab: true,
      name: buildBuilderTabName(itemId),
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
        sx={{ float: 'right', zIndex: FLOATING_BUTTON_Z_INDEX }}
        id={BUILDER_EDIT_BUTTON_ID}
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

export default BuilderButton;
