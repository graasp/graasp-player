import { useNavigate, useParams } from 'react-router-dom';

import { ItemLoginAuthorization } from '@graasp/ui';

import { HOME_PATH, ROOT_ID_PATH } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import { ItemContextProvider } from '@/contexts/ItemContext';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';

import ItemForbiddenScreen from '../item/ItemForbiddenScreen';
import MainScreen from '../item/MainScreen';

const { useItem, useItemLoginSchemaType, useCurrentMember } = hooks;

const ItemScreenWrapper = (rootId: string) => {
  const ItemScreen = (): JSX.Element => (
    <ItemContextProvider rootId={rootId}>
      <MainScreen />
      <PlayerCookiesBanner />
    </ItemContextProvider>
  );

  return ItemScreen;
};

const { usePostItemLogin } = mutations;

const ItemPage = (): JSX.Element | null => {
  const { mutate: itemLoginSignIn } = usePostItemLogin();

  const rootId = useParams()[ROOT_ID_PATH];

  const navigate = useNavigate();

  const ForbiddenContent = <ItemForbiddenScreen />;

  if (!rootId) {
    navigate(HOME_PATH);
    return null;
  }

  const Component = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    // this is because the itemId can not be undefined in ui
    itemId: rootId,
    useCurrentMember,
    useItem,
    ForbiddenContent,
    useItemLoginSchemaType,
  })(ItemScreenWrapper(rootId));
  return <Component />;
};

export default ItemPage;
