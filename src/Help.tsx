import { IconX } from "@tabler/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Help() {
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed right-0 top-4 z-10 text-2xl md:top-auto md:bottom-0">
        <button
          type="button"
          title="Add 5"
          className="mr-4 mb-4 rounded-md p-4 transition-all hover:bg-black/10 hover:text-gray-600 active:scale-90 dark:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-600"
          onClick={() => navigate("/")}
        >
          <IconX />
        </button>
      </div>
      <div className="absolute flex h-full w-full bg-white/95 p-6 backdrop-blur-xl dark:bg-black/95">
        <div className="h-fit sm:p-12">
          <h1 className="mb-12 text-2xl">Timer — Help</h1>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div>Tap</div>
            <div>Start the timer</div>
            <div>Tap</div>
            <div>Pause the timer</div>
            <div>
              Press and hold
              <br />
              <small>for 1 second</small>
            </div>
            <div>Stop the timer</div>
          </div>
          <h2 className="my-12 text-xl">Keyboard</h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div>
              <kbd className="rounded-sm border bg-gray-100 px-1 py-0.5 dark:border-gray-800 dark:bg-gray-900">
                Enter
              </kbd>{" "}
              /{" "}
              <kbd className="rounded-sm border bg-gray-100 px-1 py-0.5 dark:border-gray-800 dark:bg-gray-900">
                Space
              </kbd>
            </div>
            <div>Start the timer</div>
            <div>
              <kbd className="rounded-sm border bg-gray-100 px-1 py-0.5 dark:border-gray-800 dark:bg-gray-900">
                Esc
              </kbd>{" "}
              /{" "}
              <kbd className="rounded-sm border bg-gray-100 px-1 py-0.5 dark:border-gray-800 dark:bg-gray-900">
                0
              </kbd>
            </div>
            <div>Stop the timer</div>
            <div>
              <kbd className="rounded-sm border bg-gray-100 px-1 py-0.5 dark:border-gray-800 dark:bg-gray-900">
                +
              </kbd>{" "}
              /{" "}
              <kbd className="rounded-sm border bg-gray-100 px-1 py-0.5 dark:border-gray-800 dark:bg-gray-900">
                1
              </kbd>
            </div>
            <div>Add one minute</div>
            <div>
              <kbd className="rounded-sm border bg-gray-100 px-1 py-0.5 dark:border-gray-800 dark:bg-gray-900">
                -
              </kbd>
            </div>
            <div>Remove one minute</div>
            <div>
              <kbd className="rounded-sm border bg-gray-100 px-1 py-0.5 dark:border-gray-800 dark:bg-gray-900">
                5
              </kbd>
            </div>
            <div>Add five minutes</div>
          </div>
          <div className="mt-12 flex flex-col gap-3">
            <a
              className="text-gray-400 transition-all hover:text-gray-600 hover:underline active:scale-90 dark:hover:text-gray-600"
              href="https://www.buymeacoffee.com/singuerinc"
              target="_blank"
              rel="noreferrer"
              title="Buy me a coffee"
            >
              Buy me a coffee is you find Timer useful, thanks!
            </a>
            <a
              className="text-gray-400 transition-all hover:text-gray-600 hover:underline active:scale-90 dark:hover:text-gray-600"
              href="https://github.com/singuerinc/timer"
              target="_blank"
              rel="noreferrer"
              title="Source"
            >
              Source
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
