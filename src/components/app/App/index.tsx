import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import { Filters } from 'components/unsorted/Filters';
import { Shop } from 'components/unsorted/Shop';
import { useStopwatch } from 'hooks/useStopwatch';
import localforage from 'localforage';
import { FC, useEffect, useMemo, useState } from 'react';
import { Customer } from 'types/global';
import { CashDesk } from 'utils/cashDesk';
import { Stores } from 'utils/constants';
import { dummyCustomers } from 'utils/dummyCustomers';
import { generateCustomers } from 'utils/generateCustomers';
import {
  prepareCustomersData,
  PreparedCustomersData,
} from 'utils/prepareCustomersData';
import { Shop as ShopClass } from 'utils/shop';

import { Header } from '../Header';
import { Layout } from '../Layout';

export const App: FC = () => {
  const [speed, setSpeed] = useState(1);
  const [dbCustomers, setDbCustomers] = useState<PreparedCustomersData>();
  const [showFilters, setShowFilters] = useState(false);
  const [unservedCustomers, setUnservedCustomers] = useState<Customer[]>([]);
  const [cashDesks, setCashDesks] = useState<CashDesk[]>([]);

  const {
    time,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    active: stopwatchActive,
  } = useStopwatch(speed);

  const shop = useMemo(() => new ShopClass({ cashDesksAmount: 1 }), []);

  const handleShowFilters = () => {
    setShowFilters(true);
  };

  const handleHideFilters = () => {
    setShowFilters(false);
  };

  const handleResetShop = () => {
    resetStopwatch();
    shop.resetShop();
  };

  const handleGetDbData = () => {
    localforage.getItem(Stores.Customers).then((dbCustomers) => {
      setDbCustomers(dbCustomers as PreparedCustomersData);
    });
  };

  const handleGenerateData = () => {
    // Dummy data
    const useDummyData = true;

    const generatedCustomers = useDummyData
      ? dummyCustomers
      : generateCustomers(100, {
          arrivalTime: { min: 5, max: 10 },
        });

    const preparedCustomers = prepareCustomersData(generatedCustomers);
    localforage
      .setItem(Stores.Customers, preparedCustomers)
      .then((dbCustomers) => {
        if (dbCustomers) {
          setDbCustomers(dbCustomers as PreparedCustomersData);
          // alert('Покупців згенеровано!');
        }
        handleGetDbData();
      });
  };

  const handleResetData = () => {
    localforage.removeItem(Stores.Customers).then(() => {
      setDbCustomers(undefined);
      handleResetShop();
      // alert('Покупців очищено!');
    });
  };

  const handleAddCashDesk = () => {
    const shopCashDesks = shop.addCashDesk();
    setCashDesks(shopCashDesks);
  };

  useEffect(() => {
    const customers = dbCustomers?.[time];
    const updatedShop = shop.updateShop(time, customers);
    const { unservedCustomers: shopUnservedCustomers } = updatedShop || {};
    if (unservedCustomers) {
      setUnservedCustomers(shopUnservedCustomers);
    }
    setCashDesks(updatedShop.getCashDesks());
  }, [time]);

  useEffect(() => {
    handleGetDbData();
  }, []);

  return (
    <Box>
      <Header
        timer={{
          active: stopwatchActive,
          time,
          startStopwatch,
          pauseStopwatch,
          resetStopwatch: handleResetShop,
          speed,
          setSpeed,
        }}
        customersData={dbCustomers}
        resetData={handleResetData}
        generateData={handleGenerateData}
        handleShowFilters={handleShowFilters}
      />

      <Layout
        sx={{
          px: '12px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Typography>{unservedCustomers.length}</Typography>
          <Shop
            time={time}
            cashDesks={cashDesks}
            handleAddCashDesk={handleAddCashDesk}
          />
        </Box>

        <Drawer
          sx={{ position: 'relative' }}
          anchor="right"
          onClose={handleHideFilters}
          open={showFilters}
        >
          <IconButton
            sx={{ position: 'absolute', top: '8px', right: '8px' }}
            onClick={handleHideFilters}
          >
            <CancelIcon />
          </IconButton>
          <Filters />
        </Drawer>
      </Layout>
    </Box>
  );
};
