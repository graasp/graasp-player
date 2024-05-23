import { Link } from 'react-router-dom';

import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { DiscriminatedItem, ItemType, formatDate } from '@graasp/sdk';

import { usePlayerTranslation } from '@/config/i18n';

import { buildContentPagePath } from '../../config/paths';
import ItemThumbnail from './ItemThumbnail';

type Props = {
  item: DiscriminatedItem;
};

const SimpleCard = ({ item }: Props): JSX.Element => {
  const { i18n } = usePlayerTranslation();
  const link = buildContentPagePath({ rootId: item.id, itemId: item.id });

  return (
    <Card>
      <CardActionArea component={Link} to={link}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ItemThumbnail item={item} />
            <Stack minWidth={0}>
              <Typography
                variant="h5"
                component="h2"
                alignItems="center"
                textOverflow="ellipsis"
                overflow="hidden"
                noWrap
              >
                {
                  // this is because we currently only allow to change the displayName of text elements
                  item.type === ItemType.DOCUMENT ? item.displayName : item.name
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(item.updatedAt, { locale: i18n.language })}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SimpleCard;
