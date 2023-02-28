import { MemberRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import { MEMBER_PROFILE_PATH, SIGN_IN_PATH } from '@/config/constants';
import { DOMAIN } from '@/config/env';
import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
  buildMemberMenuItemId,
} from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';

import MemberAvatar from './MemberAvatar';

const { useSwitchMember, useSignOut } = mutations;

type Props = {
  ButtonContent?: JSX.Element;
};

const UserSwitchWrapper = ({ ButtonContent }: Props): JSX.Element => {
  const {
    query: {
      data: member,
      isLoading = true,
      isSuccess: isSuccessUser = false,
    } = {},
  } = useCurrentMemberContext();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutateAsync: useSwitchMemberAsyncMutation } = useSwitchMember();
  const { mutate: useSignOutMutation } = useSignOut();

  return (
    <GraaspUserSwitch
      ButtonContent={ButtonContent}
      signOut={useSignOutMutation}
      currentMember={member}
      isCurrentMemberLoading={isLoading}
      isCurrentMemberSuccess={isSuccessUser}
      switchMember={useSwitchMemberAsyncMutation}
      seeProfileText={translateBuilder(BUILDER.USER_SWITCH_PROFILE_BUTTON)}
      signedOutTooltipText={translateBuilder(
        BUILDER.USER_SWITCH_SIGNED_OUT_TOOLTIP,
      )}
      signOutText={translateBuilder(BUILDER.USER_SWITCH_SIGN_OUT_BUTTON)}
      switchMemberText={translateBuilder(BUILDER.USER_SWITCH_SWITCH_USER_TEXT)}
      profilePath={MEMBER_PROFILE_PATH}
      domain={DOMAIN}
      redirectPath={SIGN_IN_PATH}
      useMembers={hooks.useMembers}
      buttonId={HEADER_MEMBER_MENU_BUTTON_ID}
      signInMenuItemId={HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID}
      signOutMenuItemId={HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}
      seeProfileButtonId={HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID}
      buildMemberMenuItemId={buildMemberMenuItemId}
      renderAvatar={(avatar?: MemberRecord): JSX.Element => (
        <MemberAvatar member={avatar} />
      )}
    />
  );
};

export default UserSwitchWrapper;
