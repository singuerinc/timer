import { format } from "date-fns";
import React, { useCallback, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Outlet, useNavigate } from "react-router-dom";
import { CommandMenu } from "./CommandMenu";
import { useTheme } from "./useTheme";
import { useTimer } from "./useTimer";

function App() {
  useTheme();

  const navigate = useNavigate();

  const timer = useTimer();
  const { accumulated, isRunning, start, pause, stop, add5, add1, remove1 } = timer;
  const stopIntentRef = useRef<number>();

  const startIntent = useCallback(() => {
    stopIntentRef.current = setTimeout(stop, 1000);
  }, [stop]);

  const stopIntent = useCallback(() => {
    clearTimeout(stopIntentRef.current);
  }, []);

  const startWith5 = useCallback(() => {
    stop();
    add5();
    start();
  }, [add5, start, stop]);

  const startWith25 = useCallback(() => {
    stop();
    [0, 1, 2, 3, 4].forEach(() => add5());
    start();
  }, [add5, start, stop]);

  useHotkeys("esc", () => void stop());
  useHotkeys("0", () => void stop());
  useHotkeys("space", () => void start());
  useHotkeys("enter", () => void start());
  useHotkeys("1", () => void add1());
  useHotkeys("+", () => void add1());
  useHotkeys("=", () => void add1());
  useHotkeys("5", () => void add5());
  useHotkeys("-", () => void remove1());
  useHotkeys("_", () => void remove1());
  useHotkeys("h", () => void navigate("help"));
  const time = format(accumulated, "mm:ss");

  useEffect(() => {
    document.title = time;
  }, [time]);

  return (
    <>
      <CommandMenu timer={timer} navigate={navigate} />
      <div className="flex h-full w-full select-none flex-col items-start justify-end pb-6 pl-6">
        <div
          className="flex cursor-pointer flex-col items-start gap-y-2 tabular-nums transition-all active:scale-95"
          onClick={isRunning ? pause : start}
          onPointerDown={startIntent}
          onPointerUp={stopIntent}
        >
          <div className="text-4xl dark:text-gray-600">{time}</div>
          <div className="flex gap-x-2">
            <button
              type="button"
              title="Start with 5 minutes"
              className="-ml-1 rounded-md py-1 px-2 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
              onClick={startWith5}
            >
              5 min
            </button>
            <button
              type="button"
              title="Start with 25 minutes"
              className="-ml-1 rounded-md py-1 px-2 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
              onClick={startWith25}
            >
              25 min
            </button>
          </div>
        </div>
        {/* <div className="absolute bottom-0 right-0 text-2xl">
          <div className="flex w-full">
            <button
              type="button"
              title="Add 1"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
              onClick={add1}
            >
              <IconDice1 />
            </button>
            <button
              type="button"
              title="Add 5"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
              onClick={add5}
            >
              <IconDice5 />
            </button>
            <button
              type="button"
              title="Help"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
              onClick={() => navigate("help")}
            >
              <IconHelp />
            </button>
          </div>
        </div> */}
      </div>
      <Outlet />
    </>
  );
}

export default App;
