import { useParams } from 'react-router-dom';

import { ItemTagType } from '@graasp/sdk';

import { Pin, PinOff } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { ITEM_PINNED_BUTTON_ID } from '@/config/selectors';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';

import { ToolButton } from './CustomButtons';

const usePinnedItemsButton = (): { pinnedButton: JSX.Element | false } => {
  const { t } = usePlayerTranslation();
  const { togglePinned, isPinnedOpen } = useLayoutContext();
  const { itemId } = useParams();
  const { data: item } = hooks.useItem(itemId);
  const { data: children } = hooks.useChildren(itemId, undefined, {
    enabled: !!item,
  });
  const { data: tags } = hooks.useItemsTags(children?.map(({ id }) => id));
  const pinnedCount =
    children?.filter(
      ({ id, settings: s }) =>
        s.isPinned &&
        // do not count hidden items as they are not displayed
        !tags?.data?.[id].some(({ type }) => type === ItemTagType.Hidden),
    )?.length || 0;

  // we should show the icon as open if there are pinned items and the drawer is open
  const isOpen = isPinnedOpen && pinnedCount > 0;

  return {
    pinnedButton: (
      <ToolButton
        disabled={pinnedCount <= 0}
        key="pinnedButton"
        id={ITEM_PINNED_BUTTON_ID}
        onClick={togglePinned}
        aria-label={
          isOpen
            ? t(PLAYER.HIDE_PINNED_ITEMS_TOOLTIP)
            : t(PLAYER.SHOW_PINNED_ITEMS_TOOLTIP)
        }
      >
        {isOpen ? <PinOff /> : <Pin />}
      </ToolButton>
    ),
  };
};
export default usePinnedItemsButton;
