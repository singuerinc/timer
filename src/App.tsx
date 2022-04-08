import { IconDice1, IconDice5 } from "@tabler/icons";
import { format } from "date-fns";
import MouseTrap from "mousetrap";
import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "./useTheme";

import { useTimer } from "./useTimer";

function App() {
  useTheme();

  const { accumulated, start, stop, add5, add1, remove1 } = useTimer();
  const stopIntentRef = useRef<number>();

  const startIntent = useCallback(() => {
    stopIntentRef.current = setTimeout(stop, 1000);
  }, [stop]);

  const stopIntent = useCallback(() => {
    clearTimeout(stopIntentRef.current);
  }, []);

  useEffect(() => {
    MouseTrap.bind(["esc"], () => stop());
    MouseTrap.bind(["space", "enter"], () => start());
    MouseTrap.bind(["1", "+", "="], () => add1());
    MouseTrap.bind(["5"], () => add5());
    MouseTrap.bind(["-", "_"], () => remove1());
  }, [add1, add5, remove1, start, stop]);

  return (
    <div className="flex h-full w-full select-none flex-col items-center justify-center">
      <div
        className="flex cursor-pointer flex-col tabular-nums transition-all active:scale-95"
        onClick={start}
        onPointerDown={startIntent}
        onPointerUp={stopIntent}
      >
        <div className="text-[24vw] font-bold">{format(accumulated, "mm:ss")}</div>
      </div>
      <div className="absolute bottom-0 left-0 flex w-full justify-end text-2xl opacity-50">
        <button
          type="button"
          title="Add 1"
          className="mr-4 mb-4 rounded-full p-4 font-light text-gray-500 transition-all hover:bg-black/10 active:scale-90 dark:text-gray-600 dark:hover:bg-white/10"
          onClick={add1}
        >
          <IconDice1 />
        </button>
        <button
          type="button"
          title="Add 5"
          className="mr-4 mb-4 rounded-full p-4 font-light text-gray-500 transition-all hover:bg-black/10 active:scale-90 dark:text-gray-600 dark:hover:bg-white/10"
          onClick={add5}
        >
          <IconDice5 />
        </button>
      </div>
    </div>
  );
}

export default App;
