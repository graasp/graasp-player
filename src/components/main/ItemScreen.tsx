import { useNavigate, useParams } from 'react-router-dom';

import { ItemLoginAuthorization } from '@graasp/ui';

import { HOME_PATH } from '../../config/paths';
import { hooks, mutations } from '../../config/queryClient';
import { ItemContextProvider } from '../context/ItemContext';
import CookiesBanner from './CookiesBanner';
import ItemForbiddenScreen from './ItemForbiddenScreen';
import MainScreen from './MainScreen';

const { useItem, useCurrentMember, useItemLoginSchemaType } = hooks;

const ItemScreenWrapper = (rootId: string) => {
  const ItemScreen = (): JSX.Element => (
    <ItemContextProvider rootId={rootId}>
      <CookiesBanner />
      <MainScreen />
    </ItemContextProvider>
  );

  return ItemScreen;
};

const { usePostItemLogin, useSignOut } = mutations;

const WrappedItemScreen = (): JSX.Element => {
  const { mutate: signOut } = useSignOut();
  const { mutate: itemLoginSignIn } = usePostItemLogin();
  const { rootId } = useParams();
  const navigate = useNavigate();

  const ForbiddenContent = <ItemForbiddenScreen />;

  if (!rootId) {
    navigate(HOME_PATH);
    // TODO: return not found?
    return ForbiddenContent;
  }

  const Component = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    signOut,
    itemId: rootId,
    useCurrentMember,
    useItem,
    ForbiddenContent,
    useItemLoginSchemaType,
  })(ItemScreenWrapper(rootId));
  return <Component />;
};

export default WrappedItemScreen;
