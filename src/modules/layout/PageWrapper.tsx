import { Link, Outlet, useParams } from 'react-router-dom';

import { Typography, styled, useTheme } from '@mui/material';

import { Context } from '@graasp/sdk';
import {
  Main,
  Platform,
  PlatformSwitch,
  defaultHostsMapper,
  useMobileView,
  usePlatformNavigation,
} from '@graasp/ui';

import {
  GRAASP_ANALYTICS_HOST,
  GRAASP_BUILDER_HOST,
  GRAASP_LIBRARY_HOST,
} from '@/config/env';
import { usePlayerTranslation } from '@/config/i18n';
import { HOME_PATH } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
} from '@/config/selectors';
import { ItemContextProvider } from '@/contexts/ItemContext';
import { PLAYER } from '@/langs/constants';

import HomeNavigation from '../navigation/HomeNavigation';
import ItemStructureNavigation from '../navigation/ItemNavigation';
import UserSwitchWrapper from '../userSwitch/UserSwitchWrapper';

// small converter for HOST_MAP into a usePlatformNavigation mapper
export const platformsHostsMap = defaultHostsMapper({
  [Platform.Builder]: GRAASP_BUILDER_HOST,
  [Platform.Library]: GRAASP_LIBRARY_HOST,
  [Platform.Analytics]: GRAASP_ANALYTICS_HOST,
});

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));

const LinkComponent = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => <StyledLink to={HOME_PATH}>{children}</StyledLink>;

type PageWrapperProps = {
  fullscreen: boolean;
};

const PageWrapper = ({ fullscreen }: PageWrapperProps): JSX.Element => {
  const { t } = usePlayerTranslation();
  const theme = useTheme();
  const { isMobile } = useMobileView();
  const { rootId } = useParams();
  const { data: item } = hooks.useItem();
  const getNavigationEvents = usePlatformNavigation(platformsHostsMap, rootId);

  const platformProps = {
    [Platform.Builder]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Builder],
      ...getNavigationEvents(Platform.Builder),
    },
    [Platform.Player]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Player],
      href: '/',
    },
    [Platform.Library]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Library],
      ...getNavigationEvents(Platform.Library),
    },
    [Platform.Analytics]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Analytics],
      ...getNavigationEvents(Platform.Analytics),
    },
  };

  if (fullscreen) {
    return (
      <ItemContextProvider rootId={rootId}>
        <Outlet />
      </ItemContextProvider>
    );
  }

  return (
    <ItemContextProvider rootId={rootId}>
      <Main
        open={Boolean(rootId)}
        context={Context.Player}
        drawerContent={
          rootId ? <ItemStructureNavigation /> : <HomeNavigation />
        }
        drawerOpenAriaLabel={t(PLAYER.DRAWER_ARIAL_LABEL)}
        LinkComponent={LinkComponent}
        PlatformComponent={
          <PlatformSwitch
            id={APP_NAVIGATION_PLATFORM_SWITCH_ID}
            selected={Platform.Player}
            platformsProps={platformProps}
            disabledColor="#999"
            color={
              isMobile
                ? theme.palette.primary.main
                : theme.palette.secondary.main
            }
            accentColor={
              isMobile
                ? theme.palette.secondary.main
                : theme.palette.primary.main
            }
          />
        }
        headerLeftContent={<Typography noWrap>{item?.name}</Typography>}
        headerRightContent={<UserSwitchWrapper />}
      >
        <Outlet />
      </Main>
    </ItemContextProvider>
  );
};
export default PageWrapper;
