import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack } from '@mui/material';

import { Button, ForbiddenContent } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import {
  FORBIDDEN_CONTENT_ID,
  USER_SWITCH_SIGN_IN_BUTTON_ID,
} from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import { PLAYER } from '@/langs/constants';
import UserSwitchWrapper from '@/modules/userSwitch/UserSwitchWrapper';

const ItemForbiddenScreen = (): JSX.Element => {
  const { t } = usePlayerTranslation();
  const { data: member } = useCurrentMemberContext();

  const ButtonContent = (
    <Button
      className="toto"
      id={USER_SWITCH_SIGN_IN_BUTTON_ID}
      variant="outlined"
      startIcon={<AccountCircleIcon />}
    >
      {t(PLAYER.SIGN_IN_BUTTON_TEXT)}
    </Button>
  );

  return (
    <Stack
      direction="column"
      height="100%"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <ForbiddenContent
        id={FORBIDDEN_CONTENT_ID}
        memberId={member?.id}
        title={t(PLAYER.ERROR_ACCESSING_ITEM)}
        authenticatedText={t(PLAYER.ERROR_ACCESSING_ITEM_HELPER)}
      />
      <UserSwitchWrapper ButtonContent={ButtonContent} preserveUrl />
    </Stack>
  );
};

export default ItemForbiddenScreen;
