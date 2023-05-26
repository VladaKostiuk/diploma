import { CashDeskFilters, Customer, CustomerInQueue } from 'types/global';

export class CashDesk {
  queue: Customer[] = [];
  servicedCustomers: Customer[] = [];
  activeCustomer:
    | CustomerInQueue
    | null = null;

  filters: CashDeskFilters = {
    processingTimePerGoodItem: 1,
    goodsLimitation: undefined,
  };
  open = false;
  free = true;
  // free / if free => active customer (start/end time) / if (time = active customer end time) => free = true

  constructor({
    filters,
    open,
  }: {
    filters: Partial<CashDeskFilters> &
      Required<Pick<CashDeskFilters, 'processingTimePerGoodItem'>>;
    open: boolean;
  }) {
    this.filters = filters;
    this.open = open;
  }

  enqueue(customers: Customer[]) {
    this.queue = [...this.queue, ...customers];
  }

  dequeue() {
    const [dequeuedCustomer, ...restQueue] = this.queue;
    this.queue = restQueue;
    return dequeuedCustomer;
  }

  getQueue() {
    return this.queue;
  }

  resetQueue() {
    this.queue = [];
  }

  resetCashDesk() {
    this.queue = [];
    this.servicedCustomers = [];
    this.activeCustomer = null;
  }

  checkCashDeskAvailability(time: number) {
    if (this.free || !this.activeCustomer) {
      console.log('cash desk is free');
      return true;
    }
    if (this.activeCustomer.serviceEndTime === time) {
      this.servicedCustomers = [...this.servicedCustomers, this.activeCustomer];
      this.activeCustomer = null;
      this.free = true;
      console.log('CUSTOMER SERVICED. cash desk is free');
      return true;
    }
    console.log('cash desk is busy till', this.activeCustomer.serviceEndTime);
    return false;
  }

  serviceCustomer(time: number) {
    const cashDeskIsFree = this.checkCashDeskAvailability(time);
    if (cashDeskIsFree && this.queue.length > 0) {
      const customer = this.queue[0];
      const serviceEndTime =
        time + customer.goodsAmount * this.filters.processingTimePerGoodItem;

      this.free = false;
      this.dequeue();
      this.activeCustomer = {
        ...customer,
        serviceStartTime: time,
        serviceEndTime,
      };
      return [time, this.activeCustomer];
    }
    console.log(this.queue);
    return 'cant service now';
  }
}
