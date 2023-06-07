import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import SettingsIcon from '@mui/icons-material/Settings';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import {
  AvatarGroup,
  Box,
  Divider,
  IconButton,
  Menu,
  Typography,
} from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { CashDesk as CashDeskInstance } from 'utils/cashDesk';
import { CustomerMarkerStatus } from 'utils/constants';

import { CustomerMarker } from '../CustomerMarker';

export interface CashDeskProps {
  cashDesk: CashDeskInstance;
  orderNumber: number;
  time: number;
}

export const CashDesk: FC<CashDeskProps> = ({
  cashDesk,
  orderNumber,
  time,
}) => {
  const {
    filters,
    queue,
    activeCustomer,
    statistic,
    servingTime,
    // unservedCustomers,
    activeCustomerServingTime,
    queueServingTime,
  } = cashDesk || {};
  const [open, setOpen] = useState(filters.open);
  const [modalAnchorEl, setModalAnchorEl] = useState<null | HTMLElement>(null);

  const modalOpen = Boolean(modalAnchorEl);

  const handleOpenModal = (event: React.MouseEvent<HTMLElement>) => {
    setModalAnchorEl(event.currentTarget);
  };
  const handleCloseModal = () => {
    setModalAnchorEl(null);
  };

  const handleOpenCashDesk = () => {
    const {
      filters: { open: cashDeskOpen },
    } = cashDesk.openCashDesk();
    setOpen(cashDeskOpen);
  };

  const handleCloseCashDesk = () => {
    const {
      filters: { open: cashDeskOpen },
    } = cashDesk.closeCashDesk();
    setOpen(cashDeskOpen);
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
        width: '200px',
        display: 'flex',
        opacity: 0.8,
        flexDirection: 'column',
        p: '8px',
        pt: 0,
        bgcolor: 'lightgrey',
        border: '2px solid',
        borderColor: open ? '#3a8f3a' : '#ff7c7c',
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', mx: '-8px' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>{actionButton}</Box>
          <Typography
            sx={{
              textDecoration: 'underline',
              color: open ? 'green' : 'red',
            }}
          >
            #{open ? 'відкрита' : 'закрита'}
          </Typography>
        </Box>
        <IconButton onClick={handleOpenModal}>
          {/* <SettingsIcon /> */}
          <InfoIcon />
        </IconButton>
        <Menu
          anchorEl={modalAnchorEl}
          open={modalOpen}
          onClose={handleCloseModal}
          onClick={handleCloseModal}
        >
          <Typography
            sx={{ display: 'flex', flexDirection: 'column', p: '8px' }}
          >
            Час обробки 1 товару:&nbsp;
            <Typography component="span" fontWeight="bold">
              {cashDesk.filters.processingTimePerGoodItem} секунда(-и)
            </Typography>
          </Typography>
        </Menu>
      </Box>

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
          <Typography>{time}</Typography>
          <Typography color="primary">{servingTime}</Typography>
          <AccessTimeIcon
            color="primary"
            sx={{ width: '20px', height: '20px' }}
          />
        </Box>
      </Box>

      {/* <Typography>{unservedCustomers.length}</Typography> */}

      <Divider />

      <Typography>Queue time {queueServingTime}</Typography>
      <Typography>Active time {activeCustomerServingTime}</Typography>

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
          {statistic?.servicedCustomers
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
