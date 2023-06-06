/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import { Customer, ShopFilters } from 'types/global';

import { CashDesk } from './cashDesk';

export class Shop {
  cashDesks: Record<string, CashDesk> = {};
  unservedCustomers: Customer[] = [];
  shopFilters: ShopFilters | undefined;
  time = 0;

  constructor(filters: ShopFilters) {
    this.initializeShop(filters);
  }

  initializeShop = (filters: ShopFilters) => {
    this.shopFilters = filters;
    [...Array(filters.totalCashDesks).keys()].forEach(() => {
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

  updateUnservedCustomers = (customers: Customer[]) => {
    this.unservedCustomers = [...this.unservedCustomers, ...customers];
    return this.unservedCustomers;
  };

  updateCashDesks = () => {
    return this.applyToAllCashDesks((cashDesk, index) => {
      const updatedCashDesk = cashDesk.updateCashDesk(this.time);
      const { unservedCustomers: cashDeskUnservedCustomers } =
        updatedCashDesk || {};

      if (cashDeskUnservedCustomers) {
        this.updateUnservedCustomers(cashDeskUnservedCustomers);
        updatedCashDesk.resetUnservedCustomers();
      }

      if (!updatedCashDesk.open) {
        return null;
      }

      return updatedCashDesk;
    });
  };

  updateShop = (time: number, customers: Customer[]) => {
    this.time = time;
    this.updateUnservedCustomers(customers);

    if (this.unservedCustomers.length === 0) {
      this.updateCashDesks();
      return this;
    }

    while (this.unservedCustomers.length !== 0) {
      const updatedCashDesks = this.updateCashDesks();
      const shortestWaitingTimeCashDesk =
        this.sortCashDesksByShortestWaitingTime(updatedCashDesks)[0];

      if (!shortestWaitingTimeCashDesk) {
        return this;
      }

      const unservedCustomer = this.dequeueUnservedCustomer();
      shortestWaitingTimeCashDesk?.enqueue(this.time, unservedCustomer);
    }

    return this;
  };
}
