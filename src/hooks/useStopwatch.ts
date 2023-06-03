import { useEffect, useState } from 'react';

export interface Stopwatch {
  time: number;
  active: boolean;
  startStopwatch: () => void;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
}

export const useStopwatch = (speed = 1): Stopwatch => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 1000 / speed);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const handleStartStopwatch = () => {
    setIsRunning(true);
  };

  const handlePauseStopwatch = () => {
    setIsRunning(false);
  };

  const handleResetStopWatch = () => {
    setTime(0);
    setIsRunning(false);
  };

  return {
    time,
    active: isRunning,
    startStopwatch: handleStartStopwatch,
    pauseStopwatch: handlePauseStopwatch,
    resetStopwatch: handleResetStopWatch,
  };
};
