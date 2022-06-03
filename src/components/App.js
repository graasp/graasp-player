import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader, withAuthorization } from '@graasp/ui';
import { useLocation } from 'react-router';
import { saveUrlForRedirection } from '@graasp/utils';
import { buildMainPath, HOME_PATH } from '../config/paths';
import Home from './main/Home';
import ItemScreen from './main/ItemScreen';
import { DOMAIN, SIGN_IN_PATH } from '../config/constants';
import { CurrentMemberContext } from './context/CurrentMemberContext';

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
