import { CashDeskFilters, Customer } from 'types/global';

export class CashDesk {
  queue: Customer[] = [];
  filters: CashDeskFilters = {
    processingTimePerGoodItem: undefined,
    goodsLimitation: undefined,
  };
  open = false;

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
}
