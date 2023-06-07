import { Box, BoxProps } from '@mui/material';
import { FC } from 'react';

export type LayoutProps = {
  children?: JSX.Element | JSX.Element[];
} & BoxProps;

export const Layout: FC<LayoutProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={{ mt: '66px', ...sx }} {...props}>
      {children}
    </Box>
  );
};
