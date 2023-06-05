import { Box } from '@mui/material';
import { FC } from 'react';
import { CashDesk as CashDeskInstance } from 'utils/cashDesk';

import { CashDesk } from '../CashDesk';

export interface ShopProps {
  cashDesks: CashDeskInstance[];
}

export const Shop: FC<ShopProps> = ({ cashDesks }) => {
  return (
    <Box sx={{ display: 'flex', gap: '10px' }}>
      {cashDesks.map((cashDesk, index) => (
        <CashDesk
          cashDesk={cashDesk}
          orderNumber={index + 1}
          key={cashDesk.id}
        />
      ))}
    </Box>
  );
};
