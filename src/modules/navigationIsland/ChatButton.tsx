import { useParams } from 'react-router-dom';

import { Tooltip } from '@mui/material';

import { ItemType, PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import { MessageSquareOff, MessageSquareText } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '@/config/selectors';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';

import { ToolButton } from './CustomButtons';

const useChatButton = (): { chatButton: JSX.Element | null } => {
  const { t } = usePlayerTranslation();
  const { itemId, rootId } = useParams();
  const { data: item } = hooks.useItem(itemId);
  const { data: root } = hooks.useItem(rootId);
  const { data: descendants } = hooks.useDescendants({
    id: rootId,
    // only fetch folder descendants as this is what the button will show
    types: [ItemType.FOLDER],
    showHidden: false,
  });
  const { toggleChatbox, isChatboxOpen } = useLayoutContext();

  const chatEnabledItems = descendants?.filter(
    ({ settings }) => settings.showChatbox,
  );

  if ((chatEnabledItems ?? []).length > 0 || root?.settings.showChatbox) {
    const canWrite = item?.permission
      ? PermissionLevelCompare.gte(item?.permission, PermissionLevel.Write)
      : false;

    const isDisabled = !item?.settings?.showChatbox;
    const tooltip = canWrite
      ? t(PLAYER.NAVIGATION_ISLAND_CHAT_BUTTON_HELPER_TEXT_WRITERS)
      : t(PLAYER.NAVIGATION_ISLAND_CHAT_BUTTON_HELPER_TEXT_READERS);

    return {
      chatButton: (
        <Tooltip title={isDisabled ? tooltip : undefined} arrow>
          <span>
            <ToolButton
              disabled={isDisabled}
              key="chatButton"
              id={ITEM_CHATBOX_BUTTON_ID}
              onClick={toggleChatbox}
              aria-label={
                isChatboxOpen
                  ? t(PLAYER.HIDE_CHAT_TOOLTIP)
                  : t(PLAYER.SHOW_CHAT_TOOLTIP)
              }
            >
              {isChatboxOpen ? <MessageSquareOff /> : <MessageSquareText />}
            </ToolButton>
          </span>
        </Tooltip>
      ),
    };
  }
  // disable the chat button if there are no items with the chat enabled
  return { chatButton: null };
};
export default useChatButton;
