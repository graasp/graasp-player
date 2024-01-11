import { INode } from 'react-accessible-treeview';

import { Box, IconButton, Typography } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

import { UUID } from '@graasp/sdk';
import { ItemIcon } from '@graasp/ui';

import { buildTreeItemClass } from '@/config/selectors';

// Props here is passed from TreeView react-accessible-treeview component
interface NodeProps {
  element: INode;
  isBranch: boolean;
  isExpanded: boolean;
  level: number;
  isSelected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNodeProps: () => any;
  onSelect: (id: UUID) => void;
  firstLevelStyle?: object;
}
const Node = ({
  element,
  isBranch,
  isExpanded,
  getNodeProps,
  onSelect,
  level,
  isSelected,
  firstLevelStyle = {},
}: NodeProps): JSX.Element => (
  <Box
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...getNodeProps()}
    className={`${buildTreeItemClass(element.id as string)}`}
    display="flex"
    sx={{
      width: '100%',
      pl: 1,
      background: isSelected ? deepPurple[50] : 'none',
    }}
  >
    {/* icon type for root level items */}
    {level === 1 && element.metadata?.type && (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error type is not well defined
      <ItemIcon sx={{ width: 17 }} alt="icon" type={element.metadata.type} />
    )}
    {level !== 1 && isBranch && (
      <IconButton
        sx={{
          p: 0,
          '&:hover': {
            opacity: 0.6,
          },
        }}
      >
        {/* lucid icons */}
        {isExpanded ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5050d2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5050d2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
          </svg>
        )}
      </IconButton>
    )}
    <Typography
      component="button"
      sx={{
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        gap: '4px',
        justifyItems: 'center',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
      onClick={(e) => {
        // to prevent folding expanded elements by clicking the name
        if (isExpanded) {
          e.preventDefault();
        }
        onSelect(element.id as UUID);
      }}
    >
      <span
        style={{
          ...(level === 1 ? firstLevelStyle : {}),
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {element.name}
      </span>
    </Typography>
  </Box>
);

export default Node;
