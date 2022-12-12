import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Container, Divider, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

import { MainMenu as GraaspMainMenu, Loader, Main } from '@graasp/ui';

import { buildMainPath } from '../../config/paths';
import { hooks } from '../../config/queryClient';
import { OWN_ITEMS_GRID_ID, buildTreeItemClass } from '../../config/selectors';
import { isHidden } from '../../utils/item';
import ItemCard from '../common/ItemCard';
import DynamicTreeView from '../common/Tree/Tree';
import CookiesBanner from './CookiesBanner';
import HeaderRightContent from './HeaderRightContent';

const { useOwnItems, useSharedItems, useItemsTags } = hooks;

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: ownItems, isLoading: isLoadingOwnItems } = useOwnItems();
  const { data: ownItemsTags, isLoading: isLoadingOwnTags } = useItemsTags(
    ownItems?.map(({ id }) => id).toJS(),
  );
  const { data: sharedItems, isLoading: isLoadingSharedItems } =
    useSharedItems();
  const { data: sharedItemsTags, isLoading: isLoadingSharedTags } =
    useItemsTags(sharedItems?.map(({ id }) => id).toJS());

  const filtred = ownItems?.filter(
    (_item, idx) => !isLoadingOwnTags && !isHidden(ownItemsTags?.get(idx)),
  );

  const shared = sharedItems?.filter(
    (_item, idx) =>
      !isLoadingSharedTags && !isHidden(sharedItemsTags?.get(idx)),
  );

  const renderSharedItems = () => {
    if (isLoadingSharedItems) {
      return <Loader />;
    }

    if (!shared?.size) {
      return null;
    }

    return (
      <>
        <Divider my={2} />
        <Typography variant="h4">{t('Shared Items')}</Typography>
        <Grid container spacing={3} justify="center">
          {shared.map((i) => (
            <Grid key={i.id} item lg={3} md={4} sm={6}>
              <ItemCard item={i} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  const renderOwnItems = () => {
    if (isLoadingOwnItems) {
      return <Loader />;
    }

    if (!filtred?.size) {
      return null;
    }

    return (
      <>
        <Typography variant="h4">{t('My Items')}</Typography>
        <Grid id={OWN_ITEMS_GRID_ID} container spacing={3} justify="center">
          {filtred.map((i) => (
            <Grid key={i.id} item lg={3} md={4} sm={6}>
              <ItemCard item={i} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  const renderContent = () => (
    <Container>
      {renderOwnItems()}
      {renderSharedItems()}
    </Container>
  );

  const renderOwnItemsMenu = () => {
    const rootOwnId = 'own';

    if (isLoadingOwnItems) {
      return <Loader />;
    }

    if (!ownItems?.size) {
      return null;
    }

    return (
      <GraaspMainMenu>
        <DynamicTreeView
          rootLabel={t('My Items')}
          rootId={rootOwnId}
          buildTreeItemClass={(nodeId) => buildTreeItemClass(nodeId)}
          initialExpendedItems={[rootOwnId]}
          onTreeItemSelect={(payload) => {
            if (payload !== rootOwnId) {
              navigate(buildMainPath({ rootId: payload, id: null }));
            }
          }}
          items={filtred}
        />
      </GraaspMainMenu>
    );
  };

  const renderSharedItemsMenu = () => {
    const rootSharedId = 'shared';

    if (isLoadingSharedItems) {
      return <Loader />;
    }

    if (!shared?.size) {
      return null;
    }

    return (
      <GraaspMainMenu>
        <DynamicTreeView
          rootLabel={t('Shared Items')}
          rootId={rootSharedId}
          buildTreeItemClass={(nodeId) => buildTreeItemClass(nodeId)}
          initialExpendedItems={[]}
          onTreeItemSelect={(payload) => {
            if (payload !== rootSharedId) {
              navigate(buildMainPath({ rootId: payload, id: null }));
            }
          }}
          items={shared}
        />
      </GraaspMainMenu>
    );
  };

  const sidebar = (
    <>
      <div style={{ height: '15px' }} />
      {renderOwnItemsMenu()}
      {renderSharedItemsMenu()}
    </>
  );

  return (
    <Main
      open
      sidebar={sidebar}
      headerLeftContent={t('Graasp Player')}
      headerRightContent={<HeaderRightContent />}
    >
      <CookiesBanner />
      {renderContent()}
    </Main>
  );
};

export default Home;
