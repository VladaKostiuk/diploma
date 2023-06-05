import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Avatar, AvatarProps } from '@mui/material';
import { FC } from 'react';
import { Customer } from 'types/global';
import { CustomerMarkerStatus } from 'utils/constants';

export interface CustomerMarkerProps extends AvatarProps {
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

  const backgroundColor = (() => {
    if (customer.gender === 'male') {
      return 'lightBlue';
    }
    if (customer.gender === 'female') {
      return 'pink';
    }
    return 'lightgrey';
  })();

  const border = (() => {
    if (status === CustomerMarkerStatus.IN_SERVICE) {
      return '2px solid lime !important';
    }
    return '1px solid white !important';
  })();

  return (
    <Avatar
      sx={{
        '&.MuiAvatar-root': {
          width: '30px',
          height: '30px',
          fontSize: '14px',
          border,
          bgcolor: backgroundColor,
        },
      }}
      {...props}
    >
      {customer.goodsAmount}
      {/* <ShoppingBasketIcon sx={{ ml: '2px', fontSize: '14px' }} /> */}
    </Avatar>
  );
};
