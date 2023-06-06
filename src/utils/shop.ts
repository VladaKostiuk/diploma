/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import { Customer } from 'types/global';

import { CashDesk } from './cashDesk';

export class Shop {
  cashDesks: Record<string, CashDesk> = {};
  unservedCustomers: Customer[] = [];
  time = 0;

  constructor({ cashDesksAmount }: { cashDesksAmount: number }) {
    this.initializeShop(cashDesksAmount);
  }

  initializeShop = (cashDesksAmount: number) => {
    [...Array(cashDesksAmount).keys()].forEach(() => {
      this.addCashDesk();
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

  addCashDesk = (filters = { processingTimePerGoodItem: 1 }) => {
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

  openCashDesk = (cashDeskId: string) => {
    const cashDesk = this.cashDesks[cashDeskId];
    if (cashDesk) {
      cashDesk.open = true;
    }
    return this.getCashDesks();
  };

  closeCashDesk = (cashDeskId: string) => {
    const cashDesk = this.cashDesks[cashDeskId];
    if (cashDesk) {
      cashDesk.openCashDesk();
    }
  };

  getCashDesks = () => {
    return Object.values(this.cashDesks);
  };

  resetShop = () => {
    this.unservedCustomers = [];
    this.time = 0;
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

  updateCashDesks = () => {
    return this.applyToAllCashDesks((cashDesk, index) => {
      const updatedCashDesk = cashDesk.updateCashDesk(this.time);
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
    this.time = time;
    const unservedCustomers = this.updateUnservedCustomers(customers);

    if (!unservedCustomers || unservedCustomers.length === 0) {
      this.updateCashDesks();
      return this;
    }

    unservedCustomers?.forEach((customer) => {
      const updatedCashDesks = this.updateCashDesks();
      const shortestWaitingTimeCashDesk =
        this.sortCashDesksByShortestWaitingTime(updatedCashDesks)[0];
      console.log(shortestWaitingTimeCashDesk);

      if (shortestWaitingTimeCashDesk) {
        const unservedCustomer = this.dequeueUnservedCustomer();
        shortestWaitingTimeCashDesk?.enqueue(time, unservedCustomer);
      }
    });
    return this;
  };
}
