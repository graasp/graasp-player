import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { Typography } from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';

import { Main } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import Item from '../common/Item';
import MainMenu from '../common/MainMenu';
import SideContent from '../common/SideContent';
import { ItemContext } from '../context/ItemContext';
import { LayoutContextProvider } from '../context/LayoutContext';
import HeaderRightContent from './HeaderRightContent';

const MainScreen = () => {
  const { rootId } = useParams();
  const { focusedItemId } = useContext(ItemContext);
  const mainId = focusedItemId || rootId;
  const { data: item, isLoading, isError } = hooks.useItem(mainId);
  const { t } = useTranslation();
  const [leftContent, setLeftContent] = useState('');
  const [isFirstItem, setIsFirstItem] = useState(true);

  if (isLoading) {
    return <Skeleton variant="rect" width={'100%'} />;
  }

  if (!item || isError) {
    return <Alert severity="error">{t('This item does not exist')}</Alert>;
  }

  if (isFirstItem) {
    setLeftContent(item.name);
    setIsFirstItem(false);
  }

  const content = !rootId ? (
    <Typography align="center" variant="h4">
      {t('No item defined.')}
    </Typography>
  ) : (
    <Item id={mainId} />
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
