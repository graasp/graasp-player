import { useState } from 'react';

import { Pagination, Stack } from '@mui/material';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { PLAYER } from '@/langs/constants';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';
import ItemGrid from '@/modules/main/ItemGrid';

const { useAccessibleItems } = hooks;

const PAGE_SIZE = 20;

const HomePage = (): JSX.Element => {
  const { t } = usePlayerTranslation();

  const [page, setPage] = useState(1);

  const { data: accessibleItems, isLoading: isLoadingAccessibleItems } =
    useAccessibleItems({}, { page, pageSize: PAGE_SIZE });

  return (
    <Stack m={2} direction="column" alignItems="center" spacing={4}>
      <ItemGrid
        title={t(PLAYER.RECENT_ITEMS_TITLE)}
        isLoading={isLoadingAccessibleItems}
        items={accessibleItems?.data}
      />
      <Pagination
        count={Math.floor((accessibleItems?.totalCount ?? 0) / PAGE_SIZE) + 1}
        page={page}
        onChange={(_, newPage) => setPage(newPage)}
      />
      <PlayerCookiesBanner />
    </Stack>
  );
};

export default HomePage;
