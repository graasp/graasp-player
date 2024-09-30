import { useParams } from 'react-router-dom';

import { Tooltip } from '@mui/material';

import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import { Pin, PinOff } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { ITEM_PINNED_BUTTON_ID } from '@/config/selectors';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';

import { ToolButton } from './CustomButtons';

const usePinnedItemsButton = (): { pinnedButton: JSX.Element | null } => {
  const { t } = usePlayerTranslation();
  const { togglePinned, isPinnedOpen } = useLayoutContext();
  const { itemId } = useParams();
  const { data: item } = hooks.useItem(itemId);
  const { data: children } = hooks.useChildren(itemId, undefined, {
    enabled: !!item,
  });

  const childrenPinnedCount =
    children?.filter(({ settings: s, hidden }) => s.isPinned && !hidden)
      ?.length || 0;

  // don't show the button if there are no items pinned in all descendants
  if (childrenPinnedCount <= 0) {
    return { pinnedButton: null };
  }

  const canWrite = item?.permission
    ? PermissionLevelCompare.gte(item?.permission, PermissionLevel.Write)
    : false;
  // we should show the icon as open if there are pinned items and the drawer is open
  const isOpen = isPinnedOpen && childrenPinnedCount > 0;

  const isDisabled = childrenPinnedCount <= 0;
  const tooltip = canWrite
    ? t(PLAYER.NAVIGATION_ISLAND_PINNED_BUTTON_HELPER_TEXT_WRITERS)
    : t(PLAYER.NAVIGATION_ISLAND_PINNED_BUTTON_HELPER_TEXT_READERS);

  return {
    pinnedButton: (
      <Tooltip title={isDisabled ? tooltip : undefined} arrow>
        <span>
          <ToolButton
            disabled={isDisabled}
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
        </span>
      </Tooltip>
    ),
  };
};
export default usePinnedItemsButton;
