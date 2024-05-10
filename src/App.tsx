import { useEffect } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { Alert, Button, Stack, Typography } from '@mui/material';

import { buildSignInPath, saveUrlForRedirection } from '@graasp/sdk';
import { CustomInitialLoader, withAuthorization } from '@graasp/ui';

import { AUTHENTICATION_HOST, DOMAIN } from '@/config/env';
import { HOME_PATH, buildContentPagePath, buildMainPath } from '@/config/paths';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import HomePage from '@/modules/pages/HomePage';
import ItemPage from '@/modules/pages/ItemPage';

import { usePlayerTranslation } from './config/i18n';
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
  const { data: currentMember, isLoading } = useCurrentMemberContext();

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

  const props = {
    currentMember,
    redirectionLink: buildSignInPath({
      host: AUTHENTICATION_HOST,
      // allows to go back to this page after login
      redirectionUrl: window.location.href,
    }),
    onRedirect: () => {
      // save current url for later redirection after sign in
      saveUrlForRedirection(location.pathname, DOMAIN);
    },
  };
  const HomePageWithAuthorization = withAuthorization(HomePage, props);

  const fullscreen = Boolean(searchParams.get('fullscreen') === 'true');

  return (
    <Routes>
      <Route element={<PageWrapper fullscreen={fullscreen} />}>
        <Route path={buildMainPath()}>
          <Route index element={<RedirectToRootContentPage />} />
          <Route path=":itemId" element={<ItemPage />} />
        </Route>
        <Route path={HOME_PATH} element={<HomePageWithAuthorization />} />
        <Route path="*" element={<Navigate to={HOME_PATH} />} />
      </Route>
    </Routes>
  );
};

export default App;
