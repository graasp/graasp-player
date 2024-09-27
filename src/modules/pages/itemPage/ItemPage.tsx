import { useNavigate, useParams } from 'react-router-dom';

import { AccountType } from '@graasp/sdk';
import { ItemLoginWrapper } from '@graasp/ui';

import { HOME_PATH } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import {
  ITEM_LOGIN_PASSWORD_INPUT_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_USERNAME_INPUT_ID,
} from '@/config/selectors';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';

import ItemForbiddenScreen from '../../item/ItemForbiddenScreen';
import MainScreen from '../../item/MainScreen';
import { EnrollContent } from './EnrollContent';
import { RequestAccessContent } from './RequestAccessContent';

const { useItem, useItemLoginSchemaType, useCurrentMember } = hooks;

const ItemPage = (): JSX.Element | null => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const { data: itemLoginSchemaType, isLoading: isLoadingItemLoginSchemaType } =
    useItemLoginSchemaType({ itemId });
  const { data: currentAccount, isLoading: isLoadingMember } =
    useCurrentMember();

  if (!itemId) {
    navigate(HOME_PATH);
    return null;
  }
  return (
    <ItemLoginWrapper
      itemId={itemId}
      item={item}
      currentAccount={currentAccount}
      signIn={itemLoginSignIn}
      itemLoginSchemaType={itemLoginSchemaType}
      usernameInputId={ITEM_LOGIN_USERNAME_INPUT_ID}
      signInButtonId={ITEM_LOGIN_SIGN_IN_BUTTON_ID}
      passwordInputId={ITEM_LOGIN_PASSWORD_INPUT_ID}
      enrollContent={<EnrollContent itemId={itemId} />}
      forbiddenContent={<ItemForbiddenScreen />}
      requestAccessContent={
        currentAccount?.type === AccountType.Individual ? (
          <RequestAccessContent itemId={itemId} member={currentAccount} />
        ) : undefined
      }
      isLoading={
        isLoadingMember || isItemLoading || isLoadingItemLoginSchemaType
      }
    >
      <MainScreen />
      <PlayerCookiesBanner />
    </ItemLoginWrapper>
  );
};

export default ItemPage;
