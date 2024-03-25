import { Box, Stack } from '@mui/material';

import useChatButton from './ChatButton';
import usePinnedItemsButton from './PinnedItemsButton';
import usePreviousNextButtons from './PreviousNextButtons';

const NavigationIslandBox = (): JSX.Element | null => {
  const { previousButton, nextButton } = usePreviousNextButtons();
  const { chatButton } = useChatButton();
  const { pinnedButton } = usePinnedItemsButton();
  const navigationItems = [
    previousButton,
    nextButton,
    chatButton,
    pinnedButton,
  ].filter(Boolean);

  if (navigationItems.length) {
    return (
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
          {navigationItems}
        </Stack>
      </Box>
    );
  }
  return null;
};
export default NavigationIslandBox;
