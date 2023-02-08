import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { styled, Typography, Box } from '@mui/material';

import {
    defaultHostsMapper, Platform, usePlatformNavigation,
    GraaspLogo,
    PlatformSwitch
} from '@graasp/ui';

import {
    GRAASP_COMPOSE_HOST,
    GRAASP_EXPLORE_HOST,
} from '../../config/constants';

import {
    APP_NAVIGATION_PLATFORM_SWITCH_ID,
    APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
} from '../../config/selectors'


const GRAASP_LOGO_HEADER_HEIGHT = 40;
const APP_NAME = 'Graasp';

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

export const HeaderNavigation = ({ rootId, topItemName }) => {
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
                <Typography>
                    {topItemName}
                </Typography>
            </Box>
        </Box>
    )
};

HeaderNavigation.propTypes = {
    rootId: PropTypes.string,
    topItemName: PropTypes.string,
};

HeaderNavigation.defaultProps = {
    rootId: undefined,
    topItemName: "",
}

export default HeaderNavigation;