import { useMachine, useSelector } from "@xstate/react";
import { addMilliseconds, addMinutes, differenceInMilliseconds, format } from "date-fns";
import * as React from "react";
import { useCallback } from "react";
import { assign, createMachine, State } from "xstate";

const MIN_0 = 0;
const MIN_5 = 5 * 60 * 1000;
const MIN_25 = 25 * 60 * 1000;

type Context = {
  totalTime: number;
  startAt: Date;
  endAt: Date;
  accumulated: Date;
};

export const timerMachine = createMachine<Context>(
  {
    initial: "idle",
    context: {
      totalTime: MIN_0,
      startAt: new Date(),
      endAt: new Date(),
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
        entry: ["zero"],
        on: {
          FORWARD: [
            {
              cond: (ctx: Context) => ctx.totalTime > 0,
              target: "running",
            },
          ],
        },
      },
      running: {
        entry: ["reset", "update"],
        invoke: {
          src: "tick",
        },
        on: {
          FORWARD: "idle",
          TICK: [
            {
              cond: (ctx: Context) => ctx.accumulated.getTime() > 0,
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
        accumulated: (ctx) => addMilliseconds(ctx.accumulated, MIN_5),
        endAt: (ctx) => addMilliseconds(ctx.endAt, MIN_5),
      }),
      add25: assign({
        totalTime: (ctx) => ctx.totalTime + MIN_25,
        accumulated: (ctx) => addMilliseconds(ctx.accumulated, MIN_25),
        endAt: (ctx) => addMilliseconds(ctx.endAt, MIN_25),
      }),
      zero: assign({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        startAt: (_) => new Date(0),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        endAt: (_) => new Date(0),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        accumulated: (_) => new Date(0),
      }),
      reset: assign({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        startAt: (_) => new Date(),
        endAt: (ctx) => addMilliseconds(new Date(), ctx.totalTime),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // accumulated: (_) => new Date(),
      }),
      update: assign({
        accumulated: (ctx) => {
          const now = new Date();
          const diff = differenceInMilliseconds(ctx.endAt, now);
          return addMilliseconds(new Date(0), diff);
        },
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
  const accumulated = useSelector(service, (state: State<Context>) => state.context.accumulated);
  const forward = useCallback(() => send("FORWARD"), [send]);
  const add5 = useCallback(() => send("ADD_5"), [send]);

  return (
    <div className="flex w-full select-none flex-col items-center justify-center">
      <div className="flex flex-col tabular-nums" onClick={forward}>
        <div className="text-8xl font-bold sm:text-[12rem]">{format(accumulated, "mm:ss")}</div>
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
