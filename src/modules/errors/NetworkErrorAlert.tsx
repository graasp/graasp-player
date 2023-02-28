import { Refresh } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { FAILURE_MESSAGES } from '@graasp/translations';

import { useMessagesTranslation, usePlayerTranslation } from '@/config/i18n';

const NetworkErrorAlert = (): JSX.Element => {
  const { t: messagesTranslations } = useMessagesTranslation();
  const { t } = usePlayerTranslation();
  return (
    <Box
      display="flex"
      height="100vh"
      width="100%"
      justifyContent="center"
      margin="auto"
      alignItems="center"
    >
      <Alert severity="error">
        <AlertTitle>
          {messagesTranslations(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
        </AlertTitle>
        <Stack direction="column" alignItems="center">
          <Typography>
            {t(
              'There seems to be a problem joining the server. Please try again later',
            )}
          </Typography>
          <Tooltip title="Reload">
            <span>
              <IconButton onClick={() => window.location.reload()}>
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Alert>
    </Box>
  );
};
export default NetworkErrorAlert;
