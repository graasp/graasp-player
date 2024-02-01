import { Box, Grid, Typography } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import ItemCard from '@/modules/common/ItemCard';
import LoadingItemsIndicator from '@/modules/common/LoadingItemsIndicator';

type Props = {
  isLoading: boolean;
  items?: DiscriminatedItem[];
  title: string;
};

const ItemGrid = ({ isLoading, items, title }: Props): JSX.Element | null => {
  if (isLoading) {
    return <LoadingItemsIndicator />;
  }

  if (!items?.length) {
    return null;
  }
  return (
    <Box width="100%">
      <Typography variant="h4" mb={1}>
        {title}
      </Typography>
      <Grid container spacing={3} justifyItems="center">
        {items?.map((item) => (
          <Grid key={item.id} item lg={3} md={4} sm={6}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ItemGrid;
