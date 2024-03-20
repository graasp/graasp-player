import { Link } from 'react-router-dom';

import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { ActionTriggers, DiscriminatedItem, formatDate } from '@graasp/sdk';

import { usePlayerTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';

import { buildContentPagePath } from '../../config/paths';
import { HIDDEN_STYLE } from './HiddenWrapper';
import ItemThumbnail from './ItemThumbnail';

type Props = {
  item: DiscriminatedItem;
  isHidden?: boolean;
};

const SimpleCard = ({ item, isHidden = false }: Props): JSX.Element => {
  const { i18n } = usePlayerTranslation();
  const link = buildContentPagePath({ rootId: item.id, itemId: item.id });

  const { mutate: triggerAction } = mutations.usePostItemAction();
  const handleCardClick = () => {
    // trigger player Action for item view
    triggerAction({
      itemId: item.id,
      payload: { type: ActionTriggers.ItemView },
    });
  };

  return (
    <Card style={isHidden ? HIDDEN_STYLE : undefined}>
      <CardActionArea component={Link} to={link} onClick={handleCardClick}>
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
