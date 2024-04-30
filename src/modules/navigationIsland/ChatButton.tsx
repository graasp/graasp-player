import { useParams } from 'react-router-dom';

import { Tooltip } from '@mui/material';

import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import { MessageSquareOff, MessageSquareText } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '@/config/selectors';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';

import { ToolButton } from './CustomButtons';

const useChatButton = (): { chatButton: JSX.Element | false } => {
  const { t } = usePlayerTranslation();
  const { itemId } = useParams();
  const { data: item } = hooks.useItem(itemId);
  const { toggleChatbox, isChatboxOpen } = useLayoutContext();
  const canWrite = item?.permission
    ? PermissionLevelCompare.gte(item?.permission, PermissionLevel.Write)
    : false;
  // do not show chatbox button is chatbox setting is not enabled
  // if () {
  //   return { chatButton: false };
  // }

  return {
    chatButton: (
      <Tooltip
        title={
          canWrite
            ? t(PLAYER.NAVIGATION_ISLAND_CHAT_BUTTON_HELPER_TEXT_WRITERS)
            : t(PLAYER.NAVIGATION_ISLAND_CHAT_BUTTON_HELPER_TEXT_READERS)
        }
        arrow
      >
        <ToolButton
          disabled={!item?.settings?.showChatbox}
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
      </Tooltip>
    ),
  };
};
export default useChatButton;
