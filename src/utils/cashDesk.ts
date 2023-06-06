import { CashDeskFilters, Customer, CustomerInQueue } from 'types/global';
import { v4 as uuidv4 } from 'uuid';

export class CashDesk {
  id: string = uuidv4();
  queue: Customer[] = [];
  unservedCustomers: Customer[] = [];
  servicedCustomers: CustomerInQueue[] = [];
  activeCustomer: CustomerInQueue | null = null;

  queueServingTime = 0;
  activeCustomerServingTime = 0;
  servingTime = 0;

  open = true;

  filters: CashDeskFilters = {
    processingTimePerGoodItem: 1,
    goodsLimitation: undefined,
  };

  constructor({
    filters,
  }: {
    filters: Partial<CashDeskFilters> &
      Required<Pick<CashDeskFilters, 'processingTimePerGoodItem'>>;
  }) {
    this.filters = filters;
  }

  calculateCustomerServingTime = (customerGoodsAmount: number) => {
    return customerGoodsAmount * this.filters.processingTimePerGoodItem;
  };

  resetCashDesk() {
    this.queue = [];
    this.servicedCustomers = [];
    this.unservedCustomers = [];
    this.activeCustomer = null;

    this.queueServingTime = 0;
    this.activeCustomerServingTime = 0;
    this.servingTime = 0;
  }

  openCashDesk = () => {
    this.open = true;
    return this.open;
  };

  closeCashDesk = () => {
    this.open = false;
    this.unservedCustomers = this.queue;
    this.queue = [];
    this.queueServingTime = 0;
    return this.open;
  };

  enqueue(time: number, customer: Customer) {
    this.unservedCustomers = [];
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

  private checkCashDeskAvailability() {
    return !this.activeCustomer && this.open;
  }

  private serviceActiveCustomer = (
    time: number,
    activeCustomer: CustomerInQueue,
  ) => {
    if (activeCustomer.serviceEndTime === time) {
      this.servicedCustomers = [...this.servicedCustomers, activeCustomer];
      this.activeCustomer = null;
    }

    // console.log('sac', activeCustomer.serviceEndTime, time);
    this.activeCustomerServingTime = activeCustomer.serviceEndTime - time;
    return this.activeCustomer;
  };

  private serviceCustomer(time: number) {
    if (this.activeCustomer) {
      return this.serviceActiveCustomer(time, this.activeCustomer);
    }

    const cashDeskAvailable = this.checkCashDeskAvailability();

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
    this.serviceCustomer(time);
    console.log(this.queueServingTime, this.activeCustomerServingTime);
    this.servingTime = this.queueServingTime + this.activeCustomerServingTime;
    return this;
  };
}
