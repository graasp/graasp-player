import { Link } from 'react-router-dom';

import { Box, Typography, styled } from '@mui/material';

import {
  GraaspLogo,
  Platform,
  PlatformSwitch,
  defaultHostsMapper,
  usePlatformNavigation,
} from '@graasp/ui';

import {
  APP_NAME,
  GRAASP_COMPOSE_HOST,
  GRAASP_EXPLORE_HOST,
  GRAASP_LOGO_HEADER_HEIGHT,
} from '../../config/constants';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
} from '../../config/selectors';

// small converter for HOST_MAP into a usePlatformNavigation mapper
export const platformsHostsMap = defaultHostsMapper({
  [Platform.Builder]: GRAASP_COMPOSE_HOST,
  [Platform.Library]: GRAASP_EXPLORE_HOST,
});

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));

interface HeaderNavigationProps {
  rootId?: string;
  topItemName?: string;
}

export const HeaderNavigation = ({
  rootId = undefined, // this makes eslint happy with react/require-default-props
  topItemName = '',
}: HeaderNavigationProps): JSX.Element => {
  const getNavigationEvents = usePlatformNavigation(platformsHostsMap, rootId);

  const platformProps = {
    [Platform.Builder]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Builder],
      ...getNavigationEvents(Platform.Builder),
    },
    [Platform.Player]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Player],
    },
    [Platform.Library]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Library],
      ...getNavigationEvents(Platform.Library),
    },
    [Platform.Analytics]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Analytics],
      disabled: true,
    },
  };
  return (
    <Box display="flex" ml={2}>
      <StyledLink to="/">
        <GraaspLogo height={GRAASP_LOGO_HEADER_HEIGHT} sx={{ fill: 'white' }} />
        <Typography variant="h6" color="inherit" mr={2} ml={1}>
          {APP_NAME}
        </Typography>
      </StyledLink>
      <PlatformSwitch
        id={APP_NAVIGATION_PLATFORM_SWITCH_ID}
        selected={Platform.Player}
        platformsProps={platformProps}
        disabledColor="#999"
      />
      <Box display="flex" sx={{ alignItems: 'center', ml: 3 }}>
        <Typography>{topItemName}</Typography>
      </Box>
    </Box>
  );
};

export default HeaderNavigation;
