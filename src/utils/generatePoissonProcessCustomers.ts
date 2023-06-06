import { fakerUK as faker } from '@faker-js/faker';
import poissonProcess from 'poisson-process';
import { PoissonProcessCustomer } from 'types/global';

interface GeneratePoissonProcessCustomerOptions {
  goodsAmount?: {
    min?: number;
    max?: number;
  };
}

export const generatePoissonProcessCustomer = (
  goodsAmount?: GeneratePoissonProcessCustomerOptions['goodsAmount'],
): PoissonProcessCustomer => {
  return {
    id: faker.string.uuid(),
    gender: faker.person.sexType(),
    goodsAmount: faker.number.int({
      min: goodsAmount?.min || 1,
      max: goodsAmount?.max || 20,
    }),
    priority: 0,
  };
};

// export const generatePoissonProccessCustomers = (
//   options?: GeneratePoissonProcessCustomerOptions,
// ): PoissonProcessCustomer[] => {
//   const poisson = poissonProcess.create(15000, function message() {
//     console.log('A message arrived.');
//   });
// };
