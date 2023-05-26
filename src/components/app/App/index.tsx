import { Button, ButtonGroup, List, ListItem } from '@mui/material';
import { ClockGroup } from 'components/unsorted/ClockGroup';
import { CustomersTable } from 'components/unsorted/CustomersTable';
import { Modal } from 'components/unsorted/Modal';
import { useStopwatch } from 'hooks/useStopwatch';
import localforage from 'localforage';
import { FC, useEffect, useMemo, useState } from 'react';
import { CashDesk } from 'utils/cashDesk';
import { Stores } from 'utils/constants';
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

  const handleResetQueue = () => {
    resetStopwatch();
    cashDesk.resetQueue();
  };

  const handleGetDbData = () => {
    localforage.getItem(Stores.Customers).then((dbCustomers) => {
      setDbCustomers(dbCustomers as PreparedCustomersData);
    });
  };

  const handleGenerateData = () => {
    const generatedCustomers = generateCustomers(100, {
      arrivalTime: { max: 5 },
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
      handleResetQueue();
      alert('Покупців очищено!');
    });
  };

  useEffect(() => {
    handleGetDbData();
  }, []);

  useEffect(() => {
    if (dbCustomers?.[time]) {
      const customers = dbCustomers[time];
      cashDesk.enqueue(customers);
    }
  }, [time]);

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
          resetStopwatch={handleResetQueue}
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
          {dbCustomers && Object.keys(dbCustomers)?.length}
          <List>
            {cashDesk.getQueue().map((customer) => (
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
