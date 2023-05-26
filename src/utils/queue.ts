import { Customer } from 'types/global';

export class CustomerQueue {
  queue: Customer[] = [];

  enqueue(customers: Customer[]) {
    this.queue = [...this.queue, ...customers];
  }

  dequeue() {
    const [dequeuedCustomer, ...restQueue] = this.queue;
    this.queue = restQueue;
    return dequeuedCustomer;
  }

  toString() {
    return this.queue.toString();
  }

  // map(...args: Parameters<typeof Array.prototype.map>) {
  //   return this.queue.map(...args);
  // }
}
