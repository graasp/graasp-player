import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import { SIGN_IN_PATH } from '@/config/constants';
import { GRAASP_ACCOUNT_HOST } from '@/config/env';
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
  preserveUrl = true,
}: Props): JSX.Element => {
  const { data: member, isLoading = true } = useCurrentMemberContext();
  const { mutateAsync: useSignOutMutation } = useSignOut();

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
      userMenuItems={[]}
      isCurrentMemberLoading={isLoading}
      profilePath={GRAASP_ACCOUNT_HOST}
      redirectPath={redirectUrl.toString()}
      buttonId={HEADER_MEMBER_MENU_BUTTON_ID}
      signInMenuItemId={HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID}
      signOutMenuItemId={HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}
      seeProfileButtonId={HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID}
      buildMemberMenuItemId={buildMemberMenuItemId}
      avatar={<MemberAvatar member={member} />}
    />
  );
};

export default UserSwitchWrapper;
