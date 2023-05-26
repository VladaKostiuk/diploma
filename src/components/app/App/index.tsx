import { Button, ButtonGroup, List, ListItem, Typography } from '@mui/material';
import { ClockGroup } from 'components/unsorted/ClockGroup';
import { CustomersTable } from 'components/unsorted/CustomersTable';
import { Modal } from 'components/unsorted/Modal';
import { useStopwatch } from 'hooks/useStopwatch';
import localforage from 'localforage';
import { FC, useEffect, useMemo, useState } from 'react';
import { CashDesk } from 'utils/cashDesk';
import { Stores } from 'utils/constants';
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
    localforage.getItem(Stores.Customers).then((dbCustomers) => {
      setDbCustomers(dbCustomers as PreparedCustomersData);
    });
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
    // Dummy:
    // const preparedCustomers = prepareCustomersData(dummyCustomers);
    // setDbCustomers(preparedCustomers);
  }, []);

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

      <Layout>
        <>
          <Typography>Queue:</Typography>
          <List>
            {cashDesk.getQueue().map((customer) => (
              <ListItem key={customer.id}>
                {customer.id} : {customer.arrivalTime}
              </ListItem>
            ))}
          </List>
          <hr />
          <Typography>Active customer:</Typography>
          <Typography>id: {cashDesk.activeCustomer?.id}</Typography>
          <Typography>
            start time: {cashDesk.activeCustomer?.serviceStartTime}
          </Typography>
          <Typography>
            end time: {cashDesk.activeCustomer?.serviceEndTime}
          </Typography>
          <hr />
          <List>
            {cashDesk.servicedCustomers.map((customer) => (
              <ListItem key={customer.id}>
                {customer.id} : {customer.arrivalTime}
              </ListItem>
            ))}
          </List>
        </>
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
