import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { Alert, Stack, Typography } from '@mui/material';

import { ItemLoginSchemaType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { buildContentPagePath } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';

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

  // get username from query param
  const username = search.get('username');
  if (!username) {
    return <Navigate to="/" />;
  }

  if (!itemId) {
    return <Navigate to="/" />;
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
            You are already logged in with another account
          </Typography>
          <Button onClick={signOut}>Sign Out and Log Back In</Button>
        </Stack>
      );
    }
    return <Navigate to={redirectionTarget} />;
  }

  if (itemLoginSchemaType !== ItemLoginSchemaType.Username) {
    return (
      <Alert severity="error">This item does not support auto-login</Alert>
    );
  }

  const autoLogin = async () => {
    // post item login for the passed username
    await pseudoLogin({ itemId, username });
    // auto navigate the user to the right context
    navigate(redirectionTarget);
  };

  return (
    <Stack height="100vh" alignItems="center" justifyContent="center" gap={2}>
      <Typography variant="h2">Welcome to this study!</Typography>
      <Button onClick={autoLogin}>Start</Button>
    </Stack>
  );
};
