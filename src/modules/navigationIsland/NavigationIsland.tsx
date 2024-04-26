import { Box, Stack } from '@mui/material';

import useChatButton from './ChatButton';
import usePinnedItemsButton from './PinnedItemsButton';
import usePreviousNextButtons from './PreviousNextButtons';

const NavigationIslandBox = (): JSX.Element | null => {
  const { previousButton, nextButton } = usePreviousNextButtons();
  const { chatButton } = useChatButton();
  const { pinnedButton } = usePinnedItemsButton();

  return (
    <Box
      // set some background and shadow
      bgcolor="white"
      boxShadow="0px 3px 6px 0px rgba(0, 0, 0, 0.25)"
      // border="1px solid #eee"
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
      <Stack direction="row" flexGrow={1} gap={10} p={1}>
        {previousButton && nextButton && (
          <Stack direction="row" gap={2}>
            {previousButton}
            {nextButton}
          </Stack>
        )}
        <Stack direction="row" gap={2}>
          {chatButton}
          {pinnedButton}
        </Stack>
      </Stack>
    </Box>
  );
};
export default NavigationIslandBox;
