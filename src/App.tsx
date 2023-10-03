import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

import { hasAcceptedCookies, saveUrlForRedirection } from '@graasp/sdk';
import { CustomInitialLoader, withAuthorization } from '@graasp/ui';

import { SIGN_IN_PATH } from '@/config/constants';
import { DOMAIN, GA_MEASUREMENT_ID } from '@/config/env';
import { HOME_PATH, buildMainPath } from '@/config/paths';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import HomePage from '@/modules/pages/HomePage';
import ItemPage from '@/modules/pages/ItemPage';

export const App = (): JSX.Element => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: currentMember, isLoading } = useCurrentMemberContext();

  useEffect(() => {
    // REACTGA
    // Send pageview with a custom path
    if (GA_MEASUREMENT_ID && hasAcceptedCookies()) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
      ReactGA.send('pageview');
    }

    // remove cross domain tracking query params
    // eslint-disable-next-line no-console
    console.log('removing google cross site tracking params after load');
    // eslint-disable-next-line no-console
    console.log(searchParams);
    searchParams.delete('_gl');
    setSearchParams(searchParams);
  }, [location]);

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
      <Route path={buildMainPath()} element={<ItemPage />} />
      <Route path={HOME_PATH} element={<HomePageWithAuthorization />} />
      <Route element={<Navigate to={HOME_PATH} />} />
    </Routes>
  );
};

export default App;
