import Fullscreen from 'react-fullscreen-crossbrowser';
import { useParams, useSearchParams } from 'react-router-dom';

import EnterFullscreenIcon from '@mui/icons-material/Fullscreen';
import ExitFullscreenIcon from '@mui/icons-material/FullscreenExit';
import { Stack, Tooltip, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { DiscriminatedItem } from '@graasp/sdk';
import { useMobileView } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';
import Chatbox from '@/modules/chatbox/Chatbox';
import { ItemContentWrapper } from '@/modules/item/Item';

import { DRAWER_WIDTH, FLOATING_BUTTON_Z_INDEX } from '../../config/constants';
import {
  CHATBOX_DRAWER_ID,
  ITEM_FULLSCREEN_BUTTON_ID,
  ITEM_PINNED_ID,
} from '../../config/selectors';
import SideDrawer from './SideDrawer';

const StyledMain = styled('div', {
  shouldForwardProp: (propName) => propName !== 'isShifted',
})<{ isShifted: boolean }>(({ theme, isShifted }) => {
  const contentShift = isShifted
    ? {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: DRAWER_WIDTH,
      }
    : {};

  return {
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
    ...contentShift,
  };
});

const StyledIconButton = styled(IconButton)({
  float: 'right',
  zIndex: FLOATING_BUTTON_Z_INDEX,
});

type Props = {
  item: DiscriminatedItem;
  content: JSX.Element;
};

const SideContent = ({ content, item }: Props): JSX.Element | null => {
  const { rootId } = useParams();
  const { isMobile } = useMobileView();
  const { data: children } = hooks.useChildren(item.id, undefined, {
    enabled: !!item,
  });
  const [searchParams] = useSearchParams();

  const {
    toggleChatbox,
    togglePinned,
    isChatboxOpen,
    isPinnedOpen,
    isFullscreen,
    setIsFullscreen,
  } = useLayoutContext();

  const { t } = usePlayerTranslation();
  const settings = item.settings ?? {};

  if (!rootId) {
    return null;
  }

  const pinnedItems = children?.filter(
    ({ settings: s, hidden }) => s.isPinned && !hidden,
  );
  const pinnedCount = pinnedItems?.length || 0;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const displayFullscreenButton = () => {
    // todo: add this to settings (?)
    const fullscreen = Boolean(searchParams.get('fullscreen') === 'true');
    if (isMobile || !fullscreen) return null;

    return (
      <Tooltip
        title={
          isFullscreen
            ? t(PLAYER.EXIT_FULLSCREEN_TOOLTIP)
            : t(PLAYER.ENTER_FULLSCREEN_TOOLTIP)
        }
      >
        <StyledIconButton
          id={ITEM_FULLSCREEN_BUTTON_ID}
          aria-label={
            isFullscreen
              ? t(PLAYER.EXIT_FULLSCREEN_TOOLTIP)
              : t(PLAYER.ENTER_FULLSCREEN_TOOLTIP)
          }
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
        </StyledIconButton>
      </Tooltip>
    );
  };

  const displayChatbox = () => {
    if (!settings?.showChatbox) return null;

    return (
      <div id={CHATBOX_DRAWER_ID}>
        <SideDrawer
          title={t(PLAYER.ITEM_CHATBOX_TITLE, {
            name: item.name,
          })}
          onClose={toggleChatbox}
          open={isChatboxOpen}
        >
          <Chatbox item={item} />
        </SideDrawer>
      </div>
    );
  };

  const displayPinnedItems = () => {
    if (pinnedItems?.length) {
      return (
        <SideDrawer
          title={t(PLAYER.PINNED_ITEMS)}
          onClose={togglePinned}
          open={isPinnedOpen}
        >
          {/* show children pinned items */}
          <Stack id={ITEM_PINNED_ID} gap={2} mt={1} pb={9}>
            {pinnedItems.map((pinnedItem) => (
              <ItemContentWrapper item={pinnedItem} />
            ))}
          </Stack>
        </SideDrawer>
      );
    }
    return null;
  };

  return (
    <Fullscreen
      enabled={isFullscreen}
      onChange={(isFullscreenEnabled) => setIsFullscreen(isFullscreenEnabled)}
    >
      {displayChatbox()}
      {displayPinnedItems()}
      <Stack id="contentGrid">
        <StyledMain
          isShifted={isChatboxOpen || (isPinnedOpen && pinnedCount > 0)}
        >
          {displayFullscreenButton()}

          {content}
        </StyledMain>
      </Stack>
    </Fullscreen>
  );
};

export default SideContent;
