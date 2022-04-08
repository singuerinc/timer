import { IconDice1, IconDice5 } from "@tabler/icons";
import { useMachine, useSelector } from "@xstate/react";
import { addMilliseconds, differenceInMilliseconds, format } from "date-fns";
import MouseTrap from "mousetrap";
import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import { assign, createMachine, State } from "xstate";
import Tone from "./static_tone.mp3";

const MIN_0 = 0;
const MIN_1 = 60 * 1000;
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

type RemoveEvent = {
  type: "REMOVE";
  amount: number;
};

type Events = AddEvent | RemoveEvent | { type: "START" } | { type: "STOP" } | { type: "TICK" };

export const timerMachine = createMachine<Context, Events>(
  {
    initial: "idle",
    context: {
      totalTime: MIN_0,
      startAt: new Date(0),
      endAt: new Date(0),
      accumulated: new Date(0),
    },
    on: {
      ADD: [
        {
          cond: "totalIsLessThanAnHour",
          actions: ["add"],
        },
      ],
      REMOVE: [
        {
          cond: "afterRemovalTotalIsMoreThanZero",
          actions: ["remove"],
        },
      ],
    },
    states: {
      idle: {
        entry: ["zero"],
        on: {
          START: [
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
          STOP: "idle",
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
      totalIsLessThanAnHour: (ctx, event) => ctx.totalTime + (event as AddEvent).amount < AN_HOUR,
      afterRemovalTotalIsMoreThanZero: (ctx, event) =>
        ctx.totalTime - (event as RemoveEvent).amount > 0,
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
        totalTime: (ctx, event) => ctx.totalTime + (event as AddEvent).amount,
        accumulated: (ctx, event) => addMilliseconds(ctx.accumulated, (event as AddEvent).amount),
        endAt: (ctx, event) => addMilliseconds(ctx.endAt, (event as AddEvent).amount),
      }),
      remove: assign({
        totalTime: (ctx, event) => ctx.totalTime - (event as AddEvent).amount,
        accumulated: (ctx, event) => addMilliseconds(ctx.accumulated, -(event as AddEvent).amount),
        endAt: (ctx, event) => addMilliseconds(ctx.endAt, -(event as AddEvent).amount),
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
        endAt: (ctx) => addMilliseconds(new Date(), ctx.totalTime + 500),
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

        callback("TICK");

        return () => clearInterval(id);
      },
    },
  }
);

function App() {
  const [, send, service] = useMachine(timerMachine);
  const accumulated = useSelector(service, (state: State<Context>) => state.context.accumulated);
  const isRunning = useSelector(service, (state: State<Context>) => state.matches("running"));
  const start = useCallback(() => send("START"), [send]);
  const stop = useCallback(() => send("STOP"), [send]);
  const add5 = useCallback(() => send({ type: "ADD", amount: MIN_5 }), [send]);
  const add1 = useCallback(() => send({ type: "ADD", amount: MIN_1 }), [send]);
  const remove1 = useCallback(() => send({ type: "REMOVE", amount: MIN_1 }), [send]);
  const stopIntentRef = useRef<number>();
  const startIntent = useCallback(() => {
    stopIntentRef.current = setTimeout(() => {
      stop();
    }, 1000);
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
    <div className="flex w-full select-none flex-col items-center justify-center">
      {isRunning ? (
        <div
          className="flex flex-col tabular-nums text-black transition-all active:scale-95"
          onMouseDown={startIntent}
          onMouseUp={stopIntent}
        >
          <div className="text-[24vw] font-bold">{format(accumulated, "mm:ss")}</div>
        </div>
      ) : (
        <div
          className="flex flex-col tabular-nums text-black transition-all active:scale-95"
          onClick={start}
        >
          <div className="text-[24vw] font-bold">{format(accumulated, "mm:ss")}</div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 flex w-full justify-end text-2xl opacity-50">
        <button
          type="button"
          title="Add 5"
          className="mr-4 mb-4 rounded-full p-4 font-light transition-all hover:bg-gray-200 active:scale-90"
          onClick={add1}
        >
          <IconDice1 />
        </button>
        <button
          type="button"
          title="Add 5"
          className="mr-4 mb-4 rounded-full p-4 font-light transition-all hover:bg-gray-200 active:scale-90"
          onClick={add5}
        >
          <IconDice5 />
        </button>
      </div>
    </div>
  );
}

export default App;
