import { useEffect, useState } from 'react';

export const useStopwatch = (speed = 1) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1 * speed), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const handleStartStopwatch = () => {
    setIsRunning(true);
  };

  const handleStopStopwatch = () => {
    setIsRunning(false);
  };

  const handleResetStopWatch = () => {
    setTime(0);
    setIsRunning(false);
  };

  return {
    time,
    startStopwatch: handleStartStopwatch,
    stopStopwatch: handleStopStopwatch,
    resetStopwatch: handleResetStopWatch,
  };
};
