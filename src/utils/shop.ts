import _ from 'lodash';
import { Customer } from 'types/global';

import { CashDesk } from './cashDesk';

export class Shop {
  cashDesks: Record<string, CashDesk> = {};

  constructor({ cashDesksAmount }: { cashDesksAmount: number }) {
    this.initializeShop(cashDesksAmount);
  }

  initializeShop = (cashDesksAmount: number) => {
    [...Array(cashDesksAmount).keys()].forEach(() => {
      this.openCashDesk();
    });
  };

  openCashDesk = (filters = { processingTimePerGoodItem: 1 }) => {
    const cashDesk = new CashDesk({ filters });
    this.cashDesks[cashDesk.id] = cashDesk;
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
    this.applyToAllCashDesks((cashDesk) => {
      cashDesk.resetCashDesk();
    });
  };

  // enqueue = (customers: Customer[]) => {
  //   this.applyToAllCashDesks((cashDesk) => {
  //     cashDesk.enqueue(customers);
  //   });
  // };

  findShortestWaitingTimeCashDesk = (cashDesks: CashDesk[]) => {
    return _(cashDesks)
      .groupBy('servingTime')
      .map((group) => _.minBy(group, 'servingTime'))
      .value();
  };

  updateShop = (time: number, customers?: Customer[]) => {
    if (!customers || customers.length === 0) {
      return this.applyToAllCashDesks((cashDesk, index) => {
        cashDesk.updateCashDesk(time, index);
      });
    }

    customers?.forEach((customer) => {
      const updatedCashDesks = this.applyToAllCashDesks((cashDesk, index) => {
        return cashDesk.updateCashDesk(time, index);
      });
      const shortestWaitingTimeCashDesk =
        this.findShortestWaitingTimeCashDesk(updatedCashDesks);

      console.log(updatedCashDesks);
      shortestWaitingTimeCashDesk[0]?.enqueue(time, customer);
    });

    // if (!customers || customers.length === 0) {
    //   this.applyToAllCashDesks((cashDesk, index) => {
    //     return cashDesk.updateCashDesk(time, index);
    //   });
    // } else {
    //   customers?.forEach((customer) => {
    //     const updatedCashDesks = this.applyToAllCashDesks((cashDesk, index) => {
    //       return cashDesk.updateCashDesk(time, index);
    //     });
    //     const shortestWaitingTimeCashDesk =
    //       this.findShortestWaitingTimeCashDesk(updatedCashDesks);
    //     // console.log(shortestWaitingTimeCashDesk);
    //     shortestWaitingTimeCashDesk[0]?.enqueue(customer);
    //   });
    // }
  };
}
