import { Divider, Drawer, Toolbar, Typography, styled } from '@mui/material';

import { DEFAULT_BACKGROUND_COLOR, DrawerHeader } from '@graasp/ui';

import { DRAWER_WIDTH } from '../../config/constants';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    padding: theme.spacing(1),
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
}));

type Props = {
  children: JSX.Element;
  onClose: () => void;
  title: string;
  open: boolean;
};

const SideDrawer = ({ children, onClose, title, open }: Props): JSX.Element => (
  <StyledDrawer anchor="right" variant="persistent" open={open}>
    <Toolbar />
    <DrawerHeader handleDrawerClose={onClose} direction="rtl">
      <Typography variant="h6">{title}</Typography>
    </DrawerHeader>
    <Divider />
    {children}
  </StyledDrawer>
);

export default SideDrawer;
