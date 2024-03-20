import Fullscreen from 'react-fullscreen-crossbrowser';
import { useParams, useSearchParams } from 'react-router-dom';

import EnterFullscreenIcon from '@mui/icons-material/Fullscreen';
import ExitFullscreenIcon from '@mui/icons-material/FullscreenExit';
import { Grid, Stack, Tooltip, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import {
  DiscriminatedItem,
  ItemTagType,
  ItemType,
  getIdsFromPath,
} from '@graasp/sdk';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';
import Chatbox from '@/modules/chatbox/Chatbox';
import Item from '@/modules/item/Item';

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
  const { itemId, rootId } = useParams();
  const { data: children } = hooks.useChildren(itemId);
  const { data: tags } = hooks.useItemsTags(children?.map(({ id }) => id));
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
  const isFolder = item.type === ItemType.FOLDER;

  if (!rootId) {
    return null;
  }

  /* This removes the parents that are higher than the perform root element
  Ex: if we are in item 6 and the root is 3, when splitting the path we get [ 1, 2, 3, 4, 5, 6 ].
  However the student cannot go higher than element 3, so we remove the element before 3, this
  gives us [ 3, 4, 5, 6], which is the visible range of the student. */
  const parents = getIdsFromPath(item.path);
  const parentsIds = parents.slice(
    parents.indexOf(rootId),
    /* When splitting the path, it returns the current element in the array.
    However because we use the item components, if the item is not a folder it will be rendered
    pinned or not. Because we just loop over the parents to get their pinned items.
    If the item is a folder, we can keep it in the path to show the items that are pinned in it */
    isFolder ? parents.length : -1,
  );

  const pinnedCount =
    children?.filter(
      ({ id, settings: s }) =>
        s.isPinned &&
        // do not count hidden items as they are not displayed
        !tags?.data?.[id]?.some(({ type }) => type === ItemTagType.Hidden),
    )?.length || 0;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const displayFullscreenButton = () => {
    // todo: add this to settings (?)
    const fullscreen = Boolean(searchParams.get('fullscreen') === 'true');
    if (!fullscreen) return null;

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
          title={t('Chat')}
          onClose={toggleChatbox}
          open={isChatboxOpen}
        >
          <Chatbox item={item} />
        </SideDrawer>
      </div>
    );
  };

  const displayPinnedItems = () => {
    if (!pinnedCount) return null;

    return (
      <SideDrawer
        title={t(PLAYER.PINNED_ITEMS)}
        onClose={togglePinned}
        open={isPinnedOpen}
      >
        {/* show parents pinned items */}
        <Stack id={ITEM_PINNED_ID} spacing={2} mt={1}>
          {parentsIds.map((i) => (
            <Item key={i} id={i} showPinnedOnly />
          ))}
        </Stack>
      </SideDrawer>
    );
  };

  return (
    <Fullscreen
      enabled={isFullscreen}
      onChange={(isFullscreenEnabled) => setIsFullscreen(isFullscreenEnabled)}
    >
      {displayChatbox()}
      {displayPinnedItems()}
      <Grid id="contentGrid">
        <StyledMain
          isShifted={isChatboxOpen || (isPinnedOpen && pinnedCount > 0)}
        >
          {displayFullscreenButton()}

          {content}
        </StyledMain>
      </Grid>
    </Fullscreen>
  );
};

export default SideContent;
