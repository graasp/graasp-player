import { useNavigate } from 'react-router';

import { Divider, Skeleton, Stack, styled } from '@mui/material';

import { Context } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Main, MainMenu } from '@graasp/ui';

import { useCommonTranslation } from '@/config/i18n';
import { buildMainPath } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import {
  HOME_NAVIGATION_STACK_ID,
  MY_ITEMS_ID,
  SHARED_ITEMS_ID,
} from '@/config/selectors';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';
import HeaderNavigation from '@/modules/header/HeaderNavigation';
import HeaderRightContent from '@/modules/header/HeaderRightContent';
import ItemGrid from '@/modules/main/ItemGrid';
import DynamicTreeView from '@/modules/tree/DynamicTreeView';
import { isHidden } from '@/utils/item';

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const { useOwnItems, useSharedItems, useItemsTags } = hooks;

const HomePage = (): JSX.Element => {
  const { t } = useCommonTranslation();
  const navigate = useNavigate();

  const { data: ownItems, isLoading: isLoadingOwnItems } = useOwnItems();

  const { data: sharedItems, isLoading: isLoadingSharedItems } =
    useSharedItems();
  const { data: sharedItemsTags, isLoading: isLoadingSharedTags } =
    useItemsTags(sharedItems?.map(({ id }) => id));

  const shared = sharedItems?.filter(
    (item) =>
      !isLoadingSharedTags && !isHidden(item, sharedItemsTags?.data?.[item.id]),
  );

  const renderContent = () => (
    <Stack m={2} divider={<StyledDivider variant="middle" flexItem />}>
      <ItemGrid
        title={t(COMMON.USER_OWN_ITEMS)}
        isLoading={isLoadingOwnItems}
        items={ownItems}
      />
      <ItemGrid
        title={t(COMMON.USER_SHARED_WITH_ITEMS)}
        isLoading={isLoadingSharedItems}
        items={sharedItems}
      />
    </Stack>
  );

  const renderOwnItemsMenu = () => {
    const rootOwnId = 'own';

    if (isLoadingOwnItems) {
      return <Skeleton />;
    }

    if (!ownItems?.length) {
      return null;
    }

    return (
      <MainMenu>
        <DynamicTreeView
          id={MY_ITEMS_ID}
          header={t(COMMON.USER_OWN_ITEMS)}
          items={ownItems}
          onTreeItemSelect={(payload) => {
            if (payload !== rootOwnId) {
              navigate(buildMainPath({ rootId: payload }));
            }
          }}
          onlyShowContainerItems
        />
      </MainMenu>
    );
  };

  const renderSharedItemsMenu = () => {
    const rootSharedId = 'shared';

    if (isLoadingSharedItems) {
      return <Skeleton />;
    }

    if (!shared?.length) {
      return null;
    }

    return (
      <MainMenu>
        <DynamicTreeView
          id={SHARED_ITEMS_ID}
          header={t(COMMON.USER_SHARED_WITH_ITEMS)}
          items={shared}
          initialExpendedItems={[]}
          onTreeItemSelect={(payload) => {
            if (payload !== rootSharedId) {
              navigate(buildMainPath({ rootId: payload }));
            }
          }}
          onlyShowContainerItems
        />
      </MainMenu>
    );
  };

  return (
    <Main
      open
      context={Context.Player}
      sidebar={
        <>
          <div style={{ height: '15px' }} />
          <Stack
            id={HOME_NAVIGATION_STACK_ID}
            divider={<Divider variant="middle" flexItem />}
          >
            {renderOwnItemsMenu()}
            {renderSharedItemsMenu()}
          </Stack>
        </>
      }
      headerLeftContent={<HeaderNavigation />}
      headerRightContent={<HeaderRightContent />}
    >
      {renderContent()}
      <PlayerCookiesBanner />
    </Main>
  );
};

export default HomePage;
