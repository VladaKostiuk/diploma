import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import {
  AvatarGroup,
  Box,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { CashDesk as CashDeskInstance } from 'utils/cashDesk';
import { CustomerMarkerStatus } from 'utils/constants';

import { CustomerMarker } from '../CustomerMarker';

export interface CashDeskProps {
  cashDesk: CashDeskInstance;
  orderNumber: number;
}

export const CashDesk: FC<CashDeskProps> = ({ cashDesk, orderNumber }) => {
  const {
    open: cashDeskOpen,
    queue,
    activeCustomer,
    servicedCustomers,
    servingTime,
  } = cashDesk || {};
  const [open, setOpen] = useState(cashDeskOpen);

  const handleOpenCashDesk = () => {
    const isOpen = cashDesk.openCashDesk();
    setOpen(isOpen);
  };

  const handleCloseCashDesk = () => {
    const isOpen = cashDesk.closeCashDesk();
    setOpen(isOpen);
  };

  const actionButton = useMemo(() => {
    const buttonColor = open ? 'error' : 'success';
    const buttonOnClick = open ? handleCloseCashDesk : handleOpenCashDesk;
    const buttonTitle = open ? 'Закрити касу' : 'Відкрити касу';
    const buttonIcon = open ? (
      <StopCircleIcon />
    ) : (
      <PlayCircleFilledWhiteIcon />
    );
    return (
      <IconButton
        title={buttonTitle}
        color={buttonColor}
        onClick={buttonOnClick}
      >
        {buttonIcon}
      </IconButton>
    );
  }, [open]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '150px',
        display: 'flex',
        flexDirection: 'column',
        p: '8px',
        bgcolor: 'lightgrey',
        border: '2px solid',
        borderColor: open ? '#3a8f3a' : '#ff7c7c',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>{actionButton}</Box>
      <Typography
        sx={{
          textDecoration: 'underline',
          color: open ? 'green' : 'red',
          mb: '8px',
        }}
      >
        #{open ? 'відкрита' : 'закрита'}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          КАСА {orderNumber}
        </Typography>
        <Box
          title="Час очікування"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
          }}
        >
          <Typography color="primary">{servingTime}</Typography>
          <AccessTimeIcon
            color="primary"
            sx={{ width: '20px', height: '20px' }}
          />
        </Box>
      </Box>

      <Divider />
      <Box sx={{ position: 'relative', height: '120px' }}>
        <Typography sx={{ fontWeight: 'bold', mb: '4px' }}>Черга:</Typography>
        <AvatarGroup
          max={3}
          sx={{
            width: '30px',
            transform: 'rotate(-90deg)',
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              borderWidth: 1,
              fontSize: 14,
              transform: 'rotate(90deg)',
            },
          }}
        >
          {queue.map((customer) => (
            <CustomerMarker
              key={customer.id}
              status={CustomerMarkerStatus.IN_QUEUE}
              customer={customer}
            />
          ))}
        </AvatarGroup>
      </Box>

      <Divider />
      <Box sx={{ height: '65px' }}>
        <Typography sx={{ fontWeight: 'bold', mb: '4px' }}>На касі:</Typography>
        <CustomerMarker
          status={CustomerMarkerStatus.IN_SERVICE}
          customer={activeCustomer}
        />
      </Box>
      <Divider />
      <Box sx={{ height: '65px' }}>
        <Typography sx={{ fontWeight: 'bold', mb: '4px' }}>
          Обслужені:
        </Typography>
        <AvatarGroup
          max={5}
          sx={{
            justifyContent: 'flex-end',
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              borderWidth: 1,
              fontSize: 14,
            },
          }}
        >
          {servicedCustomers
            .slice(0)
            .reverse()
            .map((customer) => (
              <CustomerMarker
                key={customer.id}
                status={CustomerMarkerStatus.IN_QUEUE}
                customer={customer}
              />
            ))}
        </AvatarGroup>
      </Box>
    </Box>
  );
};
