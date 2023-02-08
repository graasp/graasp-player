import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { Alert, Box, Skeleton, Typography, styled } from '@mui/material';

import {
  GraaspLogo,
  Main,
  Platform,
  PlatformSwitch,
  defaultHostsMapper,
  usePlatformNavigation,
} from '@graasp/ui';

import {
  GRAASP_COMPOSE_HOST,
  GRAASP_EXPLORE_HOST,
} from '../../config/constants';
import { hooks } from '../../config/queryClient';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
} from '../../config/selectors';
import Item from '../common/Item';
import MainMenu from '../common/MainMenu';
import SideContent from '../common/SideContent';
import { ItemContext } from '../context/ItemContext';
import { LayoutContextProvider } from '../context/LayoutContext';
import HeaderRightContent from './HeaderRightContent';

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

const MainScreen = () => {
  const { rootId } = useParams();
  const { focusedItemId } = useContext(ItemContext);
  const mainId = focusedItemId || rootId;
  const { data: item, isLoading, isError } = hooks.useItem(mainId);
  const { t } = useTranslation();
  const [topItemName, setTopItemName] = useState('');
  const [isFirstItem, setIsFirstItem] = useState(true);

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

  if (isLoading) {
    return <Skeleton variant="rect" width="100%" />;
  }

  if (!item || isError) {
    return <Alert severity="error">{t('This item does not exist')}</Alert>;
  }

  if (isFirstItem) {
    setTopItemName(item.name);
    setIsFirstItem(false);
  }

  const content = !rootId ? (
    <Typography align="center" variant="h4">
      {t('No item defined.')}
    </Typography>
  ) : (
    <Item id={mainId} />
  );

  const leftContent = (
    <Box display="flex" ml={2}>
      <StyledLink to="#">
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
  );

  return (
    <Main
      open={Boolean(rootId)}
      sidebar={rootId && <MainMenu />}
      headerLeftContent={leftContent}
      headerRightContent={<HeaderRightContent id={mainId} />}
    >
      <LayoutContextProvider>
        <SideContent item={item}>{content}</SideContent>
      </LayoutContextProvider>
    </Main>
  );
};

MainScreen.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
  }).isRequired,
};

export default MainScreen;
