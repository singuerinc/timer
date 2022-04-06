import { IconMaximize } from "@tabler/icons";
import { useMachine, useSelector } from "@xstate/react";
import { addMilliseconds, addMinutes, format } from "date-fns";
import * as React from "react";
import { useCallback } from "react";
import { assign, createMachine } from "xstate";

const MIN_0 = 0;
const MIN_5 = 5 * 60 * 1000;
const MIN_25 = 25 * 60 * 1000;

export const timerMachine = createMachine(
  {
    initial: "idle",
    context: {
      totalTime: MIN_0,
      accumulated: new Date(),
    },
    on: {
      ADD_5: {
        actions: ["add5"],
      },
      ADD_25: {
        actions: ["add25"],
      },
    },
    states: {
      idle: {
        entry: ["reset"],
        on: {
          FORWARD: [
            {
              cond: (ctx: any) => ctx.totalTime > 0,
              target: "running",
            },
          ],
        },
      },
      running: {
        entry: ["update"],
        invoke: {
          src: "tick",
        },
        on: {
          FORWARD: "idle",
          TICK: [
            {
              cond: (ctx: any) => ctx.accumulated > 0,
              actions: ["update"],
            },
            {
              target: "idle",
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      add5: assign({
        totalTime: (ctx) => ctx.totalTime + MIN_5,
        accumulated: (ctx) => addMinutes(ctx.accumulated, 5),
      }),
      add25: assign({
        totalTime: (ctx) => ctx.totalTime + MIN_25,
        accumulated: (ctx) => addMinutes(ctx.accumulated, 25),
      }),
      reset: assign({
        accumulated: (_) => new Date(MIN_0),
        totalTime: (_) => MIN_0,
      }),
      update: assign({
        accumulated: (ctx) => addMilliseconds(ctx.accumulated, -500),
      }),
    },
    services: {
      tick: () => (callback) => {
        const id = setInterval(() => {
          callback("TICK");
        }, 500);

        return () => clearInterval(id);
      },
    },
  }
);

function App() {
  const [, send, service] = useMachine(timerMachine);
  const accumulated = useSelector(
    service,
    (state) => state.context.accumulated
  );
  const forward = useCallback(() => send("FORWARD"), [send]);
  const add5 = useCallback(() => send("ADD_5"), [send]);

  return (
    <div className="flex w-full select-none flex-col items-center justify-center">
      <div
        className="flex text-8xl font-bold tabular-nums sm:text-[12rem]"
        onClick={forward}
      >
        {format(accumulated, "mm:ss")}
      </div>
      <div className="absolute bottom-0 left-0 flex text-2xl opacity-50">
        <button className="p-6 font-light" onClick={add5}>
          +5
        </button>
      </div>
    </div>
  );
}

export default App;
