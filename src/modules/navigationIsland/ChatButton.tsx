import { useParams } from 'react-router-dom';

import ChatIcon from '@mui/icons-material/Forum';
import ChatClosedIcon from '@mui/icons-material/ForumOutlined';
import { IconButton } from '@mui/material';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '@/config/selectors';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';

const useChatButton = (): { chatButton: JSX.Element | false } => {
  const { t } = usePlayerTranslation();
  const { itemId } = useParams();
  const { data: item } = hooks.useItem(itemId);
  const { toggleChatbox, isChatboxOpen } = useLayoutContext();

  // do not show chatbox button is chatbox setting is not enabled
  if (!item?.settings?.showChatbox) {
    return { chatButton: false };
  }

  return {
    chatButton: (
      <IconButton
        key="chatButton"
        id={ITEM_CHATBOX_BUTTON_ID}
        color="primary"
        onClick={toggleChatbox}
        aria-label={
          isChatboxOpen
            ? t(PLAYER.HIDE_CHAT_TOOLTIP)
            : t(PLAYER.SHOW_CHAT_TOOLTIP)
        }
      >
        {isChatboxOpen ? <ChatIcon /> : <ChatClosedIcon />}
      </IconButton>
    ),
  };
};
export default useChatButton;
