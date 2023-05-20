import { Box, Button } from '@mui/material';
import { Clock } from 'components/unsorted/Clock';
import { useStopwatch } from 'hooks/useStopwatch';
import { FC, useState } from 'react';
import { Priorities } from 'utils/constants';
import { generateCustomers } from 'utils/generateCustomers';

export const App: FC = () => {
  const [speed, setSpeed] = useState(1);
  const { time, startStopwatch, stopStopwatch } = useStopwatch(speed);

  const customers = generateCustomers(100);

  return (
    <Box>
      <Clock time={time} />
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
