import { MemberRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import { MEMBER_PROFILE_PATH, SIGN_IN_PATH } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
  buildMemberMenuItemId,
} from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';

import MemberAvatar from './MemberAvatar';

const { useSignOut } = mutations;

type Props = {
  ButtonContent?: JSX.Element;
};

const UserSwitchWrapper = ({ ButtonContent }: Props): JSX.Element => {
  const { data: member, isLoading = true } = useCurrentMemberContext();
  const { t: translateBuilder } = useBuilderTranslation();
  // const { mutateAsync: useSwitchMemberAsyncMutation } = useSwitchMember();
  const { mutate: useSignOutMutation } = useSignOut();

  return (
    <GraaspUserSwitch
      ButtonContent={ButtonContent}
      signOut={useSignOutMutation}
      currentMember={member}
      isCurrentMemberLoading={isLoading}
      // switchMember={useSwitchMemberAsyncMutation}
      seeProfileText={translateBuilder(BUILDER.USER_SWITCH_PROFILE_BUTTON)}
      signedOutTooltipText={translateBuilder(
        BUILDER.USER_SWITCH_SIGNED_OUT_TOOLTIP,
      )}
      signOutText={translateBuilder(BUILDER.USER_SWITCH_SIGN_OUT_BUTTON)}
      // switchMemberText={translateBuilder(BUILDER.USER_SWITCH_SWITCH_USER_TEXT)}
      profilePath={MEMBER_PROFILE_PATH}
      redirectPath={SIGN_IN_PATH}
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
