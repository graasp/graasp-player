import { useNavigate } from 'react-router';

import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { ItemRecord } from '@graasp/sdk/frontend';
import { ItemIcon } from '@graasp/ui';

import { buildMainPath } from '../../config/paths';

type Props = {
  item: ItemRecord;
};

const SimpleCard = ({ item }: Props): JSX.Element => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(buildMainPath({ rootId: item.id }));
  };

  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack direction="row" alignItems="center">
            <ItemIcon
              type={item.type}
              extra={item.extra}
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
