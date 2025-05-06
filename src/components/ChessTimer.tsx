
import React, { useEffect, useState } from "react";

interface ChessTimerProps {
  time: number;
  active: boolean;
  color: 'white' | 'black';
  onTimeout: () => void;
}

const ChessTimer: React.FC<ChessTimerProps> = ({ time, active, color, onTimeout }) => {
  const [remainingTime, setRemainingTime] = useState(time);

  useEffect(() => {
    setRemainingTime(time);
  }, [time]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (active && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            onTimeout();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, remainingTime, onTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingTime < 60;

  return (
    <div className={`
      p-3 rounded-lg text-center
      ${active ? (color === 'white' ? 'bg-white text-black' : 'bg-black text-white') : 'bg-gray-200 dark:bg-gray-800'}
      ${isLowTime && active ? 'animate-pulse' : ''}
    `}>
      <p className="text-sm uppercase font-semibold">{color === 'white' ? 'White' : 'Black'}</p>
      <p className={`text-2xl font-mono ${isLowTime ? 'text-red-500' : ''}`}>
        {formatTime(remainingTime)}
      </p>
    </div>
  );
};

export default ChessTimer;
