import { fakerUK as faker } from '@faker-js/faker';
import { Customer } from 'types/global';

interface GenerateCustomerOptions {
  goodsAmount?: {
    min: number;
    max: number;
  };
}

const generateCustomer = (
  previousCustomerArrivalTime: number,
  options?: GenerateCustomerOptions,
): Customer => {
  const { goodsAmount } = options || {};
  return {
    id: faker.string.uuid(),
    gender: faker.person.sexType(),
    goodsAmount: faker.number.int({
      min: goodsAmount?.min || 1,
      max: goodsAmount?.max || 20,
    }),
    arrivalTime:
      previousCustomerArrivalTime + faker.number.int({ min: 0, max: 60 }),
    priority: 0,
  };
};

export const generateCustomers = (
  amount = 1,
  options?: GenerateCustomerOptions,
): Customer[] => {
  faker.seed(1);
  let previousCustomerArrivalTime = 0;

  return Array.from({ length: amount }, () => {
    const customer = generateCustomer(previousCustomerArrivalTime, options);
    previousCustomerArrivalTime = customer.arrivalTime;
    return customer;
  });
};
