import { Record } from 'immutable';
import truncate from 'lodash.truncate';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { Tooltip, makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import { Card as GraaspCard } from '@graasp/ui';

import {
  DEFAULT_IMAGE_SRC,
  DESCRIPTION_MAX_LENGTH,
} from '../../config/constants';
import { stripHtml } from '../../utils/item';
import { ItemContext } from '../context/ItemContext';

const useStyles = makeStyles({
  card: {
    // todo: responsive
    maxWidth: '70vh',
  },
  link: {
    textTransform: 'none',
    padding: 0,
    margin: 0,
    border: 0,
    background: 'transparent',

    '&:hover': {
      cursor: 'pointer',
    },
  },
});

const FolderButton = ({ id, item }) => {
  const { setFocusedItemId } = useContext(ItemContext);
  const description = item.description;
  const name = item.name;

  const image = DEFAULT_IMAGE_SRC;

  const onClick = () => {
    setFocusedItemId(item.id);
  };

  const classes = useStyles();

  return (
    <GraaspCard
      className={classes.card}
      description={truncate(stripHtml(description), {
        length: DESCRIPTION_MAX_LENGTH,
      })}
      name={name}
      image={image}
      cardId={id}
      NameWrapper={({ children }) => (
        <button type="button" className={classes.link} onClick={onClick}>
          {children}
        </button>
      )}
      Actions={
        <Tooltip title="coming soon" aria-label="favorite">
          <span>
            <IconButton disabled>
              <StarBorderIcon />
            </IconButton>
          </span>
        </Tooltip>
      }
    />
  );
};

FolderButton.propTypes = {
  id: PropTypes.string,
  item: PropTypes.instanceOf(Record).isRequired,
};

FolderButton.defaultProps = {
  id: null,
};

export default FolderButton;
