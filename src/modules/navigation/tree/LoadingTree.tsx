import { Skeleton, Stack, Typography } from '@mui/material';

const LoadingTree = (): JSX.Element => (
  <Stack p={1}>
    {Array.from(Array(5)).map(() => (
      <Typography>
        <Skeleton variant="text" />
      </Typography>
    ))}
  </Stack>
);
export default LoadingTree;
