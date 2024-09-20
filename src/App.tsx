import { useEffect } from 'react';
import { Trans } from 'react-i18next';
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { Alert, Button, Stack, Typography } from '@mui/material';

import { buildSignInPath, saveUrlForRedirection } from '@graasp/sdk';
import {
  CustomInitialLoader,
  PreventGuestWrapper,
  SignedInWrapper,
} from '@graasp/ui';

import { AUTHENTICATION_HOST, DOMAIN } from '@/config/env';
import { HOME_PATH, buildContentPagePath, buildMainPath } from '@/config/paths';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import HomePage from '@/modules/pages/HomePage';
import ItemPage from '@/modules/pages/ItemPage';

import { usePlayerTranslation } from './config/i18n';
import { mutations } from './config/queryClient';
import { PREVENT_GUEST_MESSAGE_ID } from './config/selectors';
import { PLAYER } from './langs/constants';
import PageWrapper from './modules/layout/PageWrapper';

const RedirectToRootContentPage = () => {
  const { rootId } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = usePlayerTranslation();

  if (rootId) {
    return (
      <Navigate
        to={buildContentPagePath({
          rootId,
          itemId: rootId,
          searchParams: searchParams.toString(),
        })}
        replace
      />
    );
  }
  return (
    <Alert>
      <Stack>
        <Typography>{t(PLAYER.ITEM_ID_NOT_VALID)}</Typography>
        <Button component={Link} to="/">
          {t(PLAYER.GO_TO_HOME)}
        </Button>
      </Stack>
    </Alert>
  );
};

export const App = (): JSX.Element => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: currentAccount, isLoading } = useCurrentMemberContext();
  const { mutate: signOut } = mutations.useSignOut();
  const { t } = usePlayerTranslation();

  useEffect(
    () => {
      if (searchParams.get('_gl'))
        // remove cross domain tracking query params
        console.info('Removing cross site tracking params');
      searchParams.delete('_gl');
      setSearchParams(searchParams);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams],
  );

  if (isLoading) {
    return <CustomInitialLoader />;
  }

  const fullscreen = Boolean(searchParams.get('fullscreen') === 'true');

  return (
    <Routes>
      <Route element={<PageWrapper fullscreen={fullscreen} />}>
        <Route path={buildMainPath()}>
          <Route index element={<RedirectToRootContentPage />} />
          <Route path=":itemId" element={<ItemPage />} />
        </Route>
        <Route
          element={
            // redirect to sign in if not signed in
            <SignedInWrapper
              currentAccount={currentAccount}
              redirectionLink={buildSignInPath({
                host: AUTHENTICATION_HOST,
                redirectionUrl: window.location.href,
              })}
              onRedirect={() => {
                // save current url for later redirection after sign in
                saveUrlForRedirection(location.pathname, DOMAIN);
              }}
            >
              <PreventGuestWrapper
                id={PREVENT_GUEST_MESSAGE_ID}
                currentAccount={currentAccount}
                buttonText={t(PLAYER.GUEST_SIGN_OUT_BUTTON)}
                onButtonClick={() => signOut()}
                errorText={t(PLAYER.ERROR_MESSAGE)}
                text={
                  <Trans
                    t={t}
                    i18nKey={PLAYER.GUEST_LIMITATION_TEXT}
                    values={{
                      name: currentAccount?.name,
                    }}
                    components={{ 1: <strong /> }}
                  />
                }
              >
                <Outlet />
              </PreventGuestWrapper>
            </SignedInWrapper>
          }
        >
          <Route path={HOME_PATH} element={<HomePage />} />
        </Route>

        {/* Default redirect  */}
        <Route path="*" element={<Navigate to={HOME_PATH} />} />
      </Route>
    </Routes>
  );
};

export default App;
