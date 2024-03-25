import { useParams } from 'react-router-dom';

import PinIcon from '@mui/icons-material/PushPin';
import OutlinedPinIcon from '@mui/icons-material/PushPinOutlined';
import { IconButton } from '@mui/material';

import { ItemTagType } from '@graasp/sdk';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { ITEM_PINNED_BUTTON_ID } from '@/config/selectors';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';

const usePinnedItemsButton = (): { pinnedButton: JSX.Element | false } => {
  const { t } = usePlayerTranslation();
  const { togglePinned, isPinnedOpen } = useLayoutContext();
  const { itemId } = useParams();
  const { data: children } = hooks.useChildren(itemId);
  const { data: tags } = hooks.useItemsTags(children?.map(({ id }) => id));
  const pinnedCount =
    children?.filter(
      ({ id, settings: s }) =>
        s.isPinned &&
        // do not count hidden items as they are not displayed
        !tags?.data?.[id].some(({ type }) => type === ItemTagType.Hidden),
    )?.length || 0;

  if (pinnedCount > 0) {
    return {
      pinnedButton: (
        <IconButton
          key="pinnedButton"
          id={ITEM_PINNED_BUTTON_ID}
          color="primary"
          onClick={togglePinned}
          aria-label={
            isPinnedOpen
              ? t(PLAYER.HIDE_PINNED_ITEMS_TOOLTIP)
              : t(PLAYER.SHOW_PINNED_ITEMS_TOOLTIP)
          }
        >
          {isPinnedOpen ? <PinIcon /> : <OutlinedPinIcon />}
        </IconButton>
      ),
    };
  }
  return { pinnedButton: false };
};
export default usePinnedItemsButton;
