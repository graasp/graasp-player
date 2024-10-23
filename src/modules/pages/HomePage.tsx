import { ReactNode, useState } from 'react';
import { Helmet } from 'react-helmet';

import {
  Alert,
  Grid2 as Grid,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  HOME_PAGE_PAGINATION_ID,
  buildHomePaginationId,
} from '@/config/selectors';
import { PLAYER } from '@/langs/constants';
import PlayerCookiesBanner from '@/modules/cookies/PlayerCookiesBanner';

import ItemCard from '../common/ItemCard';
import LoadingItemsIndicator from '../common/LoadingItemsIndicator';

const { useAccessibleItems } = hooks;

// should be a multiple of 6 to create full pages that split into 2, 3 and 6 columns
const PAGE_SIZE = 24;

const GridWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }}>{children}</Grid>
);

const DisplayItems = ({
  items,
  isLoading,
}: {
  items?: PackedItem[];
  isLoading: boolean;
}): ReactNode | null => {
  const { t } = usePlayerTranslation();

  if (items) {
    if (!items.length) {
      return (
        <Alert severity="info" sx={{ m: 1, width: '100%' }}>
          {t(PLAYER.HOME_EMPTY)}
        </Alert>
      );
    }

    return items.map((item) => (
      <GridWrapper key={item.id}>
        <ItemCard item={item} />
      </GridWrapper>
    ));
  }
  if (isLoading) {
    return Array.from(Array(6)).map((i) => (
      <GridWrapper key={i}>
        <LoadingItemsIndicator />
      </GridWrapper>
    ));
  }
  return null;
};

const HomePage = (): JSX.Element => {
  const { t } = usePlayerTranslation();

  const [page, setPage] = useState(1);

  const { data: accessibleItems, isLoading } = useAccessibleItems(
    {},
    { page, pageSize: PAGE_SIZE },
  );

  return (
    <>
      <Helmet>
        <title> {t(PLAYER.HOME_PAGE_TITLE)}</title>
      </Helmet>
      <Stack m={2} direction="column" alignItems="center" spacing={4}>
        <Stack direction="column" width="100%">
          <Typography variant="h4" component="h1" mb={1}>
            {t(PLAYER.RECENT_ITEMS_TITLE)}
          </Typography>
          <Grid container spacing={3} justifyItems="center">
            <DisplayItems items={accessibleItems?.data} isLoading={isLoading} />
          </Grid>
        </Stack>
        <Pagination
          id={HOME_PAGE_PAGINATION_ID}
          count={Math.ceil((accessibleItems?.totalCount ?? 0) / PAGE_SIZE)}
          page={page}
          // use the render prop to add a unique id that we can use for tests
          renderItem={(props) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <PaginationItem {...props} id={buildHomePaginationId(props.page)} />
          )}
          onChange={(_, newPage) => setPage(newPage)}
        />
        <PlayerCookiesBanner />
      </Stack>
    </>
  );
};

export default HomePage;
