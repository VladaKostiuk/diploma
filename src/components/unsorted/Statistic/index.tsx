import { Box, Typography } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { CashDeskStatistic, CustomerInQueue } from 'types/global';

export interface StatisticProps {
  statistic: CashDeskStatistic[];
}

export const Statistic: FC<StatisticProps> = ({ statistic }) => {
  const [customers, setCustomers] = useState<CustomerInQueue[]>([]);

  const avgTimeInQueue = useMemo(() => {
    let time = 0;
    customers.forEach((customer) => {
      console.log(time, customer.serviceStartTime - customer.arrivalTime);
      time = time + customer.serviceStartTime - customer.arrivalTime;
    });
    return (time / customers.length).toFixed(2);
  }, [customers]);

  useEffect(() => {
    statistic.forEach((cashDeskStatistic) => {
      setCustomers((prevCustomers) => [
        ...prevCustomers,
        ...cashDeskStatistic.servicedCustomers,
      ]);
    });
  }, [statistic]);

  return (
    <Box sx={{ p: '16px', display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h3"
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          textDecoration: 'underline',
        }}
      >
        Статистика:
      </Typography>
      <Box>Середній час знаходження в черзі: {avgTimeInQueue}</Box>
      <Box>Середній час знаходження в системі</Box>
      <Box>Середня кількість вимог в черзі</Box>
      <Box>Середня кількість вимог в системі</Box>
      <Box>Середня кількість зайнятих кас (каналів обслуговування)</Box>
    </Box>
  );
};
