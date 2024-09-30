import { Link, useParams } from 'react-router-dom';

import { Tooltip } from '@mui/material';

import { ClientHostManager, Context } from '@graasp/sdk';

import { MapPinIcon } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { ITEM_MAP_BUTTON_ID } from '@/config/selectors';
import { PLAYER } from '@/langs/constants';

import { ToolButton } from './CustomButtons';

const cm = ClientHostManager.getInstance();

const useGeolocationButton = (): { geolocationButton: JSX.Element | null } => {
  const { t } = usePlayerTranslation();
  // get inherited geoloc
  const { itemId, rootId } = useParams();
  const { data: item } = hooks.useItem(itemId);
  const { data: allGeoloc } = hooks.useItemsInMap({
    parentItemId: rootId,
  });
  const { data: geoloc } = hooks.useItemGeolocation(item?.id);

  if (!allGeoloc?.length) {
    return { geolocationButton: null };
  }

  const url = geoloc
    ? cm.getItemLink(Context.Builder, geoloc.item.id, {
        mode: 'map',
      })
    : null;

  const isDisabled = !geoloc;

  const tooltip = isDisabled
    ? t(PLAYER.MAP_BUTTON_DISABLED_TEXT)
    : t(PLAYER.MAP_BUTTON_TEXT, { name: geoloc.item.name });

  const component = (
    <span id={ITEM_MAP_BUTTON_ID}>
      <ToolButton key="mapButton" disabled={isDisabled} aria-label={tooltip}>
        <MapPinIcon />
      </ToolButton>
    </span>
  );
  const button = !url ? component : <Link to={url}>{component}</Link>;

  return {
    geolocationButton: <Tooltip title={tooltip}>{button}</Tooltip>,
  };
};

export default useGeolocationButton;
