import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import { ClockGroup } from 'components/unsorted/ClockGroup';
import { CustomerMarker } from 'components/unsorted/CustomerMarker';
import { CustomersTable } from 'components/unsorted/CustomersTable';
import { Modal } from 'components/unsorted/Modal';
import { useStopwatch } from 'hooks/useStopwatch';
import localforage from 'localforage';
import { FC, useEffect, useMemo, useState } from 'react';
import { CashDesk } from 'utils/cashDesk';
import { CustomerMarkerStatus, Stores } from 'utils/constants';
import { dummyCustomers } from 'utils/dummyCustomers';
import { generateCustomers } from 'utils/generateCustomers';
import { parseCustomersData } from 'utils/parseCustomersData';
import {
  prepareCustomersData,
  PreparedCustomersData,
} from 'utils/prepareCustomersData';

import { Header } from '../Header';
import { Layout } from '../Layout';

export const App: FC = () => {
  const [speed, setSpeed] = useState(1);
  const [dbCustomers, setDbCustomers] = useState<PreparedCustomersData>();
  const [showCustomersTable, setShowCustomersTable] = useState(false);

  const {
    time,
    startStopwatch,
    stopStopwatch,
    resetStopwatch,
    active: stopwatchActive,
  } = useStopwatch(speed);

  const cashDesk = useMemo(
    () =>
      new CashDesk({
        open: true,
        filters: { processingTimePerGoodItem: 1 },
      }),
    [],
  );

  const handleCloseCustomersTableModal = () => {
    setShowCustomersTable(false);
  };

  const handleShowCustomersTableModal = () => {
    setShowCustomersTable(true);
  };

  const handleResetCashDesk = () => {
    resetStopwatch();
    cashDesk.resetCashDesk();
  };

  const handleGetDbData = () => {
    // localforage.getItem(Stores.Customers).then((dbCustomers) => {
    //   setDbCustomers(dbCustomers as PreparedCustomersData);
    // });

    // Dummy:
    const preparedCustomers = prepareCustomersData(dummyCustomers);
    setDbCustomers(preparedCustomers);
  };

  const handleGenerateData = () => {
    const generatedCustomers = generateCustomers(100, {
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
      handleResetCashDesk();
      alert('Покупців очищено!');
    });
  };

  useEffect(() => {
    const response = cashDesk.serviceCustomer(time);
    console.log(response);
  }, [time]);

  useEffect(() => {
    if (dbCustomers?.[time]) {
      const customers = dbCustomers[time];
      cashDesk.enqueue(customers);
    }
  }, [time]);

  useEffect(() => {
    handleGetDbData();
  }, []);

  const { activeCustomer } = cashDesk;

  return (
    <>
      <Header sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <ClockGroup
          active={stopwatchActive}
          disabled={!dbCustomers}
          time={time}
          speed={speed}
          setSpeed={setSpeed}
          startStopwatch={startStopwatch}
          stopStopwatch={stopStopwatch}
          resetStopwatch={handleResetCashDesk}
        />
        <ButtonGroup variant="contained">
          <Button
            onClick={handleResetData}
            color="error"
            disabled={!dbCustomers}
          >
            Reset data
          </Button>
          <Button
            onClick={handleGenerateData}
            color="success"
            disabled={!!dbCustomers}
          >
            Generate data
          </Button>
          <Button onClick={handleShowCustomersTableModal} color="info">
            Show data
          </Button>
        </ButtonGroup>
      </Header>

      <Layout
        sx={{
          px: '12px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}
      >
        <Box>
          <Typography>Черга:</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              height: '140px',
              backgroundImage: 'url("https://i.imgur.com/sNU1duD.png")',
              backgroundSize: 'cover',
              boxShadow: 'inset 0px 0px 277px 3px #4c3f37;',
              p: '12px',
            }}
          >
            {cashDesk.getQueue().map((customer) => (
              <Box key={customer.id}>
                <CustomerMarker
                  title={customer.id}
                  status={CustomerMarkerStatus.IN_QUEUE}
                  customer={customer}
                />
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: '12px' }} />
          <Typography>Покупець на касі:</Typography>
          <Box
            sx={{
              backgroundImage: 'url("https://i.imgur.com/sJ1emsB.png")',
              backgroundSize: '500px 100%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#509fa4',
              height: '150px',
              p: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CustomerMarker
              title={activeCustomer?.id}
              status={CustomerMarkerStatus.IN_SERVICE}
              customer={activeCustomer}
            />
            {activeCustomer && (
              <Box sx={{ ml: '12px', width: '50%' }}>
                <Typography>
                  Час початку обслуговування:&nbsp;
                  <span>{cashDesk.activeCustomer?.serviceStartTime}</span>
                </Typography>
                <Typography>
                  Час кінця обслуговування:&nbsp;
                  <span>{cashDesk.activeCustomer?.serviceEndTime}</span>
                </Typography>
              </Box>
            )}
          </Box>
          <Divider sx={{ my: '12px' }} />
          <Typography>Обслужені покупці:</Typography>
          <Box
            sx={{ p: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}
          >
            {cashDesk.servicedCustomers.map((customer) => (
              <Box key={customer.id}>
                <CustomerMarker
                  title={customer?.id}
                  status={CustomerMarkerStatus.SERVICED}
                  customer={customer}
                />
                {/* {customer.id} : {customer.arrivalTime} */}
              </Box>
            ))}
          </Box>
        </Box>
        <Paper></Paper>
      </Layout>

      <Modal
        title="Згенеровані покупці:"
        open={showCustomersTable}
        onClose={handleCloseCustomersTableModal}
      >
        <CustomersTable
          customers={dbCustomers ? parseCustomersData(dbCustomers) : []}
        />
      </Modal>
    </>
  );
};
