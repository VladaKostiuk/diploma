import AddIcon from '@mui/icons-material/Add';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { FC } from 'react';
import { CashDesk as CashDeskInstance } from 'utils/cashDesk';

import { CashDesk } from '../CashDesk';

export interface ShopProps {
  cashDesks: CashDeskInstance[];
  time: number;
  handleAddCashDesk: () => void;
}

export const Shop: FC<ShopProps> = ({
  time,
  cashDesks,
  handleAddCashDesk,
}) => {
  return (
    <Box
      sx={{
        p: '16px 8px',
        width: '100%',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bgcolor: '#e0f6fd',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          'z-index': -1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '64px',
            letterSpacing: '5px',
            color: '#c3c3c3',
          }}
        >
          Магазин
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        {cashDesks.map((cashDesk, index) => (
          <CashDesk
            time={time}
            cashDesk={cashDesk}
            orderNumber={index + 1}
            key={cashDesk.id}
          />
        ))}
        <Box
          sx={{
            width: '150px',
            bgcolor: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
            border: '3px dashed grey',
          }}
        >
          <Typography
            sx={{
              fontSize: '22px',
              letterSpacing: '1px',
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: '16px',
              color: 'inherit',
            }}
          >
            Додати касу
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            size="small"
            onClick={handleAddCashDesk}
          >
            <AddIcon sx={{ width: '30px', height: '30px' }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
