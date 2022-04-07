import { IconPlus, IconRotateClockwise2 } from "@tabler/icons";
import { useMachine, useSelector } from "@xstate/react";
import { addMilliseconds, differenceInMilliseconds, format } from "date-fns";
import * as React from "react";
import { useCallback } from "react";
import { assign, createMachine, State } from "xstate";
import Tone from "./static_tone.mp3";

const MIN_0 = 0;
const MIN_5 = 5 * 60 * 1000;
const AN_HOUR = 60 * 60 * 1000;

type Context = {
  totalTime: number;
  startAt: Date;
  endAt: Date;
  accumulated: Date;
};

type AddEvent = {
  type: "ADD";
  amount: number;
};

type Events = AddEvent & { type: "FORWARD" } & { type: "TICK" };

export const timerMachine = createMachine<Context, any, Events>(
  {
    initial: "idle",
    context: {
      totalTime: MIN_0,
      startAt: new Date(0),
      endAt: new Date(0),
      accumulated: new Date(0),
    },
    on: {
      RESET: {
        target: "idle",
      },
      ADD: [
        {
          cond: "totalIsLessThanAnHour",
          actions: ["add"],
        },
      ],
    },
    states: {
      idle: {
        entry: ["zero"],
        on: {
          FORWARD: [
            {
              cond: "totalIsMoreThanZero",
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
              cond: "accumulatedIsMoreThanZero",
              actions: ["update"],
            },
            {
              actions: ["playTone"],
              target: "idle",
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      totalIsLessThanAnHour: (ctx, event) => ctx.totalTime + event.amount < AN_HOUR,
      totalIsMoreThanZero: (ctx) => ctx.totalTime > 0,
      accumulatedIsMoreThanZero: (ctx) => ctx.accumulated.getTime() > 999,
    },
    actions: {
      playTone: () => {
        const tone = new Audio();
        tone.src = Tone;
        tone.play();
      },
      add: assign({
        totalTime: (ctx, event) => ctx.totalTime + event.amount,
        accumulated: (ctx, event) => addMilliseconds(ctx.accumulated, event.amount),
        endAt: (ctx, event) => addMilliseconds(ctx.endAt, event.amount),
      }),
      zero: assign({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        startAt: (_) => new Date(0),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        endAt: (_) => new Date(0),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        accumulated: (_) => new Date(0),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        totalTime: (_) => 0,
      }),
      reset: assign({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        startAt: (_) => new Date(),
        endAt: (ctx) => addMilliseconds(new Date(), ctx.totalTime),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // accumulated: (ctx) => new Date(ctx.totalTime),
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
  const add5 = useCallback(() => send({ type: "ADD", amount: MIN_5 }), [send]);
  // const reset = useCallback(() => send({ type: "RESET" }), [send]);

  return (
    <div className="flex w-full select-none flex-col items-center justify-center">
      <div
        className="flex flex-col tabular-nums text-black transition-all active:scale-95"
        onClick={forward}
      >
        <div className="text-8xl font-bold sm:text-[12rem]">{format(accumulated, "mm:ss")}</div>
      </div>
      <div className="absolute bottom-0 left-0 flex w-full justify-between text-2xl opacity-50">
        <button
          title="Add 5"
          className="p-6 font-light transition-all active:scale-95"
          onClick={add5}
        >
          <IconPlus />
        </button>
        {/* <button title="Add 5" className="p-6 font-light" onClick={reset}>
          <IconRotateClockwise2 />
        </button> */}
      </div>
    </div>
  );
}

export default App;
