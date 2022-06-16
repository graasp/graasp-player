import React from 'react';
import { useTranslation } from 'react-i18next';
import { Main, MainMenu as GraaspMainMenu, Loader } from '@graasp/ui';
import { Divider, Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from 'react-router';
import HeaderRightContent from './HeaderRightContent';
import CookiesBanner from './CookiesBanner';
import { hooks } from '../../config/queryClient';
import { buildTreeItemClass, OWN_ITEMS_GRID_ID } from '../../config/selectors';
import ItemCard from '../common/ItemCard';
import { buildMainPath } from '../../config/paths';
import DynamicTreeView from '../common/Tree/Tree';
import { isHidden } from '../../utils/item';

const { useOwnItems, useSharedItems, useItemsTags } = hooks;

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

const Home = () => {
  const { t } = useTranslation();
  const classes = useStyles();
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
        <Divider className={classes.divider} />
        <Typography variant="h4">{t('Shared Items')}</Typography>
        <Grid container spacing={3} justify="center">
          {shared.map((i) => (
            <Grid item lg={3} md={4} sm={6}>
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
            <Grid item lg={3} md={4} sm={6}>
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
