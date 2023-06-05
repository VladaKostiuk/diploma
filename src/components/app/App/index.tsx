import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Drawer, IconButton } from '@mui/material';
import { Filters } from 'components/unsorted/Filters';
import { Shop } from 'components/unsorted/Shop';
import { useStopwatch } from 'hooks/useStopwatch';
import localforage from 'localforage';
import { FC, useEffect, useMemo, useState } from 'react';
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

  const {
    time,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    active: stopwatchActive,
  } = useStopwatch(speed);

  const shop = useMemo(() => new ShopClass({ cashDesksAmount: 2 }), []);

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
    const useDummyData = false;

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
          alert('Покупців згенеровано!');
        }
        handleGetDbData();
      });
  };

  const handleResetData = () => {
    localforage.removeItem(Stores.Customers).then(() => {
      setDbCustomers(undefined);
      handleResetShop();
      alert('Покупців очищено!');
    });
  };

  useEffect(() => {
    const customers = dbCustomers?.[time];
    shop.updateShop(time, customers);
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
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Button
            sx={{ width: '200px' }}
            variant="outlined"
            onClick={() => {
              shop.openCashDesk();
            }}
            // disabled={!stopwatchActive}
          >
            Add Cash Desk
          </Button>
          <Shop cashDesks={shop.getCashDesks()} />
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
