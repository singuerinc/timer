import { format } from "date-fns";
import React, { useCallback, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useTheme } from "./useTheme";
import { useTimer } from "./useTimer";

function App() {
  useTheme();

  const navigate = useNavigate();
  const match = useMatch("/help");

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

  const opt = { enabled: match === null };

  useHotkeys("esc", () => void stop(), opt);
  useHotkeys("space", () => void (isRunning ? pause() : start()), opt, [isRunning]);
  useHotkeys("1", () => void add1(), opt);
  useHotkeys("+", () => void add1(), opt);
  useHotkeys("=", () => void add1(), opt);
  useHotkeys("5", () => void add5(), opt);
  useHotkeys("-", () => void remove1(), opt);
  useHotkeys("_", () => void remove1(), opt);
  useHotkeys("h", () => void navigate("help"), opt);
  const time = format(accumulated, "mm:ss");

  useEffect(() => {
    document.title = time;
  }, [time]);

  return (
    <>
      {/* <CommandMenu timer={timer} navigate={navigate} /> */}
      <div className="flex h-full w-full select-none flex-col items-center justify-center gap-y-6 p-6 text-slate-900">
        {/* <Todo /> */}
        <div
          className="flex cursor-pointer flex-col items-center gap-y-2 tabular-nums transition-all"
          onClick={isRunning ? pause : start}
          onPointerDown={startIntent}
          onPointerUp={stopIntent}
        >
          <div className="text-4xl dark:text-slate-500">{time}</div>
          <div className="flex gap-x-2">
            <button
              type="button"
              title="Start with 5 minutes"
              className="-ml-1 rounded-md py-1 px-2 text-slate-400 transition-all hover:bg-slate-900/10 hover:text-slate-600 dark:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-300"
              onClick={startWith5}
            >
              5 min
            </button>
            <button
              type="button"
              title="Start with 25 minutes"
              className="-ml-1 rounded-md py-1 px-2 text-slate-400 transition-all hover:bg-slate-900/10 hover:text-slate-600 dark:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-300"
              onClick={startWith25}
            >
              25 min
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 text-xs text-slate-400">
        <kbd>h for help</kbd>
      </div>
      <Outlet />
    </>
  );
}

export default App;
