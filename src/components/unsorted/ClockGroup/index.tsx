import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { FC } from 'react';

import { Clock } from '../Clock';

export interface ClockGroupProps extends BoxProps {
  time: number;
  speed: number;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  startStopwatch: () => void;
  stopStopwatch: () => void;
  resetStopwatch: () => void;
  disabled?: boolean;
  active: boolean;
}

export const ClockGroup: FC<ClockGroupProps> = ({
  time,
  speed,
  setSpeed,
  startStopwatch,
  stopStopwatch,
  resetStopwatch,
  sx,
  disabled,
  active,
  ...props
}) => {
  const handleChangeSpeed = (
    event: React.MouseEvent<HTMLElement>,
    newSpeed: number,
  ) => {
    setSpeed(newSpeed);
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }} {...props}>
      <ButtonGroup size="medium" disabled={disabled} sx={{ mr: '12px' }}>
        <Button
          title="Reset clock"
          onClick={() => {
            resetStopwatch();
          }}
        >
          <StopIcon />
        </Button>
        {active ? (
          <Button
            title="Stop clock"
            onClick={() => {
              stopStopwatch();
            }}
          >
            <PauseIcon />
          </Button>
        ) : (
          <Button
            onClick={() => {
              startStopwatch();
            }}
            title="Start clock"
          >
            <PlayArrowIcon />
          </Button>
        )}
      </ButtonGroup>
      <Clock time={time} />
      <ToggleButtonGroup
        disabled={disabled}
        sx={{ ml: '12px' }}
        onChange={handleChangeSpeed}
        value={speed}
        color="primary"
        exclusive
        size="small"
      >
        <ToggleButton
          sx={{ fontSize: '16px', fontWeight: 'bold', width: '32px' }}
          value={0.5}
        >
          0.5
        </ToggleButton>
        <ToggleButton
          sx={{ fontSize: '16px', fontWeight: 'bold', width: '32px' }}
          value={1}
        >
          1
        </ToggleButton>
        <ToggleButton
          sx={{ fontSize: '16px', fontWeight: 'bold', width: '32px' }}
          value={2}
        >
          2
        </ToggleButton>
        <ToggleButton
          sx={{ fontSize: '16px', fontWeight: 'bold', width: '32px' }}
          value={5}
        >
          5
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
