import { useNavigate, useParams } from 'react-router-dom';

import { ItemLoginAuthorization } from '@graasp/ui';

import { HOME_PATH, ITEM_PARAM } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';

import ItemForbiddenScreen from '../item/ItemForbiddenScreen';
import MainScreen from '../item/MainScreen';

const { useItem, useItemLoginSchemaType, useCurrentMember } = hooks;

const { usePostItemLogin } = mutations;

const ItemPage = (): JSX.Element | null => {
  const itemId = useParams()[ITEM_PARAM];
  const { mutate: itemLoginSignIn } = usePostItemLogin();
  const { data: currentAccount } = useCurrentMember();
  const { data: item } = useItem(itemId);
  const { data: itemLoginSchemaType } = useItemLoginSchemaType({ itemId });

  const navigate = useNavigate();

  const ForbiddenContent = <ItemForbiddenScreen />;

  if (!itemId) {
    navigate(HOME_PATH);
    return null;
  }

  return (
    <ItemLoginAuthorization
      signIn={itemLoginSignIn}
      // this is because the itemId can not be undefined in ui
      itemId={itemId}
      currentAccount={currentAccount}
      item={item}
      itemLoginSchemaType={itemLoginSchemaType}
      ForbiddenContent={ForbiddenContent}
    >
      <MainScreen />
      <PlayerCookiesBanner />
    </ItemLoginAuthorization>
  );
};

export default ItemPage;
