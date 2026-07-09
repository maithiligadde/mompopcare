import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { getNextLocalMidnight } from "../domain/date";

export function useLocalDayNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout> | undefined;

    function scheduleNextLocalMidnight(current: Date) {
      if (midnightTimer !== undefined) {
        clearTimeout(midnightTimer);
      }

      const delay = getNextLocalMidnight(current).getTime() - current.getTime();
      midnightTimer = setTimeout(refreshNow, delay);
    }

    function refreshNow() {
      const current = new Date();
      setNow(current);
      scheduleNextLocalMidnight(current);
    }

    scheduleNextLocalMidnight(new Date());

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        refreshNow();
      }
    });

    return () => {
      if (midnightTimer !== undefined) {
        clearTimeout(midnightTimer);
      }
      subscription.remove();
    };
  }, []);

  return now;
}
