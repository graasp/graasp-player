import { Link } from 'react-router-dom';

import { Button } from '@mui/material';

import { usePlayerTranslation } from '@/config/i18n';
import { TREE_FALLBACK_RELOAD_BUTTON_ID } from '@/config/selectors';
import { PLAYER } from '@/langs/constants';

const TreeErrorBoundary = (): JSX.Element => {
  const { t } = usePlayerTranslation();
  return (
    <Button
      id={TREE_FALLBACK_RELOAD_BUTTON_ID}
      component={Link}
      reloadDocument
      to={window.location}
    >
      {t(PLAYER.TREE_NAVIGATION_RELOAD_TEXT)}
    </Button>
  );
};
export default TreeErrorBoundary;
