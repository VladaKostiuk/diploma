import { Customer } from 'types/global';

import { PreparedCustomersData } from './prepareCustomersData';

export const parseCustomersData = (customersData: PreparedCustomersData) => {
  const customers = Object.values(customersData).reduce(
    (accumulator: Customer[], customerDataItem) => {
      return [...accumulator, ...customerDataItem];
    },
    [],
  );
  return customers;
};
