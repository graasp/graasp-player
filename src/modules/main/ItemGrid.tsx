import { Grid, Typography } from '@mui/material';

import { ItemTagType } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import { hooks } from '@/config/queryClient';
import ItemCard from '@/modules/common/ItemCard';
import LoadingItemsIndicator from '@/modules/common/LoadingItemsIndicator';

const { useItemsTags } = hooks;

type Props = {
  isLoading: boolean;
  items?: List<ItemRecord>;
  title: string;
};

const ItemGrid = ({ isLoading, items, title }: Props): JSX.Element | null => {
  const { data: itemsTags } = useItemsTags(
    items?.map(({ id }) => id).toArray(),
  );
  if (isLoading) {
    <LoadingItemsIndicator />;
  }

  if (!items?.size) {
    return null;
  }
  return (
    <>
      <Typography variant="h4" mb={1}>
        {title}
      </Typography>
      <Grid container spacing={3} justifyItems="center">
        {items?.map((item) => (
          <Grid key={item.id} item lg={3} md={4} sm={6}>
            <ItemCard
              item={item}
              isHidden={Boolean(
                itemsTags?.data
                  .get(item.id)
                  .find(({ type }) => type === ItemTagType.Hidden),
              )}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ItemGrid;
