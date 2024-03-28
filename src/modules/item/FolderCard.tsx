import { Link, useParams } from 'react-router-dom';

import { styled } from '@mui/material';

import { DiscriminatedItem, ThumbnailSize } from '@graasp/sdk';
import { Card as GraaspCard, TextDisplay } from '@graasp/ui';

import image from '@/assets/avatar.png';
import { buildContentPagePath } from '@/config/paths';
import { hooks } from '@/config/queryClient';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
}));

type Props = {
  item: DiscriminatedItem;
  id?: string;
  keepRoot?: boolean;
};

const FolderCard = ({ id, item, keepRoot = true }: Props): JSX.Element => {
  const { rootId } = useParams();
  const { id: itemId, description, name } = item;
  const { data: thumbnail } = hooks.useItemThumbnailUrl({
    id: item.id,
    size: ThumbnailSize.Medium,
  });

  return (
    <StyledLink
      to={buildContentPagePath({ rootId: keepRoot ? rootId : itemId, itemId })}
    >
      <GraaspCard
        description={<TextDisplay content={description ?? ''} />}
        name={name}
        image={thumbnail ?? image}
        cardId={id}
      />
    </StyledLink>
  );
};

export default FolderCard;
