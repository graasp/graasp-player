import AccessibleTreeView, { flattenTree } from 'react-accessible-treeview';

import { Box, SxProps, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { DiscriminatedItem, Triggers } from '@graasp/sdk';

import { GRAASP_MENU_ITEMS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { getItemTree } from '@/utils/tree';

import Node from './Node';

type Props = {
  id: string;
  header?: string;
  rootItems: DiscriminatedItem[];
  items?: DiscriminatedItem[];
  initialExpandedItemIds?: string[];
  selectedId?: string;
  onTreeItemSelect?: (value: string) => void;
  isLoading?: boolean;
  onlyShowContainerItems?: boolean;
  firstLevelStyle?: object;
  sx?: SxProps;
};

const TreeView = ({
  id,
  header,
  items,
  rootItems,
  onTreeItemSelect,
  isLoading = false,
  onlyShowContainerItems = true,
  firstLevelStyle,
  sx = {},
}: Props): JSX.Element => {
  const { mutate: triggerAction } = mutations.usePostItemAction();

  const itemsToShow = items?.filter((item) =>
    onlyShowContainerItems ? GRAASP_MENU_ITEMS.includes(item.type) : true,
  );

  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  // types based on TreeView types
  const onSelect = (value: string) => {
    // trigger player Action for item view
    triggerAction({ itemId: value, payload: { type: Triggers.ItemView } });

    onTreeItemSelect?.(value);
  };

  const tree = Object.values(getItemTree(itemsToShow || [], rootItems));
  return (
    <Box
      id={id}
      sx={{
        ml: -1,
        '.tree, .tree-node, .tree-node-group': {
          listStyle: 'none',
          paddingInlineStart: 'unset',
          paddingLeft: '17px',
        },
        ...sx,
      }}
    >
      {header && (
        <Typography sx={{ ml: 2, fontWeight: 'bold' }} variant="body1">
          {header}
        </Typography>
      )}
      <AccessibleTreeView
        defaultExpandedIds={[rootItems[0].id]}
        data={flattenTree({
          // here there's should be a root item for all children which basically gonna be an empty name
          name: '',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          children: tree,
        })}
        // eslint-disable-next-line react/no-unstable-nested-components
        nodeRenderer={(props) => (
          <Node
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            firstLevelStyle={firstLevelStyle}
            onSelect={onSelect}
          />
        )}
      />
    </Box>
  );
};

export default TreeView;
