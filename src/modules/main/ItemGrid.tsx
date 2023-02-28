import { Grid, Typography } from '@mui/material';

import { ItemRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import ItemCard from '@/modules/common/ItemCard';
import LoadingItemsIndicator from '@/modules/common/LoadingItemsIndicator';

type Props = {
  isLoading: boolean;
  items?: List<ItemRecord>;
  title: string;
};

const ItemGrid = ({ isLoading, items, title }: Props): JSX.Element | null => {
  if (isLoading) {
    <LoadingItemsIndicator />;
  }

  if (!items?.size) {
    return null;
  }
  return (
    <>
      <Typography variant="h4">{title}</Typography>
      <Grid container spacing={3} justifyItems="center">
        {items?.map((i) => (
          <Grid key={i.id} item lg={3} md={4} sm={6}>
            <ItemCard item={i} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ItemGrid;
