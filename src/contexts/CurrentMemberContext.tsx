import { createContext, useContext, useEffect } from 'react';

import { AccountType } from '@graasp/sdk';

import i18n from '@/config/i18n';
import { hooks } from '@/config/queryClient';

type CurrentUserContextType = ReturnType<typeof useCurrentMember>;

const CurrentMemberContext = createContext<CurrentUserContextType>(
  {} as CurrentUserContextType,
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
  const lang =
    query.data && query.data?.type === AccountType.Individual
      ? query.data?.extra?.lang
      : undefined;
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

export const useCurrentMemberContext = (): CurrentUserContextType =>
  useContext(CurrentMemberContext);
