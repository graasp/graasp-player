import { Stack, Typography } from '@mui/material';

import { Button } from '@graasp/ui';

import { CircleUser } from 'lucide-react';

import { usePlayerTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { ENROLL_BUTTON_SELECTOR } from '@/config/selectors';
import { PLAYER } from '@/langs/constants';

export const EnrollContent = ({ itemId }: { itemId: string }): JSX.Element => {
  const { t: translatePlayer } = usePlayerTranslation();

  const { mutate: enroll } = mutations.useEnroll();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <CircleUser size={40} />
      <Typography variant="h3">
        {translatePlayer(PLAYER.ENROLL_TITLE)}
      </Typography>
      <Typography variant="subtitle2">
        {translatePlayer(PLAYER.ENROLL_DESCRIPTION)}
      </Typography>
      <Button
        dataCy={ENROLL_BUTTON_SELECTOR}
        onClick={() => {
          enroll({ itemId });
        }}
      >
        {translatePlayer(PLAYER.ENROLL_BUTTON)}
      </Button>
    </Stack>
  );
};
