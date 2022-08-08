import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import {
  DOMAIN,
  MEMBER_PROFILE_PATH,
  SIGN_IN_PATH,
} from '../../config/constants';
import { hooks, useMutation } from '../../config/queryClient';
import {
  HEADER_MEMBER_MENU_BUTTON_ID,
  HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID,
  HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID,
  buildMemberMenuItemId,
} from '../../config/selectors';
import { CurrentMemberContext } from '../context/CurrentMemberContext';

const UserSwitchWrapper = ({ ButtonContent }) => {
  const {
    data: member,
    isLoading,
    isSuccess: isSuccessUser,
  } = useContext(CurrentMemberContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutateAsync: signOut } = useMutation(MUTATION_KEYS.SIGN_OUT);
  const { mutate: switchUser } = useMutation(MUTATION_KEYS.SWITCH_MEMBER);

  return (
    <>
      <GraaspUserSwitch
        ButtonContent={ButtonContent}
        navigate={navigate}
        signOut={signOut}
        currentMember={member}
        isCurrentMemberLoading={isLoading}
        isCurrentMemberSuccess={isSuccessUser}
        useAvatar={hooks.useAvatar}
        switchMember={switchUser}
        seeProfileText={t('See Profile')}
        signedOutTooltipText={t('You are not signed in.')}
        signOutText={t('Sign Out')}
        switchMemberText={t('Sign in with another account')}
        profilePath={MEMBER_PROFILE_PATH}
        domain={DOMAIN}
        redirectPath={SIGN_IN_PATH}
        useMembers={hooks.useMembers}
        buttonId={HEADER_MEMBER_MENU_BUTTON_ID}
        signInMenuItemId={HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID}
        signOutMenuItemId={HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID}
        seeProfileButtonId={HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID}
        buildMemberMenuItemId={buildMemberMenuItemId}
      />
    </>
  );
};

UserSwitchWrapper.propTypes = {
  ButtonContent: PropTypes.node,
};

UserSwitchWrapper.defaultProps = {
  ButtonContent: null,
};

export default UserSwitchWrapper;
