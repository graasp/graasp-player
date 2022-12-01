import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { useTreeItem } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

// eslint-disable-next-line react/display-name
const CustomContentTree = React.forwardRef((props, ref) => {
  const {
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    className,
    classes,
  } = props;

  const {
    handleExpansion,
    handleSelection,
    preventSelection,
    disabled,
    expanded,
    selected,
    focused,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  const iconComponent = (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={handleExpansionClick} className={classes.iconContainer}>
      {icon}
    </div>
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {iconComponent}
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

CustomContentTree.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    expanded: PropTypes.string.isRequired,
    selected: PropTypes.string.isRequired,
    focused: PropTypes.string.isRequired,
    disabled: PropTypes.string.isRequired,
    iconContainer: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string.isRequired,
  displayIcon: PropTypes.node.isRequired,
  expansionIcon: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.node.isRequired,
  nodeId: PropTypes.string.isRequired,
};

export default CustomContentTree;
