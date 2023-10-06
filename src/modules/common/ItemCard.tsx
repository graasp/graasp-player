import { Link } from 'react-router-dom';

import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { DiscriminatedItem, ItemType, Triggers } from '@graasp/sdk';
import { ItemIcon } from '@graasp/ui';

import { mutations } from '@/config/queryClient';

import { buildMainPath } from '../../config/paths';
import { HIDDEN_STYLE } from './HiddenWrapper';

type Props = {
  item: DiscriminatedItem;
  isHidden?: boolean;
};

const SimpleCard = ({ item, isHidden = false }: Props): JSX.Element => {
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
  return (
    <Card style={isHidden ? HIDDEN_STYLE : undefined}>
      <CardActionArea component={Link} to={link} onClick={handleCardClick}>
        <CardContent>
          <Stack direction="row" alignItems="center">
            <ItemIcon
              type={item.type}
              extra={extra}
              alt={item.name}
              sx={{ mr: 1 }}
            />
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
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SimpleCard;
