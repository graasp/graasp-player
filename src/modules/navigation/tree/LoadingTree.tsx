import { Skeleton, Stack, Typography } from '@mui/material';

const LoadingTree = (): JSX.Element => (
  <Stack p={1}>
    {['elem 1', 'elem 2', 'elem 3', 'elem 4', 'elem 5'].map((el) => (
      <Typography key={el}>
        <Skeleton variant="text" />
      </Typography>
    ))}
  </Stack>
);
export default LoadingTree;
