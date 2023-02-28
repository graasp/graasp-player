import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';

import { UUID, redirect } from '@graasp/sdk';

import { buildGraaspPlayerItemRoute } from '@/config/constants';
import { buildTreeShortcutItemClass } from '@/config/selectors';

type Props = {
  itemId: UUID;
  content: JSX.Element;
};

const CustomTreeShortcutItem = ({ itemId, content }: Props): JSX.Element => {
  const onSelectShortcut = (_event: unknown, value: string) => {
    if (value) {
      redirect(buildGraaspPlayerItemRoute(value), {
        name: buildGraaspPlayerItemRoute(value),
        openInNewTab: true,
      });
    }
  };

  return (
    <TreeView
      onNodeSelect={onSelectShortcut}
      defaultEndIcon={<OpenInNewIcon />}
    >
      <TreeItem
        key={itemId}
        nodeId={itemId}
        label={content}
        className={buildTreeShortcutItemClass(itemId)}
      />
    </TreeView>
  );
};

export default CustomTreeShortcutItem;
