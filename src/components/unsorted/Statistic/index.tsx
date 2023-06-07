import { Box, Typography } from '@mui/material';
import _ from 'lodash';
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
      time = time + customer.serviceStartTime - customer.arrivalTime;
    });
    return (time / customers.length || 0).toFixed(2);
  }, [customers]);

  const avgTimeInShop = useMemo(() => {
    let time = 0;
    customers.forEach((customer) => {
      time = time + customer.serviceEndTime - customer.arrivalTime;
    });
    return (time / customers.length || 0).toFixed(2);
  }, [customers]);

  const avgQueueLength = useMemo(() => {
    const queues = statistic.map(({ queueLengthAtTime }) => queueLengthAtTime);
    // console.log(queues);
  }, [statistic]);

  useEffect(() => {
    setCustomers([]);
    statistic.forEach((cashDeskStatistic) => {
      setCustomers((prevCustomers) => [
        ...prevCustomers,
        ...cashDeskStatistic.servicedCustomers,
      ]);
    });
  }, [statistic]);

  return (
    <Box
      sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      <Typography
        variant="h3"
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          textDecoration: 'underline',
          mb: '8px',
        }}
      >
        Статистика:
      </Typography>
      <Box>Середній час знаходження в черзі: {avgTimeInQueue}</Box>
      <Box>Середній час знаходження в системі: {avgTimeInShop}</Box>
      {/* <Box>Середня кількість вимог в черзі</Box>
      <Box>Середня кількість вимог в системі</Box>
      <Box>Середня кількість зайнятих кас (каналів обслуговування)</Box> */}
    </Box>
  );
};
