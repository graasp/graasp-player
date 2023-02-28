import { useParams } from 'react-router-dom';

import { MUTATION_KEYS } from '@graasp/query-client';
import { ItemLoginAuthorization } from '@graasp/ui';

import { hooks, mutations, useMutation } from '@/config/queryClient';
import { ItemContextProvider } from '@/contexts/ItemContext';
import CookiesBanner from '@/modules/cookies/CookiesBanner';

import ItemForbiddenScreen from './ItemForbiddenScreen';
import MainScreen from './MainScreen';

const { useItem, useItemLogin, useCurrentMember } = hooks;
const { usePostItemLogin } = mutations;

const ItemScreen = () => (
  <ItemContextProvider>
    <CookiesBanner />
    <MainScreen />
  </ItemContextProvider>
);

const WrappedItemScreen = (): JSX.Element => {
  const { mutate: signOut } = useMutation(MUTATION_KEYS.SIGN_OUT);
  const { mutate: itemLoginSignIn } = usePostItemLogin();
  const { rootId } = useParams();

  const ForbiddenContent = <ItemForbiddenScreen />;

  const Component = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    signOut,
    // this is because the itemId can not be undefined in ui
    itemId: rootId || '',
    useCurrentMember,
    useItem,
    useItemLogin,
    ForbiddenContent,
  })(ItemScreen);
  return <Component />;
};

export default WrappedItemScreen;
