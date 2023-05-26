import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Box, BoxProps } from '@mui/material';
import { FC } from 'react';
import { Customer } from 'types/global';
import { CustomerMarkerStatus } from 'utils/constants';

export interface CustomerMarkerProps extends BoxProps {
  status: CustomerMarkerStatus;
  customer: Customer | null;
}

export const CustomerMarker: FC<CustomerMarkerProps> = ({
  status,
  customer,
  sx,
  ...props
}) => {
  if (!customer) {
    return null;
  }

  let statusColor;
  if (status === CustomerMarkerStatus.IN_QUEUE && customer.gender === 'male') {
    statusColor = 'lightblue';
  } else if (
    status === CustomerMarkerStatus.IN_QUEUE &&
    customer.gender === 'female'
  ) {
    statusColor = 'pink';
  } else if (status === CustomerMarkerStatus.IN_SERVICE) {
    statusColor = 'green';
  } else {
    statusColor = 'gray';
  }

  return (
    <Box
      sx={{
        width: '45px',
        height: '45px',
        borderRadius: '50px',
        border: `3px solid ${statusColor}`,
        background: 'lightgray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        p: '4px',
        ...sx,
      }}
      {...props}
    >
      {customer.goodsAmount}
      <ShoppingBasketIcon sx={{ ml: '2px', fontSize: '14px' }} />
    </Box>
  );
};
