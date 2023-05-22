import { Box, Button, List, ListItem } from '@mui/material';
import { Clock } from 'components/unsorted/Clock';
import { useStopwatch } from 'hooks/useStopwatch';
import { FC, useEffect, useMemo } from 'react';
import { Customer } from 'types/global';
import { generateCustomers } from 'utils/generateCustomers';
import { prepareCustomers } from 'utils/prepareCustomers';

export class CustomerQueue {
  queue: Customer[] = [];

  enqueue(customers: Customer[]) {
    this.queue = [...this.queue, ...customers];
  }

  dequeue() {
    const [dequeuedCustomer, ...restQueue] = this.queue;
    this.queue = restQueue;
    return dequeuedCustomer;
  }

  toString() {
    return this.queue.toString();
  }

  // map(...args: Parameters<typeof Array.prototype.map>) {
  //   return this.queue.map(...args);
  // }
}

export const App: FC = () => {
  const speed = 1;
  const customerQueue = useMemo(() => new CustomerQueue(), []);
  const { time, startStopwatch, stopStopwatch } = useStopwatch(speed);

  const customers = generateCustomers(100, { arrivalTime: { max: 5 } });
  const preparedCustomers = prepareCustomers(customers);

  useEffect(() => {
    if (preparedCustomers[time]) {
      console.log(preparedCustomers[time]);
      customerQueue.enqueue(preparedCustomers[time]);
    }
  }, [time]);

  // useEffect(() => {
  //   console.log(customerQueue);
  // }, [customerQueue.]);
  console.log(customerQueue);

  return (
    <Box>
      <Box>
        <Button
          onClick={() => {
            const dequeued = customerQueue.dequeue();
            console.log(dequeued);
          }}
        >
          Dequeue
        </Button>
        <Clock time={time} />
        <Button
          onClick={() => {
            startStopwatch();
          }}
        >
          Start clock
        </Button>
        <Button
          onClick={() => {
            stopStopwatch();
          }}
        >
          Stop clock
        </Button>
      </Box>
      <List>
        {customerQueue.queue.map((customer) => (
          <ListItem key={customer.id}>
            {customer.id}
            {customer.arrivalTime}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
