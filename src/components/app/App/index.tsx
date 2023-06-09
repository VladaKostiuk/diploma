import BarChartIcon from '@mui/icons-material/BarChart';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  Button,
  Card,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material';
import { Filters } from 'components/unsorted/Filters';
import { Modal } from 'components/unsorted/Modal';
import { Shop } from 'components/unsorted/Shop';
import { Statistic } from 'components/unsorted/Statistic';
import { useStopwatch } from 'hooks/useStopwatch';
import localforage from 'localforage';
import poissonProcess from 'poisson-process';
import { FC, useEffect, useMemo, useState } from 'react';
import { CashDeskStatistic, Customer, ShopFilters } from 'types/global';
import { CashDesk } from 'utils/cashDesk';
import { initialCashDeskFilters, Stores } from 'utils/constants';
import { dummyCustomers } from 'utils/dummyCustomers';
import { generateCustomers } from 'utils/generateCustomers';
import { generatePoissonProcessCustomer } from 'utils/generatePoissonProcessCustomers';
import {
  prepareCustomersData,
  PreparedCustomersData,
} from 'utils/prepareCustomersData';
import { Shop as ShopClass } from 'utils/shop';

import { Header } from '../Header';
import { Layout } from '../Layout';

const initialShopFilters: ShopFilters = {
  maximalServingTime: 0,
  totalCashDesks: 1,
  priorityInService: false,
  cashDesks: [initialCashDeskFilters],
};

export const App: FC = () => {
  const [speed, setSpeed] = useState(1);
  const [dbCustomers, setDbCustomers] = useState<PreparedCustomersData>();
  const [shopFilters, setShopFilters] =
    useState<ShopFilters>(initialShopFilters);
  const [showDrawer, setShowDrawer] = useState(false);
  const [unservedCustomers, setUnservedCustomers] = useState<Customer[]>([]);
  const [cashDesks, setCashDesks] = useState<CashDesk[]>([]);
  const [showStatistic, setShowStatistic] = useState(false);
  const [cashDesksStatistic, setCashDesksStatistic] = useState<
    CashDeskStatistic[]
  >([]);
  const [poissonCustomers, setPoissonCustomers] = useState<Customer[]>([]);
  const [usePoisson, setUsePoisson] = useState(false);

  const {
    time,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    active: stopwatchActive,
  } = useStopwatch(speed);

  const shop = useMemo(() => new ShopClass(shopFilters), [shopFilters]);

  const poisson = useMemo(
    () =>
      poissonProcess.create(2000, function message() {
        console.log('Customer generated.');
        const customer = generatePoissonProcessCustomer();
        setPoissonCustomers((prev) => [
          ...prev,
          { ...customer, arrivalTime: time },
        ]);
      }),
    [],
  );

  const handleStartApplication = () => {
    usePoisson && poisson.start();
    startStopwatch();
  };

  const handlePauseApplication = () => {
    usePoisson && poisson.stop();
    pauseStopwatch();
  };

  const handleShowDrawer = () => {
    setShowDrawer(true);
  };

  const handleHideDrawer = () => {
    setShowDrawer(false);
  };

  const handleResetShop = () => {
    usePoisson && poisson.stop();
    resetStopwatch();
    shop.resetShop();
  };

  useEffect(() => {
    handleResetShop();
  }, [usePoisson]);

  const handleSaveShopFilters = (filters: ShopFilters) => {
    setShopFilters(filters);
    handleResetShop();
    handleHideDrawer();
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
    const customers = usePoisson ? poissonCustomers : dbCustomers?.[time];
    setPoissonCustomers([]);
    const updatedShop = shop.updateShop(time, customers || []);
    const { unservedCustomers: shopUnservedCustomers } = updatedShop || {};
    if (unservedCustomers) {
      setUnservedCustomers(shopUnservedCustomers);
    }
    const updatedCashDesks = updatedShop.getCashDesks();
    setCashDesks(updatedCashDesks);
    setCashDesksStatistic(
      updatedCashDesks.map((cashDesks) => cashDesks.statistic),
    );
  }, [time, shop]);

  useEffect(() => {
    handleGetDbData();
  }, []);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        timer={{
          active: stopwatchActive,
          time,
          startStopwatch: handleStartApplication,
          pauseStopwatch: handlePauseApplication,
          resetStopwatch: handleResetShop,
          speed,
          setSpeed,
        }}
        customersData={dbCustomers}
        resetData={handleResetData}
        generateData={handleGenerateData}
        handleShowFilters={handleShowDrawer}
        usePoisson={usePoisson}
      />

      <Layout
        sx={{
          px: '12px',
          flexGrow: 1,
          position: 'relative',
        }}
      >
        <IconButton
          size="large"
          color="primary"
          sx={{
            position: 'absolute',
            right: '16px',
            bottom: '16px',
            border: '1px solid #1976d2',
          }}
          onClick={() => {
            setShowStatistic(true);
          }}
        >
          <BarChartIcon sx={{ width: '40px', height: '40px' }} />
        </IconButton>
        {/* <Button onClick={handleStartApplication}>Start</Button> */}
        <Box
          sx={{
            display: 'grid',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Shop
            time={time}
            cashDesks={cashDesks}
            unservedCustomers={unservedCustomers}
            // handleAddCashDesk={handleAddCashDesk}
            // TODO: Temp solution;
            handleAddCashDesk={handleShowDrawer}
          />
        </Box>

        <Drawer
          sx={{ position: 'relative' }}
          anchor="right"
          onClose={handleHideDrawer}
          open={showDrawer}
        >
          <IconButton
            sx={{ position: 'absolute', top: '8px', right: '8px' }}
            onClick={handleHideDrawer}
          >
            <CancelIcon />
          </IconButton>
          <Filters
            usePoisson={usePoisson}
            setUsePoisson={setUsePoisson}
            filters={shopFilters}
            saveFilters={handleSaveShopFilters}
          />
        </Drawer>
      </Layout>
      <Modal
        open={showStatistic}
        onClose={() => {
          setShowStatistic(false);
        }}
      >
        <Statistic statistic={cashDesksStatistic} />
      </Modal>
    </Box>
  );
};
