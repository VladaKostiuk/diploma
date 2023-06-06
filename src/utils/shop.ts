/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import { Customer } from 'types/global';

import { CashDesk } from './cashDesk';

export class Shop {
  cashDesks: Record<string, CashDesk> = {};
  unservedCustomers: Customer[] = [];

  constructor({ cashDesksAmount }: { cashDesksAmount: number }) {
    this.initializeShop(cashDesksAmount);
  }

  initializeShop = (cashDesksAmount: number) => {
    [...Array(cashDesksAmount).keys()].forEach(() => {
      this.openCashDesk();
    });
  };

  enqueueUnservedCustomer = (customer: Customer) => {
    this.unservedCustomers = [...this.unservedCustomers, customer];
    return this.unservedCustomers;
  };

  dequeueUnservedCustomer = () => {
    const [dequeuedCustomer, ...restQueue] = this.unservedCustomers;
    this.unservedCustomers = restQueue;
    return dequeuedCustomer;
  };

  openCashDesk = (filters = { processingTimePerGoodItem: 1 }) => {
    const cashDesk = new CashDesk({ filters });
    this.cashDesks[cashDesk.id] = cashDesk;
    return this.getCashDesks();
  };

  applyToAllCashDesks = (
    callback: (cashDesk: CashDesk, index: number) => any,
  ) => {
    return this.getCashDesks().map((cashDesk, index) =>
      callback(cashDesk, index),
    );
  };

  getCashDesks = () => {
    return Object.values(this.cashDesks);
  };

  resetShop = () => {
    this.unservedCustomers = [];
    this.applyToAllCashDesks((cashDesk) => {
      cashDesk.resetCashDesk();
    });
  };

  sortCashDesksByShortestWaitingTime = (cashDesks: CashDesk[]) => {
    return _(cashDesks)
      .groupBy('servingTime')
      .map((group) => _.minBy(group, 'servingTime'))
      .value();
  };

  updateUnservedCustomers = (customers?: Customer[]) => {
    if (!customers) {
      return this.unservedCustomers;
    }
    customers.forEach((customer) => {
      if (!this.unservedCustomers.includes(customer)) {
        this.enqueueUnservedCustomer(customer);
      }
    });
    return this.unservedCustomers;
  };

  updateCashDesks = (time: number) => {
    return this.applyToAllCashDesks((cashDesk, index) => {
      const updatedCashDesk = cashDesk.updateCashDesk(time);
      const { unservedCustomers } = updatedCashDesk || {};

      if (unservedCustomers) {
        this.updateUnservedCustomers(unservedCustomers);
      }

      if (!updatedCashDesk.open) {
        return null;
      }

      return updatedCashDesk;
    });
  };

  updateShop = (time: number, customers?: Customer[]) => {
    const unservedCustomers = this.updateUnservedCustomers(customers);
    console.log(unservedCustomers);

    if (!unservedCustomers || unservedCustomers.length === 0) {
      const updatedCashDesks = this.updateCashDesks(time);
      // return { updatedCashDesks, unservedCustomers };
      return this;
    }

    unservedCustomers?.forEach((customer) => {
      const updatedCashDesks = this.updateCashDesks(time);
      const shortestWaitingTimeCashDesk =
        this.sortCashDesksByShortestWaitingTime(updatedCashDesks)[0];

      if (shortestWaitingTimeCashDesk) {
        const unservedCustomer = this.dequeueUnservedCustomer();
        shortestWaitingTimeCashDesk?.enqueue(time, unservedCustomer);
      }
    });
    return this;
  };
}
