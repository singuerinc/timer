import { IconDice1, IconDice5, IconHelp } from "@tabler/icons";
import { format } from "date-fns";
import React, { useCallback, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CommandMenu } from "./CommandMenu";
import { useTheme } from "./useTheme";
import { useHotkeys } from "react-hotkeys-hook";
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

  const startWith10 = useCallback(() => {
    stop();
    [0, 1].forEach(() => add5());
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

  return (
    <>
      <CommandMenu timer={timer} navigate={navigate} />
      <div className="flex h-full w-full select-none flex-col items-center justify-center">
        <div
          className="flex cursor-pointer flex-col tabular-nums transition-all active:scale-95"
          onClick={isRunning ? pause : start}
          onPointerDown={startIntent}
          onPointerUp={stopIntent}
        >
          <div className="text-[24vw] font-bold">{format(accumulated, "mm:ss")}</div>
          <div className="flex justify-center">
            <button
              type="button"
              title="Start with 5 minutes"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-600"
              onClick={startWith5}
            >
              5 min
            </button>
            <button
              type="button"
              title="Start with 10 minutes"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-600"
              onClick={startWith10}
            >
              10 min
            </button>
            <button
              type="button"
              title="Start with 25 minutes"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-600"
              onClick={startWith25}
            >
              25 min
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 text-2xl">
          <div className="flex w-full">
            <button
              type="button"
              title="Add 1"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-600"
              onClick={add1}
            >
              <IconDice1 />
            </button>
            <button
              type="button"
              title="Add 5"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-600"
              onClick={add5}
            >
              <IconDice5 />
            </button>
            <button
              type="button"
              title="Help"
              className="mr-4 mb-4 rounded-md p-4 font-light text-gray-400 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-600"
              onClick={() => navigate("help")}
            >
              <IconHelp />
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default App;
