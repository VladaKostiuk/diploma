export type Gender = 'male' | 'female';

export type Customer = {
  id: string;
  gender: Gender;
  goodsAmount: number;
  arrivalTime: number;
  priority: number;
};

export type CustomerInQueue = Customer & {
  serviceStartTime: number;
  serviceEndTime: number;
};

export type CashDeskFilters = {
  goodsLimitation?: number;
  processingTimePerGoodItem: number;
};
