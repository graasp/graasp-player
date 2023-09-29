import { MemberRecord } from '@graasp/sdk/frontend';
import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import { MEMBER_PROFILE_PATH, SIGN_IN_PATH } from '@/config/constants';
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
  /** If true keeps the current window location as redirection URL in graasp-auth */
  preserveUrl?: boolean;
};

const UserSwitchWrapper = ({
  ButtonContent,
  preserveUrl = false,
}: Props): JSX.Element => {
  const { data: member, isLoading = true } = useCurrentMemberContext();
  const { mutate: useSignOutMutation } = useSignOut();

  const redirectUrl = new URL(SIGN_IN_PATH);
  if (preserveUrl) {
    redirectUrl.searchParams.set(
      'url',
      encodeURIComponent(window.location.href),
    );
  }

  return (
    <GraaspUserSwitch
      ButtonContent={ButtonContent}
      signOut={useSignOutMutation}
      currentMember={member}
      isCurrentMemberLoading={isLoading}
      profilePath={MEMBER_PROFILE_PATH}
      redirectPath={redirectUrl.toString()}
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
