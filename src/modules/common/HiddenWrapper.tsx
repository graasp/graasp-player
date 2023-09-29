import { Box, styled } from '@mui/material';

import { ItemRecord } from '@graasp/sdk/frontend';

import { usePlayerTranslation } from '@/config/i18n';
import { buildHiddenWrapperId } from '@/config/selectors';
import { PLAYER } from '@/langs/constants';

export const HIDDEN_STYLE = {
  backgroundColor: '#eee',
  color: 'rgba(0, 0, 0, 0.3)',
  padding: '16px',
  opacity: '0.5',
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
}): JSX.Element => {
  const { t } = usePlayerTranslation();
  return (
    <StyledBox
      isHidden={isHidden}
      id={buildHiddenWrapperId(itemId, isHidden)}
      title={isHidden ? t(PLAYER.HIDDEN_WRAPPER_TOOLTIP) : undefined}
    >
      {children}
    </StyledBox>
  );
};

export default HiddenWrapper;
