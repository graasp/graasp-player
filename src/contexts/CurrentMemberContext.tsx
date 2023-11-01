import { createContext, useContext, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { UseQueryResult } from 'react-query';

import { CompleteMember } from '@graasp/sdk';

import i18n from '@/config/i18n';
import { hooks } from '@/config/queryClient';

type CurrentMemberContextType = UseQueryResult<CompleteMember | null>;

const CurrentMemberContext = createContext<CurrentMemberContextType>(
  {} as CurrentMemberContextType,
);

const { useCurrentMember } = hooks;
type Props = {
  children: JSX.Element | JSX.Element[];
};

export const CurrentMemberContextProvider = ({
  children,
}: Props): JSX.Element => {
  const query = useCurrentMember();

  // update language depending on user setting
  const lang = query.data?.extra?.lang;
  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return (
    <CurrentMemberContext.Provider value={query}>
      {children}
    </CurrentMemberContext.Provider>
  );
};

export const useCurrentMemberContext = (): CurrentMemberContextType =>
  useContext(CurrentMemberContext);
