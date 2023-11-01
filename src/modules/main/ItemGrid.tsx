import { Grid, Typography } from '@mui/material';

import { DiscriminatedItem, ItemTagType } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';
import ItemCard from '@/modules/common/ItemCard';
import LoadingItemsIndicator from '@/modules/common/LoadingItemsIndicator';

const { useItemsTags } = hooks;

type Props = {
  isLoading: boolean;
  items?: DiscriminatedItem[];
  title: string;
};

const ItemGrid = ({ isLoading, items, title }: Props): JSX.Element | null => {
  const { data: itemsTags } = useItemsTags(items?.map(({ id }) => id));
  if (isLoading) {
    <LoadingItemsIndicator />;
  }

  if (!items?.length) {
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
                itemsTags?.data[item.id].find(
                  ({ type }) => type === ItemTagType.Hidden,
                ),
              )}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ItemGrid;
