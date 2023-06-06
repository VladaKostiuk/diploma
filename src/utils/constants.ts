import { CashDeskFilters } from 'types/global';

export enum Priorities {}

export enum Stores {
  Customers = 'customers',
}

export enum CustomerMarkerStatus {
  IN_QUEUE = 'in_queue',
  IN_SERVICE = 'in_service',
  SERVICED = 'serviced',
}

export const initialCashDeskFilters: CashDeskFilters = {
  open: false,
  processingTimePerGoodItem: 1,
};
