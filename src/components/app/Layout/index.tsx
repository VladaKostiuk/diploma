import { Box } from '@mui/material';
import { FC } from 'react';

export type LayoutProps = {
  children?: JSX.Element | JSX.Element[];
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  return <Box sx={{ mt: '60px' }}>{children}</Box>;
};
