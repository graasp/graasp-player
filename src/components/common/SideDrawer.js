import PropTypes from 'prop-types';
import React from 'react';

import {
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { DRAWER_WIDTH } from '../../config/constants';
import { PANNEL_CLOSE_BUTTON_ID } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
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
}));

const SideDrawer = ({ children, onClose, title, open }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={open}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar />
      <div className={classes.drawerHeader}>
        <Typography variant="h6">{title}</Typography>
        <IconButton id={PANNEL_CLOSE_BUTTON_ID} onClick={onClose}>
          {theme.direction === 'rtl' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      {children}
    </Drawer>
  );
};

SideDrawer.propTypes = {
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default SideDrawer;
