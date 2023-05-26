import { Box, BoxProps } from '@mui/material';
import { FC } from 'react';

export interface HeaderProps extends BoxProps {
  q?: string;
}

export const Header: FC<HeaderProps> = ({ sx, ...props }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '50px',
      background: 'lightgrey',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      px: '12px',
      ...sx,
    }}
    {...props}
  />
);
