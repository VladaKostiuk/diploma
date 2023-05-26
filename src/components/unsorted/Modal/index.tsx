import {
  Box,
  Modal as MuiModal,
  ModalProps as MuiModalProps,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { SxStyles } from 'types/styles';

export type ModalProps = {
  containerSx?: SxStyles;
  title?: string;
} & MuiModalProps;

export const Modal: FC<ModalProps> = ({
  containerSx,
  children,
  title,
  sx,
  ...props
}) => (
  <MuiModal
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx,
    }}
    {...props}
  >
    <Box
      sx={{
        width: '90vw',
        height: '80vh',
        overflow: 'scroll',
        background: 'white',
        ...containerSx,
      }}
    >
      {title && (
        <Typography
          sx={{ p: '12px', fontWeight: 'bold', textDecoration: 'underline' }}
          variant="h4"
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  </MuiModal>
);
