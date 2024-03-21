import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChatIcon from '@mui/icons-material/Forum';
import ChatClosedIcon from '@mui/icons-material/ForumOutlined';
import PinIcon from '@mui/icons-material/PushPin';
import OutlinedPinIcon from '@mui/icons-material/PushPinOutlined';
import { Box, Button, IconButton, Stack } from '@mui/material';

import {
  ActionTriggers,
  DiscriminatedItem,
  ItemTagType,
  ItemType,
} from '@graasp/sdk';

import isArray from 'lodash.isarray';

import { usePlayerTranslation } from '@/config/i18n';
import { buildContentPagePath } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import {
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_PINNED_BUTTON_ID,
} from '@/config/selectors';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';

const ChatButton = (): JSX.Element | null => {
  const { t } = usePlayerTranslation();
  const { itemId } = useParams();
  const { data: item } = hooks.useItem(itemId);
  const { toggleChatbox, isChatboxOpen } = useLayoutContext();

  // do not show chatbox button is chatbox setting is not enabled
  if (!item?.settings?.showChatbox) {
    return null;
  }

  return (
    <IconButton
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
  );
};

const PinnedItemsButton = (): JSX.Element | null => {
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
    return (
      <IconButton
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
    );
  }
  return null;
};

const PreviousNextButtons = (): JSX.Element | null => {
  const { rootId, itemId } = useParams();
  const navigate = useNavigate();
  const { mutate: triggerAction } = mutations.usePostItemAction();
  const { data: rootItem } = hooks.useItem(rootId);

  const { data: descendants, isLoading } = hooks.useDescendants({
    // not correct but enabled
    id: rootId ?? '',
    enabled: Boolean(rootId),
  });

  const prevRoot: DiscriminatedItem | null = rootItem || null;
  let prev: DiscriminatedItem | null = null;
  let next: DiscriminatedItem | null = null;

  // if there are no descendants then there is no need to navigate
  if (!isArray(descendants)) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  // we only navigate through folders
  const folderHierarchy: DiscriminatedItem[] = descendants.filter(
    ({ type }) => type === ItemType.FOLDER,
  );

  // when focusing on the root item
  if (itemId === rootId && folderHierarchy.length) {
    // there is no previous and the nex in the first item in the hierarchy
    [next] = folderHierarchy;
    // when focusing on the descendants
  } else {
    const idx = folderHierarchy.findIndex(({ id }) => id === itemId) ?? -1;

    // if index is not found, then do not show navigation
    if (idx < 0) {
      return null;
    }

    // if index is 0, previous is root
    prev = idx === 0 ? prevRoot : folderHierarchy[idx - 1];
    // if you reach the end, next will be undefined and not show
    next = folderHierarchy[idx + 1];
  }

  const handleClickNavigationButton = (newItemId: string) => {
    triggerAction({
      itemId: newItemId,
      payload: { type: ActionTriggers.ItemView },
    });
    navigate(buildContentPagePath({ rootId, itemId: newItemId }));
  };

  return (
    <Stack direction="row" spacing={1}>
      {prev && (
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: 'unset' }}
          onClick={() => {
            if (prev?.id) {
              handleClickNavigationButton(prev.id);
            }
          }}
        >
          {prev.name}
        </Button>
      )}

      {next && (
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{ textTransform: 'unset' }}
          onClick={() => {
            if (next?.id) {
              handleClickNavigationButton(next.id);
            }
          }}
        >
          {next.name}
        </Button>
      )}
    </Stack>
  );
};

const NavigationIslandBox = (): JSX.Element => (
  <Box
    // set some background and shadow
    bgcolor="white"
    boxShadow="0px 0px 20px 2px #0003"
    border="1px solid #eee"
    // add an asymmetrical border radius
    borderRadius="16px 16px 0px 0px"
    // position the island on the bottom of the page
    position="fixed"
    bottom={0}
    // equal margins on both sides
    margin="auto"
    // set let and right to 0 so that it can be centered
    left="0"
    right="0"
    // need to set a maximum width otherwise the left and right will stretch the island
    maxWidth="max-content"
    // put on top of the content but not above the cookie buttons
    zIndex={998}
    // have some padding for the content that will be rendered inside
    p={1}
  >
    <Stack direction="row" flexGrow={1} spacing={1} p={1}>
      <PreviousNextButtons />

      {/* <Stack direction="row" spacing={1}> */}
      <ChatButton />
      <PinnedItemsButton />
      {/* </Stack> */}
    </Stack>
  </Box>
);

export default NavigationIslandBox;
