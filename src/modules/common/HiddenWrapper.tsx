import { Box, styled } from '@mui/material';

import { ItemRecord } from '@graasp/sdk/frontend';

import { buildHiddenWrapperId } from '@/config/selectors';

export const HIDDEN_STYLE = {
  backgroundColor: '#eee',
  color: 'rgba(0, 0, 0, 0.3)',
};

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isHidden',
})<{ isHidden: boolean }>(({ isHidden }) => ({
  ...(isHidden ? HIDDEN_STYLE : {}),
}));

const HiddenWrapper = ({
  hidden: isHidden,
  itemId,
  children,
}: {
  hidden: boolean;
  itemId: ItemRecord['id'];
  children: JSX.Element;
}): JSX.Element => (
  <StyledBox
    isHidden={isHidden}
    id={buildHiddenWrapperId(itemId, isHidden)}
    title={
      isHidden
        ? "This element is hidden, you can see it because you have admin or write access, users with read access won't see it"
        : undefined
    }
  >
    {children}
  </StyledBox>
);

export default HiddenWrapper;
