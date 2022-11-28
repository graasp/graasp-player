import PropTypes from 'prop-types';
import React from 'react';

import { Divider, Drawer, Toolbar, Typography, styled } from '@mui/material';

import { DrawerHeader } from '@graasp/ui';

import { DRAWER_WIDTH } from '../../config/constants';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    padding: theme.spacing(1),
  },
}));

const SideDrawer = ({ children, onClose, title, open }) => (
  <StyledDrawer anchor="right" variant="persistent" open={open}>
    <Toolbar />
    <DrawerHeader handleDrawerClose={onClose} direction="rtl">
      <Typography variant="h6">{title}</Typography>
    </DrawerHeader>
    <Divider />
    {children}
  </StyledDrawer>
);

SideDrawer.propTypes = {
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default SideDrawer;
