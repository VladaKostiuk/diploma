export type Gender = 'male' | 'female';

export type Customer = {
  id: string;
  gender: Gender;
  goodsAmount: number;
  // пенс, інвалід віп
  arrivalTime: number;
  priority: number;
};
