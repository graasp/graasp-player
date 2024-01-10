import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Divider, Skeleton, Stack, styled } from '@mui/material';

import { Context, DiscriminatedItem } from '@graasp/sdk';
import { Button, Main, MainMenu } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import { buildMainPath } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import {
  HOME_NAVIGATION_STACK_ID,
  MY_ITEMS_ID,
  SHOW_MORE_ITEMS_ID,
} from '@/config/selectors';
import { PLAYER } from '@/langs/constants';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';
import HeaderNavigation from '@/modules/header/HeaderNavigation';
import HeaderRightContent from '@/modules/header/HeaderRightContent';
import ItemGrid from '@/modules/main/ItemGrid';
import TreeView from '@/modules/tree/TreeView';

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const { useAccessibleItems } = hooks;

const PAGE_SIZE = 20;

const HomePage = (): JSX.Element => {
  const { t } = usePlayerTranslation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<DiscriminatedItem[]>([]);

  const { data: accessibleItems, isLoading: isLoadingAccessibleItems } =
    useAccessibleItems({}, { page, pageSize: PAGE_SIZE });

  const allPagesItems = allItems.concat(accessibleItems?.data ?? []);

  const renderContent = () => (
    <Stack m={2} divider={<StyledDivider variant="middle" flexItem />}>
      <ItemGrid
        title={t(PLAYER.RECENT_ITEMS_TITLE)}
        isLoading={isLoadingAccessibleItems}
        items={allPagesItems}
      />
    </Stack>
  );

  const renderOwnItemsMenu = () => {
    const rootOwnId = 'own';

    if (isLoadingAccessibleItems) {
      return <Skeleton />;
    }

    if (!accessibleItems?.data?.length) {
      return null;
    }

    return (
      <MainMenu>
        <TreeView
          sx={{ mt: 1 }}
          id={MY_ITEMS_ID}
          header={t(PLAYER.RECENT_ITEMS_TITLE)}
          rootItems={allPagesItems}
          items={allPagesItems}
          onTreeItemSelect={(payload) => {
            if (payload !== rootOwnId) {
              navigate(buildMainPath({ rootId: payload }));
            }
          }}
        />
      </MainMenu>
    );
  };

  const showMoreButton =
    accessibleItems?.totalCount &&
    page * PAGE_SIZE < accessibleItems.totalCount ? (
      <Button
        id={SHOW_MORE_ITEMS_ID}
        sx={{ mx: 2 }}
        variant="text"
        onClick={() => {
          setAllItems(allPagesItems);
          setPage(page + 1);
        }}
      >
        {t(PLAYER.SHOW_MORE)}
      </Button>
    ) : (
      // todo: this should be null, but Main component does not allow it, because the typing there is dumb
      // replace with null once Main accepts null as valid components
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <></>
    );

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
          </Stack>
        </>
      }
      headerLeftContent={<HeaderNavigation />}
      headerRightContent={<HeaderRightContent />}
    >
      {renderContent()}
      {showMoreButton}
      <PlayerCookiesBanner />
    </Main>
  );
};

export default HomePage;
