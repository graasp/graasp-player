import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Alert, Skeleton, Typography } from '@mui/material';

import { ROOT_ID_PATH } from '@/config/paths';
import { hooks } from '@/config/queryClient';
import { useItemContext } from '@/contexts/ItemContext';
import { LayoutContextProvider } from '@/contexts/LayoutContext';
import { PLAYER } from '@/langs/constants';
import SideContent from '@/modules/rightPanel/SideContent';

import Item from './Item';

const MainScreen = (): JSX.Element | null => {
  const rootId = useParams()[ROOT_ID_PATH];
  const { focusedItemId } = useItemContext();
  const mainId = focusedItemId || rootId;
  const { data: item, isLoading, isError } = hooks.useItem(mainId);
  const { t } = useTranslation();

  const content = rootId ? (
    <Item id={mainId} />
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
