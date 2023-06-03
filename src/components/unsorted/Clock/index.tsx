import { Typography } from '@mui/material';
import { FC } from 'react';

import { formatTime } from './formatTime';

export interface ClockProps {
  time: number;
}

export const Clock: FC<ClockProps> = ({ time }) => {
  const date = new Date(1000 * time);
  const formattedTime = formatTime(date);

  return (
    <Typography sx={{ fontSize: '16px', fontWeigth: 'bold' }}>
      <span>{formattedTime}</span>
      <span> ({time} секунд/-и)</span>
    </Typography>
  );
};