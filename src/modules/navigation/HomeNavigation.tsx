import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { MainMenu } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import { buildMainPath } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import { MY_ITEMS_ID, SHOW_MORE_ITEMS_ID } from '@/config/selectors';
import { PLAYER } from '@/langs/constants';

import LoadingTree from './tree/LoadingTree';
import TreeView from './tree/TreeView';

const PAGE_SIZE = 20;

const HomeNavigation = (): JSX.Element | null => {
  const { t } = usePlayerTranslation();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<DiscriminatedItem[]>([]);

  const { data: accessibleItems, isLoading: isLoadingAccessibleItems } =
    hooks.useAccessibleItems({}, { page, pageSize: PAGE_SIZE });

  const allPagesItems = allItems.concat(accessibleItems?.data ?? []);

  if (allPagesItems) {
    return (
      <Box m={1}>
        <MainMenu>
          <TreeView
            id={MY_ITEMS_ID}
            header={t(PLAYER.RECENT_ITEMS_TITLE)}
            rootItems={allPagesItems}
            items={allPagesItems}
            onTreeItemSelect={(payload) => {
              if (payload !== 'own') {
                navigate({
                  pathname: buildMainPath({ rootId: payload }),
                  search: searchParams.toString(),
                });
              }
            }}
          />
        </MainMenu>
        {accessibleItems?.totalCount &&
          page * PAGE_SIZE < accessibleItems.totalCount && (
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
          )}
      </Box>
    );
  }

  if (isLoadingAccessibleItems) {
    return <LoadingTree />;
  }

  return null;
};
export default HomeNavigation;
