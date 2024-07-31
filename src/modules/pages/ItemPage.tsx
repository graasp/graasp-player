import { useNavigate, useParams } from 'react-router-dom';

import { Container, Stack, Typography, styled } from '@mui/material';

import { ItemLoginSchemaType } from '@graasp/sdk';
import { Button, CustomInitialLoader, ItemLoginScreen } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import { HOME_PATH } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import {
  ITEM_LOGIN_PASSWORD_INPUT_ID,
  ITEM_LOGIN_SIGN_IN_BUTTON_ID,
  ITEM_LOGIN_USERNAME_INPUT_ID,
} from '@/config/selectors';
import { PLAYER } from '@/langs/constants';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';

import ItemForbiddenScreen from '../item/ItemForbiddenScreen';
import MainScreen from '../item/MainScreen';

const { useItem, useItemLoginSchemaType, useCurrentMember } = hooks;

const ScreenWrapper = styled(Container)(() => ({
  height: '100%',
}));

const EnrollScreen = () => {
  const { t } = usePlayerTranslation();

  return (
    <ScreenWrapper>
      <Stack
        direction="column"
        gap={2}
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography variant="h2">{t(PLAYER.ENROLL_SCREEN_TITLE)}</Typography>
        <Typography>{t(PLAYER.ENROLL_SCREEN_DESCRIPTION)}</Typography>
        <Button
          onClick={() => {
            // todo use mutation
            // eslint-disable-next-line no-console
            console.log('enroll');
          }}
        >
          {t(PLAYER.ENROLL_BUTTON_TEXT)}
        </Button>
      </Stack>
    </ScreenWrapper>
  );
};
const LogoutMessage = () => (
  <Stack direction="column" gap={2}>
    <Typography>
      You need to logout to access this item with pre-defined username and
      password combinations
    </Typography>
    <Button
      onClick={() => {
        // eslint-disable-next-line no-console
        console.log('logout');
      }}
    >
      Log out
    </Button>
  </Stack>
);

const ItemScreenWrapper = () => (
  <>
    <MainScreen />
    <PlayerCookiesBanner />
  </>
);

const ItemPage = (): JSX.Element | null => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { mutate: itemLoginSignIn } = mutations.usePostItemLogin();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const { data: itemLoginSchemaType, isLoading: isLoadingItemLoginSchemaType } =
    useItemLoginSchemaType({ itemId });
  const { data: member, isLoading: isLoadingMember } = useCurrentMember();

  if (!itemId) {
    navigate(HOME_PATH);
    return null;
  }

  // the item could be fetched without errors
  // because the user is signed in and has access
  // or because the item is public
  if (item) {
    return <ItemScreenWrapper />;
  }

  // item login exists
  if (itemLoginSchemaType) {
    // if the user is logged
    if (member) {
      if (itemLoginSchemaType === ItemLoginSchemaType.Username) {
        // allow the user to create a membership in order to access the item
        return <EnrollScreen />;
      }
      return <LogoutMessage />;
    }

    return (
      <ItemLoginScreen
        itemId={itemId}
        signIn={itemLoginSignIn}
        itemLoginSchemaType={itemLoginSchemaType}
        usernameInputId={ITEM_LOGIN_USERNAME_INPUT_ID}
        signInButtonId={ITEM_LOGIN_SIGN_IN_BUTTON_ID}
        passwordInputId={ITEM_LOGIN_PASSWORD_INPUT_ID}
      />
    );
  }

  if (isLoadingMember || isItemLoading || isLoadingItemLoginSchemaType) {
    return <CustomInitialLoader />;
  }

  // either the item does not allow item login
  // or the user is already signed in as normal user and hasn't the access to this item
  return <ItemForbiddenScreen />;
};

export default ItemPage;
