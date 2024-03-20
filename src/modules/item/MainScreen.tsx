import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Alert, Skeleton, Typography } from '@mui/material';

import { ITEM_PARAM } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import { LayoutContextProvider } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';
import SideContent from '@/modules/rightPanel/SideContent';

import Item from './Item';

const MainScreen = (): JSX.Element | null => {
  const itemId = useParams()[ITEM_PARAM];
  const { data: item, isLoading, isError } = hooks.useItem(itemId);
  const { t } = useTranslation();

  const content = itemId ? (
    <Item id={itemId} />
  ) : (
    <Typography align="center" variant="h4">
      {t('No item defined.')}
    </Typography>
  );

  if (item) {
    return (
      <LayoutContextProvider>
        <SideContent item={item} content={content} />
      </LayoutContextProvider>
    );
  }

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" />;
  }

  if (isError) {
    return <Alert severity="error">{t(PLAYER.ERROR_FETCHING_ITEM)}</Alert>;
  }

  return null;
};

export default MainScreen;
