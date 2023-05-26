import { Button, ButtonGroup } from '@mui/material';
import { ClockGroup } from 'components/unsorted/ClockGroup';
import { CustomersTable } from 'components/unsorted/CustomersTable';
import { Modal } from 'components/unsorted/Modal';
import { useStopwatch } from 'hooks/useStopwatch';
import localforage from 'localforage';
import { FC, useEffect, useMemo, useState } from 'react';
import { CashDesk } from 'utils/cashDesk';
import { Stores } from 'utils/constants';
import { generateCustomers } from 'utils/generateCustomers';
import {
  prepareCustomers,
  PreparedCustomersData,
} from 'utils/prepareCustomers';
import { CustomerQueue } from 'utils/queue';

import { Header } from '../Header';
import { Layout } from '../Layout';

const generatedCustomers = generateCustomers(100, { arrivalTime: { max: 5 } });
const preparedCustomers = prepareCustomers(generatedCustomers);

export const App: FC = () => {
  const [speed, setSpeed] = useState(1);
  const [dbCustomers, setDbCustomers] = useState<PreparedCustomersData>();
  const [showCustomersTable, setShowCustomersTable] = useState(false);
  const customerQueue = useMemo(() => new CustomerQueue(), []);
  // const cashDesk = new CashDesk({
  //   open: true,
  //   filters: { processingTimePerGoodItem: 1 },
  // });

  const { time, startStopwatch, stopStopwatch } = useStopwatch(speed);

  useEffect(() => {
    localforage.setItem(Stores.Customers, preparedCustomers);
  }, []);

  useEffect(() => {
    localforage.getItem(Stores.Customers).then((dbCustomers) => {
      setDbCustomers(dbCustomers as PreparedCustomersData);
    });
  }, []);

  useEffect(() => {
    for (let i = speed - 1; i >= 0; i--) {
      const iterator = time - i;
      if (iterator > 0 && dbCustomers?.[iterator]) {
        // console.log(iterator, preparedCustomers[time - i]);
        customerQueue.enqueue(dbCustomers[time - i]);
      }
    }
  }, [time, speed]);

  const handleCloseCustomersTableModal = () => {
    setShowCustomersTable(false);
  };

  const handleShowCustomersTableModal = () => {
    setShowCustomersTable(true);
  };

  return (
    <>
      <Header sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <ClockGroup
          time={time}
          speed={speed}
          setSpeed={setSpeed}
          startStopwatch={startStopwatch}
          stopStopwatch={stopStopwatch}
        />
        <ButtonGroup variant="contained">
          <Button color="success">Generate data</Button>
          <Button onClick={handleShowCustomersTableModal} color="info">
            Show data
          </Button>
        </ButtonGroup>
      </Header>

      <Layout>
        {/* <List>
        {customerQueue.queue.map((customer) => (
          <ListItem key={customer.id}>
            {customer.id} : {customer.arrivalTime}
          </ListItem>
        ))}
      </List> */}
      </Layout>

      <Modal
        title="Згенеровані покупці:"
        open={showCustomersTable}
        onClose={handleCloseCustomersTableModal}
      >
        <CustomersTable customers={generatedCustomers} />
      </Modal>
    </>
  );
};
