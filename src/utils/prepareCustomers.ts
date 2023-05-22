import { Customer } from 'types/global';

export type PreparedCustomersData = Record<number, Customer[]>;

export const prepareCustomers = (customers: Customer[]) => {
  const data: PreparedCustomersData = customers.reduce(
    (accumulator: PreparedCustomersData, customer) => {
      const { arrivalTime } = customer || {};
      const dataItem = accumulator[arrivalTime];

      if (dataItem && dataItem.length > 0) {
        return { ...accumulator, [arrivalTime]: [...dataItem, customer] };
      }

      return { ...accumulator, [arrivalTime]: [customer] };
    },
    {},
  );
  return data;
};
