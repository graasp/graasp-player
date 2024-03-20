import { useNavigate, useParams } from 'react-router-dom';

import { ItemLoginAuthorization } from '@graasp/ui';

import { HOME_PATH, ITEM_PARAM } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';

import ItemForbiddenScreen from '../item/ItemForbiddenScreen';
import MainScreen from '../item/MainScreen';

const { useItem, useItemLoginSchemaType, useCurrentMember } = hooks;

const ItemScreenWrapper = () => (
  <>
    <MainScreen />
    <PlayerCookiesBanner />
  </>
);

const { usePostItemLogin } = mutations;

const ItemPage = (): JSX.Element | null => {
  const { mutate: itemLoginSignIn } = usePostItemLogin();

  const itemId = useParams()[ITEM_PARAM];

  const navigate = useNavigate();

  const ForbiddenContent = <ItemForbiddenScreen />;

  if (!itemId) {
    navigate(HOME_PATH);
    return null;
  }

  const Component = ItemLoginAuthorization({
    signIn: itemLoginSignIn,
    // this is because the itemId can not be undefined in ui
    itemId,
    useCurrentMember,
    useItem,
    ForbiddenContent,
    useItemLoginSchemaType,
  })(ItemScreenWrapper);
  return <Component />;
};

export default ItemPage;
