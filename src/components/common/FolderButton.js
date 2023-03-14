import { Record } from 'immutable';
import truncate from 'lodash.truncate';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Tooltip, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { Card as GraaspCard } from '@graasp/ui';

import { DESCRIPTION_MAX_LENGTH } from '../../config/constants';
import image from '../../resources/avatar.png';
import { stripHtml } from '../../utils/item';
import { ItemContext } from '../context/ItemContext';

const StyledButton = styled('button')({
  textTransform: 'none',
  padding: 0,
  margin: 0,
  border: 0,
  background: 'transparent',
  textOverflow: 'ellipsis',
  maxWidth: '100%',

  '&:hover': {
    cursor: 'pointer',
  },
});

const Wrapper = ({ onClick }) => {
  const InnerChild = ({ children }) => (
    <StyledButton type="button" onClick={onClick}>
      {children}
    </StyledButton>
  );
  InnerChild.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return InnerChild;
};
Wrapper.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const FolderButton = ({ id, item }) => {
  const { setFocusedItemId } = useContext(ItemContext);
  const { description } = item;
  const { name } = item;

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
      NameWrapper={Wrapper({ onClick })}
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
