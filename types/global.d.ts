export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

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

export type ShopFilters = {
  totalCashDesks: number;
  maximalServingTime: number;
  priorityInService: boolean;
}