import {
  DiscriminatedItem,
  ThumbnailSize,
  ThumbnailSizeType,
  getMimetype,
} from '@graasp/sdk';
import { ItemIcon, Thumbnail } from '@graasp/ui';

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

  // fallback to item icon
  return (
    <ItemIcon
      type={item.type}
      mimetype={getMimetype(item.extra)}
      alt={item.name}
    />
  );
};
export default ItemThumbnail;
