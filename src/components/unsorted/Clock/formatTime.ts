const leadingZero = (num: number) => `0${num}`.slice(-2);

export const formatTime = (date: Date) =>
  [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()]
    .map(leadingZero)
    .join(':');
