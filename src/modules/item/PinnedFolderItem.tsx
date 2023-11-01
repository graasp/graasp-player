import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Tooltip, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { DiscriminatedItem } from '@graasp/sdk';
import { Card as GraaspCard } from '@graasp/ui';

import truncate from 'lodash.truncate';

import image from '@/assets/avatar.png';
import { useItemContext } from '@/contexts/ItemContext';

import { DESCRIPTION_MAX_LENGTH } from '../../config/constants';
import { stripHtml } from '../../utils/item';

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

const Wrapper = ({ onClick }: { onClick: () => void }) => {
  const InnerChild = ({ children }: { children: JSX.Element }) => (
    <StyledButton type="button" onClick={onClick}>
      {children}
    </StyledButton>
  );
  return InnerChild;
};

type Props = {
  item: DiscriminatedItem;
  id?: string;
};

const PinnedFolderItem = ({ id, item }: Props): JSX.Element => {
  const { setFocusedItemId } = useItemContext();
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

export default PinnedFolderItem;
