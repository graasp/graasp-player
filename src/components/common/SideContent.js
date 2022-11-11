import clsx from 'clsx';
import { Record } from 'immutable';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { Box, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ForumIcon from '@material-ui/icons/Forum';
import PushPinIcon from '@material-ui/icons/PushPin';

import { DRAWER_WIDTH, FLOATING_BUTTON_Z_INDEX } from '../../config/constants';
import { hooks } from '../../config/queryClient';
import {
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_PINNED_BUTTON_ID,
  ITEM_PINNED_ID,
} from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import { getParentsIdsFromPath } from '../../utils/item';
import { LayoutContext } from '../context/LayoutContext';
import BuilderButton from './BuilderButton';
import Chatbox from './Chatbox';
import Item from './Item';
import SideDrawer from './SideDrawer';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    float: 'right',
    zIndex: FLOATING_BUTTON_Z_INDEX,
  },
  root: {
    display: 'flex',
  },
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
    padding: theme.spacing(1),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pinnedContainer: {
    overflow: 'scroll',
  },
  content: {
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
  },
  contentShift: {
    // // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: DRAWER_WIDTH,
  },
}));

const { useItemsChildren } = hooks;

const SideContent = ({ children, item }) => {
  const settings = item.settings;
  const isFolder = item.type === ITEM_TYPES.FOLDER;
  const { rootId } = useParams();

  /* This removes the parents that are higher than the perform root element
  Ex: if we are in item 6 and the root is 3, when splitting the path we get [ 1, 2, 3, 4, 5, 6 ].
  However the student cannot go higher than element 3, so we remove the element before 3, this
  gives us [ 3, 4, 5, 6], which is the visible range of the student. */
  const parents = getParentsIdsFromPath(item.path || item.id);
  const parentsIds = parents.slice(
    parents.indexOf(rootId),
    /* When splitting the path, it returns the current element in the array.
    However because we use the item components, if the item is not a folder it will be rendered
    pinned or not. Because we just loop over the parents to get their pinned items.
    If the item is a folder, we can keep it in the path to show the items that are pinned in it */
    isFolder ? parents.length : -1,
  );

  const { data: child } = useItemsChildren([...parentsIds], {
    enabled: isFolder,
    getUpdates: isFolder,
  });

  let pinnedCount = 0;
  child?.forEach((elt) => {
    pinnedCount += elt?.filter(({ settings: s }) => s?.isPinned).size;
  });

  const {
    isPinnedMenuOpen,
    setIsPinnedMenuOpen,
    isChatboxMenuOpen,
    setIsChatboxMenuOpen,
  } = useContext(LayoutContext);

  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const toggleChatOpen = () => {
    setIsChatboxMenuOpen(!isChatboxMenuOpen);
    setIsPinnedMenuOpen(false);
  };

  const togglePinnedOpen = () => {
    setIsPinnedMenuOpen(!isPinnedMenuOpen);
    setIsChatboxMenuOpen(false);
  };

  const displayPinButton = () => {
    if (!pinnedCount) return null;

    return (
      <Tooltip title={t('Pinned item')}>
        <IconButton
          id={ITEM_PINNED_BUTTON_ID}
          className={classes.iconButton}
          aria-label={
            isPinnedMenuOpen ? t('Hide Pinned Items') : t('Show Pinned Items')
          }
          onClick={togglePinnedOpen}
        >
          <PushPinIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const displayChatButton = () => {
    if (!settings?.showChatbox) return null;

    return (
      <Tooltip title={t('Chat')}>
        <IconButton
          id={ITEM_CHATBOX_BUTTON_ID}
          className={classes.iconButton}
          aria-label={isChatboxMenuOpen ? t('Hide Chat') : t('Show Chat')}
          onClick={toggleChatOpen}
        >
          <ForumIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const displayChatbox = () => {
    if (!settings?.showChatbox) return null;

    return (
      <SideDrawer
        title={t('Chat')}
        onClose={toggleChatOpen}
        open={isChatboxMenuOpen}
      >
        <Chatbox item={item} />
      </SideDrawer>
    );
  };

  const displayPinnedItems = () => {
    if (!pinnedCount) return null;

    return (
      <SideDrawer
        title={t('Pinned items')}
        onClose={togglePinnedOpen}
        open={isPinnedMenuOpen}
      >
        {/* show parents pinned items */}
        <Box className={classes.pinnedContainer} id={ITEM_PINNED_ID}>
          {parentsIds.map((i) => (
            <Item key={i} id={i} showPinnedOnly />
          ))}
        </Box>
      </SideDrawer>
    );
  };

  return (
    <div>
      {displayChatbox()}
      {displayPinnedItems()}
      <div className={classes.root}>
        <main
          className={clsx(classes.content, {
            // todo: why is pinned true by default ? when there is no pins this makes no sense...
            [classes.contentShift]:
              isChatboxMenuOpen || (isPinnedMenuOpen && pinnedCount > 0),
          })}
        >
          {displayChatButton()}

          {displayPinButton()}

          <BuilderButton id={item.id} />

          {children}
        </main>
      </div>
    </div>
  );
};

SideContent.propTypes = {
  children: PropTypes.element.isRequired,
  item: PropTypes.instanceOf(Record).isRequired,
};

export default SideContent;
