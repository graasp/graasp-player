import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { hooks } from '../../config/queryClient';
import i18n from '../../config/i18n';

const CurrentMemberContext = React.createContext();

const { useCurrentMember } = hooks;
const CurrentMemberContextProvider = ({ children }) => {
  const query = useCurrentMember();

  // update language depending on user setting
  const lang = query?.data?.get('extra')?.lang;
  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  const value = useMemo(() => query, [query.data]);

  return (
    <CurrentMemberContext.Provider value={value}>
      {children}
    </CurrentMemberContext.Provider>
  );
};

CurrentMemberContextProvider.propTypes = {
  children: PropTypes.node,
};

CurrentMemberContextProvider.defaultProps = {
  children: null,
};

export { CurrentMemberContext, CurrentMemberContextProvider };
