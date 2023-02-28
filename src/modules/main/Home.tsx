import { useNavigate } from 'react-router';

import { Box, Divider, styled } from '@mui/material';

import { COOKIE_KEYS, Context } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { CookiesBanner, Loader, Main, MainMenu } from '@graasp/ui';

import { List } from 'immutable';

import { DOMAIN } from '@/config/env';
import { useCommonTranslation } from '@/config/i18n';
import { buildMainPath } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import { MY_ITEMS_ID, SHARED_ITEMS_ID } from '@/config/selectors';
import HeaderNavigation from '@/modules/header/HeaderNavigation';
import HeaderRightContent from '@/modules/header/HeaderRightContent';
import ItemGrid from '@/modules/main/ItemGrid';
import DynamicTreeView from '@/modules/tree/DynamicTreeView';
import { isHidden } from '@/utils/item';

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const { useOwnItems, useSharedItems, useItemsTags } = hooks;

const Home = (): JSX.Element => {
  const { t } = useCommonTranslation();
  const navigate = useNavigate();

  const { data: ownItems, isLoading: isLoadingOwnItems } = useOwnItems();
  // todo: change in query-client to not query when list of ids is undefined
  const { data: ownItemsTags, isLoading: isLoadingOwnTags } = useItemsTags(
    ownItems?.map(({ id }) => id).toArray() || [],
  );
  const { data: sharedItems, isLoading: isLoadingSharedItems } =
    useSharedItems();
  // todo: change in query-client to not query when list of ids is undefined
  const { data: sharedItemsTags, isLoading: isLoadingSharedTags } =
    useItemsTags(sharedItems?.map(({ id }) => id).toArray() || []);

  const filtred = ownItems?.filter(
    (_item, idx) => !isLoadingOwnTags && !isHidden(ownItemsTags?.get(idx)),
  );

  const shared = sharedItems?.filter(
    (_item, idx) =>
      !isLoadingSharedTags && !isHidden(sharedItemsTags?.get(idx)),
  );

  const renderContent = () => (
    <Box margin={2} alignItems="center">
      <ItemGrid
        title={t(COMMON.USER_OWN_ITEMS)}
        isLoading={isLoadingOwnItems}
        items={filtred}
      />
      <StyledDivider />
      <ItemGrid
        title={t(COMMON.USER_SHARED_WITH_ITEMS)}
        isLoading={isLoadingSharedItems}
        items={shared}
      />
    </Box>
  );

  const renderOwnItemsMenu = () => {
    const rootOwnId = 'own';

    if (isLoadingOwnItems) {
      return <Loader />;
    }

    if (!ownItems?.size) {
      return null;
    }

    return (
      <MainMenu>
        <DynamicTreeView
          id={MY_ITEMS_ID}
          rootLabel={t(COMMON.USER_OWN_ITEMS)}
          rootId={rootOwnId}
          initialExpendedItems={[rootOwnId]}
          onTreeItemSelect={(payload) => {
            if (payload !== rootOwnId) {
              navigate(buildMainPath({ rootId: payload }));
            }
          }}
          items={filtred || List()}
          selectedId=""
        />
      </MainMenu>
    );
  };

  const renderSharedItemsMenu = () => {
    const rootSharedId = 'shared';

    if (isLoadingSharedItems) {
      return <Loader />;
    }

    if (!shared?.size) {
      return null;
    }

    return (
      <MainMenu>
        <DynamicTreeView
          id={SHARED_ITEMS_ID}
          rootLabel={t(COMMON.USER_SHARED_WITH_ITEMS)}
          rootId={rootSharedId}
          initialExpendedItems={[]}
          onTreeItemSelect={(payload) => {
            if (payload !== rootSharedId) {
              navigate(buildMainPath({ rootId: payload }));
            }
          }}
          items={shared}
        />
      </MainMenu>
    );
  };

  const sidebar = (
    <>
      <div style={{ height: '15px' }} />
      {renderOwnItemsMenu()}
      {renderSharedItemsMenu()}
    </>
  );

  return (
    <Main
      open
      context={Context.PLAYER}
      sidebar={sidebar}
      headerLeftContent={<HeaderNavigation />}
      headerRightContent={<HeaderRightContent />}
    >
      <CookiesBanner
        acceptText={t(COMMON.COOKIE_BANNER_ACCEPT_BUTTON)}
        declineButtonText={t(COMMON.COOKIE_BANNER_DECLINE_BUTTON)}
        cookieName={COOKIE_KEYS.ACCEPT_COOKIES_KEY}
        text={t(COMMON.COOKIE_BANNER_TEXT)}
        domain={DOMAIN}
      />
      {renderContent()}
    </Main>
  );
};

export default Home;
