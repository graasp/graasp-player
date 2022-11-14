import { Record } from 'immutable';
import truncate from 'lodash.truncate';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Tooltip, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { Card as GraaspCard } from '@graasp/ui';

import {
  DEFAULT_IMAGE_SRC,
  DESCRIPTION_MAX_LENGTH,
} from '../../config/constants';
import { stripHtml } from '../../utils/item';
import { ItemContext } from '../context/ItemContext';

const StyledButton = styled('button')({
  textTransform: 'none',
  padding: 0,
  margin: 0,
  border: 0,
  background: 'transparent',

  '&:hover': {
    cursor: 'pointer',
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

  return (
    <GraaspCard
      // todo: responsive
      sx={{ maxWidth: '70vh' }}
      description={truncate(stripHtml(description), {
        length: DESCRIPTION_MAX_LENGTH,
      })}
      name={name}
      image={image}
      cardId={id}
      NameWrapper={({ children }) => (
        <StyledButton type="button" onClick={onClick}>
          {children}
        </StyledButton>
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
