import { ReactNode } from 'react';
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { Alert, Stack, Typography } from '@mui/material';

import { ItemLoginSchemaType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import { HOME_PATH, buildContentPagePath } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import {
  AUTO_LOGIN_CONTAINER_ID,
  AUTO_LOGIN_ERROR_CONTAINER_ID,
  AUTO_LOGIN_NO_ITEM_LOGIN_ERROR_ID,
} from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import { PLAYER } from '@/langs/constants';

const Wrapper = ({ id, children }: { id?: string; children: ReactNode }) => (
  <Stack
    id={id}
    height="100vh"
    alignItems="center"
    justifyContent="center"
    gap={2}
  >
    {children}
  </Stack>
);

export const AutoLogin = (): JSX.Element => {
  const { data: member } = useCurrentMemberContext();
  const { mutateAsync: pseudoLogin } = mutations.usePostItemLogin();
  const { mutateAsync: signOut } = mutations.useSignOut();
  const { itemId, rootId } = useParams();
  const { data: itemLoginSchemaType } = hooks.useItemLoginSchemaType({
    itemId,
  });
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { t } = usePlayerTranslation();

  // get username from query param
  const username = search.get('username');
  if (!username) {
    return (
      <Wrapper id={AUTO_LOGIN_ERROR_CONTAINER_ID}>
        <Alert severity="error">
          {t(PLAYER.AUTO_LOGIN_MISSING_REQUIRED_PARAMETER_USERNAME)}
        </Alert>
        <Button onClick={() => navigate(HOME_PATH)}>
          {t(PLAYER.AUTO_LOGIN_GO_TO_HOME)}
        </Button>
      </Wrapper>
    );
  }

  if (!itemId) {
    return <Navigate to={HOME_PATH} />;
  }

  // link used for the content
  const redirectionTarget = buildContentPagePath({
    rootId,
    itemId,
    searchParams: search.toString(),
  });

  // if the user is logged in
  if (member) {
    if (member.name !== username) {
      return (
        <Stack
          height="100vh"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Typography variant="h2">
            {t(PLAYER.AUTO_LOGIN_ALREADY_LOGGED_IN)}
          </Typography>
          <Button onClick={signOut}>
            {t(PLAYER.AUTO_LOGIN_SIGN_OUT_AND_BACK_IN)}
          </Button>
        </Stack>
      );
    }
    return <Navigate to={redirectionTarget} />;
  }

  if (itemLoginSchemaType !== ItemLoginSchemaType.Username) {
    return (
      <Alert id={AUTO_LOGIN_NO_ITEM_LOGIN_ERROR_ID} severity="error">
        {t(PLAYER.AUTO_LOGIN_NO_ITEM_LOGIN_ERROR)}
      </Alert>
    );
  }

  const autoLogin = async () => {
    // post item login for the passed username
    await pseudoLogin({ itemId, username });
    // auto navigate the user to the right context
    navigate(redirectionTarget);
  };

  return (
    <Wrapper id={AUTO_LOGIN_CONTAINER_ID}>
      <Typography variant="h2">{t(PLAYER.AUTO_LOGIN_WELCOME_TITLE)}</Typography>
      <Button onClick={autoLogin}>{t(PLAYER.AUTO_LOGIN_START_BUTTON)}</Button>
    </Wrapper>
  );
};
