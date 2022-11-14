import PropTypes from 'prop-types';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';

import { redirect } from '@graasp/utils';

import { buildGraaspPlayerItemRoute } from '../../../config/constants';
import { buildTreeShortcutItemClass } from '../../../config/selectors';

const CustomTreeShortcutItem = ({ itemId, content }) => {
  const onSelectShortcut = (_event, value) => {
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
      ></TreeItem>
    </TreeView>
  );
};

CustomTreeShortcutItem.propTypes = {
  itemId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default CustomTreeShortcutItem;
