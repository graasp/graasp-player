import {
  DiscriminatedItem,
  ThumbnailSize,
  ThumbnailSizeType,
  getMimetype,
} from '@graasp/sdk';
import { ItemIcon } from '@graasp/ui';

import { hooks } from '@/config/queryClient';

type Props = {
  item: DiscriminatedItem;
  size?: ThumbnailSizeType;
};
const ItemThumbnail = ({
  item,
  size = ThumbnailSize.Small,
}: Props): JSX.Element | null => {
  const { data: thumbnailSrc } = hooks.useItemThumbnailUrl({
    id: item.id,
    size,
  });

  return (
    <ItemIcon
      type={item.type}
      mimetype={getMimetype(item.extra)}
      alt={item.name}
      iconSrc={thumbnailSrc}
      sx={{ borderRadius: 1 }}
    />
  );
};
export default ItemThumbnail;
