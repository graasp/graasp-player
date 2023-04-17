import { useLocation } from 'react-router';
import { Navigate, Route, Routes } from 'react-router-dom';

import { saveUrlForRedirection } from '@graasp/sdk';
import { CustomInitialLoader, withAuthorization } from '@graasp/ui';

import { SIGN_IN_PATH } from '@/config/constants';
import { DOMAIN } from '@/config/env';
import { HOME_PATH, buildMainPath } from '@/config/paths';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import ItemScreen from '@/modules/item/ItemScreen';
import Home from '@/modules/main/Home';

export const App = (): JSX.Element => {
  const { pathname } = useLocation();
  const { data: currentMember, isLoading } = useCurrentMemberContext();

  if (isLoading) {
    return <CustomInitialLoader />;
  }

  const props = {
    currentMember,
    redirectionLink: SIGN_IN_PATH,
    onRedirect: () => {
      // save current url for later redirection after sign in
      saveUrlForRedirection(pathname, DOMAIN);
    },
  };
  const HomeWithAuthorization = withAuthorization(Home, props);

  return (
    <Routes>
      <Route path={buildMainPath()} element={<ItemScreen />} />
      <Route path={HOME_PATH} element={<HomeWithAuthorization />} />
      <Route element={<Navigate to={HOME_PATH} />} />
    </Routes>
  );
};

export default App;
