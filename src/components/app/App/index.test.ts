import { generateCustomers } from 'utils/generateCustomers';
import { CustomerQueue } from '.';
import { prepareCustomers } from 'utils/prepareCustomers';

it('works', () => {
  const customers = generateCustomers(100, { arrivalTime: { max: 5 } });
  const preparedCustomers = prepareCustomers(customers);
  const customerQueue = new CustomerQueue();
  // {2: []}

  for (let time = 0; time < 100; time++) {
    if (preparedCustomers[time]) {
      customerQueue.enqueue(preparedCustomers[time])
    }
  }
});
