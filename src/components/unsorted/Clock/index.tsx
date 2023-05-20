import { Typography } from '@mui/material';
import { FC } from 'react';

import { formatTime } from './formatTime';

export interface ClockProps {
  time: number;
}

export const Clock: FC<ClockProps> = ({ time }) => {
  const date = new Date(100 * time);
  const formattedTime = formatTime(date);
  
  return <Typography>{formattedTime}</Typography>;
};
