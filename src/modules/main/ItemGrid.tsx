import { Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

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
    <Stack direction="column" width="100%">
      <Typography variant="h4" component="h1" mb={1}>
        {title}
      </Typography>
      <Grid2 container spacing={3} justifyItems="center">
        {items?.map((item) => (
          <Grid2 key={item.id} xs={12} sm={6} md={4} xl={2}>
            <ItemCard item={item} />
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
};

export default ItemGrid;
