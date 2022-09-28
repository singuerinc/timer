import { Command } from "cmdk";
import React, { useCallback, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { useTimer } from "./useTimer";

export const CommandMenu = ({
  timer,
  navigate,
}: {
  timer: ReturnType<typeof useTimer>;
  navigate: NavigateFunction;
}) => {
  const [open, setOpen] = React.useState(false);
  const { isRunning, start, pause, stop, add5, add1, with25 } = timer;
  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: any) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const fn = useCallback(
    (action: VoidFunction) => () => {
      action();
      setOpen(false);
    },
    []
  );

  const navigateHelp = useCallback(() => navigate("help"), [navigate]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-gray-50 shadow-2xl"
    >
      <Command.Input placeholder="Type a command or search" />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Quick">
          <Command.Item onSelect={fn(with25)}>Start with 25</Command.Item>
        </Command.Group>
        <Command.Group heading="Actions">
          {!isRunning && <Command.Item onSelect={fn(start)}>Start</Command.Item>}
          {isRunning && (
            <>
              <Command.Item onSelect={fn(pause)}>Pause</Command.Item>
              <Command.Item onSelect={fn(stop)}>Stop</Command.Item>
            </>
          )}
          <Command.Group heading="Timer">
            <Command.Item onSelect={fn(add1)}>Add 1</Command.Item>
            <Command.Item onSelect={fn(add5)}>Add 5</Command.Item>
          </Command.Group>
        </Command.Group>

        <Command.Item onSelect={fn(navigateHelp)}>Help</Command.Item>
      </Command.List>
    </Command.Dialog>
  );
};
