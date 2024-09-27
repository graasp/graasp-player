import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  Member,
  MembershipRequestStatus,
} from '@graasp/sdk';

import { Check, Lock } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { REQUEST_MEMBERSHIP_BUTTON_ID } from '@/config/selectors';
import { PLAYER } from '@/langs/constants';

// eslint-disable-next-line import/prefer-default-export
export const RequestAccessContent = ({
  member,
  itemId,
}: {
  member: Member;
  itemId: DiscriminatedItem['id'];
}): JSX.Element => {
  const { t: translatePlayer } = usePlayerTranslation();
  const {
    mutateAsync: requestMembership,
    isSuccess,
    isLoading,
  } = mutations.useRequestMembership();
  const { data: request } = hooks.useOwnMembershipRequest(itemId);

  if (request?.status === MembershipRequestStatus.Pending) {
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        gap={2}
        // data-cy={MEMBERSHIP_REQUEST_PENDING_SCREEN_SELECTOR}
      >
        <Lock size={40} />
        <Typography variant="h3">
          {translatePlayer(PLAYER.REQUEST_ACCESS_PENDING_TITLE)}
        </Typography>
        <Typography>
          {translatePlayer(PLAYER.REQUEST_ACCESS_PENDING_DESCRIPTION)}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <Lock size={40} />
      <Typography variant="h3">
        {translatePlayer(PLAYER.REQUEST_ACCESS_TITLE)}
      </Typography>
      <LoadingButton
        id={REQUEST_MEMBERSHIP_BUTTON_ID}
        disabled={isSuccess}
        loading={isLoading}
        endIcon={isSuccess ? <Check /> : null}
        onClick={async () => {
          await requestMembership({ id: itemId });
        }}
        variant="contained"
      >
        {isSuccess
          ? translatePlayer(PLAYER.REQUEST_ACCESS_SENT_BUTTON)
          : translatePlayer(PLAYER.REQUEST_ACCESS_BUTTON)}
      </LoadingButton>
      <Typography variant="subtitle2">
        {translatePlayer(PLAYER.ITEM_LOGIN_HELPER_SIGN_OUT, {
          email: member.email,
        })}
      </Typography>
    </Stack>
  );
};
