import { Box, Button } from '@mui/material';
import { useStopwatch } from 'hooks/useStopwatch';
import { FC, useState } from 'react';

export const App: FC = () => {
  const [speed, setSpeed] = useState(1);
  const { time, startStopwatch, stopStopwatch } = useStopwatch(speed);
  return (
    <Box>
      {(time / 60).toFixed(1)}
      <Button
        onClick={() => {
          startStopwatch();
        }}
      >
        Start clock
      </Button>
      <Button
        onClick={() => {
          stopStopwatch();
        }}
      >
        Stop clock
      </Button>
      <Button
        onClick={() => {
          setSpeed(speed * 2);
        }}
      >
        +
      </Button>
    </Box>
  );
};
