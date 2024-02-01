import { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

import { saveUrlForRedirection } from '@graasp/sdk';
import { CustomInitialLoader, withAuthorization } from '@graasp/ui';

import { SIGN_IN_PATH } from '@/config/constants';
import { DOMAIN } from '@/config/env';
import { HOME_PATH, buildMainPath } from '@/config/paths';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import HomePage from '@/modules/pages/HomePage';
import ItemPage from '@/modules/pages/ItemPage';

import PageWrapper from './modules/layout/PageWrapper';

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
    redirectionLink: SIGN_IN_PATH,
    onRedirect: () => {
      // save current url for later redirection after sign in
      saveUrlForRedirection(location.pathname, DOMAIN);
    },
  };
  const HomePageWithAuthorization = withAuthorization(HomePage, props);

  return (
    <Routes>
      <Route element={<PageWrapper />}>
        <Route path={buildMainPath()} element={<ItemPage />} />
        <Route path={HOME_PATH} element={<HomePageWithAuthorization />} />
        <Route path="*" element={<Navigate to={HOME_PATH} />} />
      </Route>
    </Routes>
  );
};

export default App;
