import React, { useContext } from 'react';
import { useLocation } from 'react-router';
import { Navigate, Route, Routes } from 'react-router-dom';

import { saveUrlForRedirection } from '@graasp/sdk';
import { Loader, withAuthorization } from '@graasp/ui';

import { DOMAIN, SIGN_IN_PATH } from '../config/constants';
import { HOME_PATH, buildMainPath } from '../config/paths';
import { CurrentMemberContext } from './context/CurrentMemberContext';
import Home from './main/Home';
import ItemScreen from './main/ItemScreen';

export const App = () => {
  const { pathname } = useLocation();
  const { data: currentMember, isLoading } = useContext(CurrentMemberContext);

  if (isLoading) {
    return <Loader />;
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
      <Route path={buildMainPath()} exact element={<ItemScreen />} />
      <Route path={HOME_PATH} exact element={<HomeWithAuthorization />} />
      <Route element={<Navigate to={HOME_PATH} />} />
    </Routes>
  );
};

export default App;
