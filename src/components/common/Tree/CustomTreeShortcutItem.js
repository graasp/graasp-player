import PropTypes from 'prop-types';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';

import { redirect } from '@graasp/utils';

import { buildGraaspPerformItemRoute } from '../../../config/constants';
import { buildTreeShortcutItemClass } from '../../../config/selectors';

const CustomTreeShortcutItem = ({ itemId, content }) => {
  const onSelectShortcut = (_event, value) => {
    if (value) {
      redirect(buildGraaspPerformItemRoute(value), {
        name: buildGraaspPerformItemRoute(value),
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
