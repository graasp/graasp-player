import { Link } from 'react-router-dom';

import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';

import { usePlayerTranslation } from '@/config/i18n';
import { HOME_PATH } from '@/config/paths';
import { PLAYER } from '@/langs/constants';

const FallbackComponent = (): JSX.Element => {
  const { t: translateBuilder } = usePlayerTranslation();

  return (
    <Stack
      direction={['column-reverse', 'row']}
      justifyContent="center"
      alignItems="center"
      height="100svh"
      spacing={4}
    >
      <Box>
        <Typography variant="h1" fontSize="6em">
          {translateBuilder(PLAYER.FALLBACK_TITLE)}
        </Typography>
        <Typography>{translateBuilder(PLAYER.FALLBACK_TEXT)}</Typography>
        <Button
          component={Link}
          to={HOME_PATH}
          sx={{ mt: 3 }}
          reloadDocument
          variant="contained"
        >
          {translateBuilder(PLAYER.FALLBACK_RELOAD_PAGE)}
        </Button>
      </Box>
      <ErrorOutline
        fontSize="large"
        htmlColor="#5050d2"
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '10em',
          aspectRatio: 1,
          height: 'auto',
          maxHeight: '10em',
        }}
      />
    </Stack>
  );
};

export default FallbackComponent;
