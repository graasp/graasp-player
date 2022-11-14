import truncate from 'lodash.truncate';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { ItemIcon } from '@graasp/ui';

import { ITEM_CARD_MAX_LENGTH } from '../../config/constants';
import { buildMainPath } from '../../config/paths';

const SimpleCard = ({ item }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(buildMainPath({ rootId: item.id, id: null }));
  };
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            display="flex"
            alignItems="center"
          >
            <ItemIcon
              type={item.type}
              extra={item.extra}
              name={item.name}
              sx={{ mr: 1 }}
            />
            {truncate(item.name, { length: ITEM_CARD_MAX_LENGTH })}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

SimpleCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    extra: PropTypes.shape({}).isRequired,
  }).isRequired,
};

export default SimpleCard;
