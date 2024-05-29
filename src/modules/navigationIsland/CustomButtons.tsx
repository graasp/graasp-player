import { Theme, styled } from '@mui/material';

const baseStyle = (theme: Theme) => ({
  // remove default button borders
  border: 'unset',
  // set padding for icon
  padding: '8px',
  // transition smoothly between colors
  transition: 'all ease 100ms',
  // round the corners
  borderRadius: theme.spacing(1),
  // set a fixed height 8 + 8 for padding + 24 for the icon height
  height: '40px',
  width: '40px',
  '&:hover': {
    cursor: 'pointer',
  },
  '&:disabled svg': {
    color: 'gray',
  },
  '&:disabled': {
    backgroundColor: '#e9e9e9',
    cursor: 'not-allowed',
  },
});
export const NavigationButton = styled('button')(({ theme }) => ({
  ...baseStyle(theme),
  backgroundColor: '#E4DFFF',
  '& svg': {
    color: theme.palette.primary.main,
  },
  '&:hover:not(:disabled)': {
    backgroundColor: '#BFB4FF',
  },
}));

export const LoadingButton = styled('button')(({ theme }) => ({
  ...baseStyle(theme),
  animation: `skeletonAnimation 2s ease-in-out 0.5s infinite`,
  '@keyframes skeletonAnimation': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.4 },
    '100%': { opacity: 1 },
  },
}));

export const ToolButton = styled('button')(({ theme }) => ({
  ...baseStyle(theme),
  backgroundColor: '#CEE5FF',
  '& svg': {
    color: '#00639A',
  },
  '&:hover:not(:disabled)': {
    backgroundColor: '#A2CEFF',
  },
}));
