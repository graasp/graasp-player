import React, { ForwardedRef, MouseEvent, ReactNode, Ref } from 'react';

import { useTreeItem } from '@mui/lab/TreeItem';
import { styled } from '@mui/material';
import Typography from '@mui/material/Typography';

const StyledDiv = styled('div')({
  // align expand arrow to top
  alignItems: 'start !important',
});

type Props = {
  classes: {
    root: string;
    expanded: string;
    selected: string;
    focused: string;
    disabled: string;
    iconContainer: string;
    label: string;
  };
  className?: string;
  displayIcon?: ReactNode;
  expansionIcon?: ReactNode;
  icon?: ReactNode;
  label?: ReactNode;
  nodeId: string;
};

// eslint-disable-next-line react/display-name
const CustomContentTree = React.forwardRef(
  (props: Props, ref: ForwardedRef<unknown>) => {
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

    const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
      preventSelection(event);
    };

    const handleExpansionClick = (event: MouseEvent<HTMLDivElement>) => {
      handleExpansion(event);
    };

    const handleSelectionClick = (event: MouseEvent<HTMLDivElement>) => {
      // this handles the auto expansion of an item on click to show children
      if (!expanded) {
        handleExpansion(event);
      }
      handleSelection(event);
    };

    const iconComponent = (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
    );

    const classNames = [
      className,
      classes.root,
      expanded ? classes.expanded : '',
      disabled ? classes.disabled : '',
      selected ? classes.selected : '',
      focused ? classes.focused : '',
    ].join(' ');

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <StyledDiv
        className={classNames}
        onMouseDown={handleMouseDown}
        ref={ref as Ref<HTMLDivElement>}
      >
        {iconComponent}
        <Typography
          onClick={handleSelectionClick}
          component="div"
          className={classes.label}
        >
          {label}
        </Typography>
      </StyledDiv>
    );
  },
);

export default CustomContentTree;
