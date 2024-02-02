import { Link } from 'react-router-dom';

import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { DiscriminatedItem, ItemType, Triggers, formatDate } from '@graasp/sdk';
import { ItemIcon } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';

import { buildMainPath } from '../../config/paths';
import { HIDDEN_STYLE } from './HiddenWrapper';
import ItemThumbnail from './ItemThumbnail';

type Props = {
  item: DiscriminatedItem;
  isHidden?: boolean;
};

const SimpleCard = ({ item, isHidden = false }: Props): JSX.Element => {
  const { i18n } = usePlayerTranslation();
  const link = buildMainPath({ rootId: item.id });
  const extra =
    item.type === ItemType.LOCAL_FILE || item.type === ItemType.S3_FILE
      ? item.extra
      : undefined;

  const { mutate: triggerAction } = mutations.usePostItemAction();
  const handleCardClick = () => {
    // trigger player Action for item view
    triggerAction({ itemId: item.id, payload: { type: Triggers.ItemView } });
  };

  const { hasThumbnail } = item.settings;

  return (
    <Card style={isHidden ? HIDDEN_STYLE : undefined}>
      <CardActionArea component={Link} to={link} onClick={handleCardClick}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            {hasThumbnail ? (
              <ItemThumbnail item={item} />
            ) : (
              <ItemIcon type={item.type} extra={extra} alt={item.name} />
            )}
            <Stack minWidth={0}>
              <Typography
                variant="h5"
                component="h2"
                alignItems="center"
                textOverflow="ellipsis"
                overflow="hidden"
                noWrap
              >
                {item.name}
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
