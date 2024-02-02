import {
  DiscriminatedItem,
  ThumbnailSize,
  ThumbnailSizeType,
} from '@graasp/sdk';
import { Thumbnail } from '@graasp/ui';

import { hooks } from '@/config/queryClient';

type Props = {
  item: DiscriminatedItem;
  size?: ThumbnailSizeType;
};
const ItemThumbnail = ({
  item,
  size = ThumbnailSize.Small,
}: Props): JSX.Element | null => {
  const { data: thumbnailSrc, isLoading } = hooks.useItemThumbnailUrl({
    id: item.id,
    size,
  });

  if (thumbnailSrc) {
    return (
      <Thumbnail
        alt={`Illustration for ${item.name}`}
        url={thumbnailSrc}
        sx={{ borderRadius: 1 }}
      />
    );
  }

  if (isLoading) {
    return <Thumbnail alt="loading icon" isLoading />;
  }
  return null;
};
export default ItemThumbnail;
