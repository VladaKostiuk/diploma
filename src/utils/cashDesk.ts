import { CashDeskFilters, Customer, CustomerInQueue } from 'types/global';
import { v4 as uuidv4 } from 'uuid';

export class CashDesk {
  id: string = uuidv4();
  queue: Customer[] = [];
  // unservedCustomers: Customer[] = [];
  servicedCustomers: CustomerInQueue[] = [];
  activeCustomer: CustomerInQueue | null = null;

  queueServingTime = 0;
  activeCustomerServingTime = 0;
  servingTime = 0;

  filters: CashDeskFilters;

  constructor(filters: CashDeskFilters) {
    this.filters = filters;
  }

  calculateCustomerServingTime = (customerGoodsAmount: number) => {
    return customerGoodsAmount * this.filters?.processingTimePerGoodItem;
  };

  resetCashDesk() {
    this.queue = [];
    this.servicedCustomers = [];
    this.activeCustomer = null;

    this.queueServingTime = 0;
    this.activeCustomerServingTime = 0;
    this.servingTime = 0;
  }

  openCashDesk = () => {
    this.filters.open = true;
    return this;
  };

  closeCashDesk = () => {
    this.filters.open = false;
    return this;
  };

  enqueue(time: number, customer: Customer) {
    const updatedQueue = [...this.queue, customer];
    const customerServingTime = this.calculateCustomerServingTime(
      customer.goodsAmount,
    );

    this.queueServingTime = this.queueServingTime + customerServingTime;
    this.queue = updatedQueue;
    this.updateCashDesk(time);
    return updatedQueue;
  }

  dequeue() {
    const [dequeuedCustomer, ...restQueue] = this.queue;
    const customerServingTime = this.calculateCustomerServingTime(
      dequeuedCustomer.goodsAmount,
    );

    this.queueServingTime = this.queueServingTime - customerServingTime;
    this.queue = restQueue;
    return dequeuedCustomer;
  }

  private serviceActiveCustomer = (
    time: number,
    activeCustomer: CustomerInQueue,
  ) => {
    if (activeCustomer.serviceEndTime === time) {
      this.servicedCustomers = [...this.servicedCustomers, activeCustomer];
      this.activeCustomer = null;
    }

    this.activeCustomerServingTime = activeCustomer.serviceEndTime - time;
    return this.activeCustomer;
  };

  private serviceCustomers(time: number) {
    if (this.activeCustomer) {
      const activeCustomer = this.serviceActiveCustomer(
        time,
        this.activeCustomer,
      );
      if (!activeCustomer) {
        this.updateCashDesk(time);
      }
      return;
    }

    const cashDeskAvailable = !this.activeCustomer;

    if (cashDeskAvailable && this.queue.length > 0) {
      const dequeuedCustomer = this.dequeue();
      const newActiveCustomer = {
        ...dequeuedCustomer,
        serviceStartTime: time,
        serviceEndTime:
          time +
          this.calculateCustomerServingTime(dequeuedCustomer.goodsAmount),
      };

      this.activeCustomer = newActiveCustomer;
      this.updateCashDesk(time);
      return this.activeCustomer;
    }
  }

  updateCashDesk = (time: number) => {
    this.serviceCustomers(time);
    this.servingTime = this.queueServingTime + this.activeCustomerServingTime;
    return this;
  };
}
