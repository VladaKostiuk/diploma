import { CashDeskFilters, Customer, CustomerInQueue } from 'types/global';
import { v4 as uuidv4 } from 'uuid';

export class CashDesk {
  id: string = uuidv4();
  queue: Customer[] = [];
  servicedCustomers: CustomerInQueue[] = [];
  activeCustomer: CustomerInQueue | null = null;
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
    this.activeCustomer = null;
    this.servingTime = 0;
  }

  openCashDesk = () => {
    this.open = true;
    return this.open;
  };

  closeCashDesk = () => {
    this.open = false;
    return this.open;
  };

  enqueue(time: number, customer: Customer) {
    const updatedQueue = [...this.queue, customer];
    const customerServingTime = this.calculateCustomerServingTime(
      customer.goodsAmount,
    );

    this.servingTime = this.servingTime + customerServingTime;
    this.queue = updatedQueue;
    this.serviceCustomer(time);
    return updatedQueue;
  }

  dequeue() {
    const [dequeuedCustomer, ...restQueue] = this.queue;
    const customerServingTime = this.calculateCustomerServingTime(
      dequeuedCustomer.goodsAmount,
    );

    this.servingTime = this.servingTime - customerServingTime;
    this.queue = restQueue;
    return dequeuedCustomer;
  }

  checkCashDeskAvailability() {
    return !this.activeCustomer;

    // if (this.activeCustomer.serviceEndTime === time) {
    //   this.servicedCustomers = [...this.servicedCustomers, this.activeCustomer];
    //   this.activeCustomer = null;
    //   this.free = true;
    //   return true;
    // }
  }

  serviceCustomer(time: number) {
    const cashDeskAvailable = this.checkCashDeskAvailability();

    if (cashDeskAvailable && this.queue.length > 0) {
      const dequeuedCustomer = this.dequeue();
      const activeCustomer = {
        ...dequeuedCustomer,
        serviceStartTime: time,
        serviceEndTime:
          time +
          this.calculateCustomerServingTime(dequeuedCustomer.goodsAmount),
      };

      this.activeCustomer = activeCustomer;
      this.servingTime =
        this.servingTime + activeCustomer.serviceEndTime - time;

      return activeCustomer;
    }

    if (this.activeCustomer?.serviceEndTime === time) {
      this.servicedCustomers = [...this.servicedCustomers, this.activeCustomer];
      this.activeCustomer = null;
      return this.activeCustomer;
    }
  }

  updateCashDesk = (time: number, cdIndex: number) => {
    if (!this.open) {
      return null;
    }
    // const cashDeskIsFree = this.checkCashDeskAvailability(time);
    // if (cashDeskIsFree) {

    if (this.activeCustomer) {
      console.log(this.servingTime - 1);
      this.servingTime = this.servingTime - 1;
    }

    this.serviceCustomer(time);
    return this;
  };
}
