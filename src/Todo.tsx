import { IconCheck, IconSquare } from "@tabler/icons";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";

type ITask = {
  type: "task";
  task: {
    completed: boolean;
    text: string;
  };
};

const toTask = (task: Record<string, string | boolean | number>): ITask => ({
  type: "task",
  task: { completed: false, text: "", ...task },
});
const loadTask = (id: string): ITask =>
  toTask(
    JSON.parse(
      localStorage.getItem(id) !== null ? String(localStorage.getItem(id)) : "{'task': '{}'}"
    ).task
  );

export function Todo() {
  const [task1, task2, task3] = [loadTask("task-1"), loadTask("task-2"), loadTask("task-3")];

  return (
    <ul className="flex w-96 flex-col gap-y-2">
      <li className="flex items-center gap-x-2">
        <CheckboxTask id={"task-1"} completed={task1.task.completed} text={task1.task.text} />
      </li>
      <li className="flex items-center gap-x-2">
        <CheckboxTask id={"task-2"} completed={task2.task.completed} text={task2.task.text} />
      </li>
      <li className="flex items-center gap-x-2">
        <CheckboxTask id={"task-3"} completed={task3.task.completed} text={task3.task.text} />
      </li>
    </ul>
  );
}

function CheckboxTask({
  id,
  text: initialText,
  completed: initialCompleted,
}: {
  id: string;
  text?: string;
  completed?: boolean;
}) {
  const [text, setText] = useState<string>(initialText ?? "");
  const [completed, setCompleted] = useState(initialCompleted ?? false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      id,
      JSON.stringify({
        id,
        type: "task",
        task: {
          completed,
          text,
        },
      })
    );
  }, [completed, id, text]);

  return (
    <>
      {completed ? (
        <IconCheck onClick={() => setCompleted(false)} className="text-gray-300" />
      ) : text ? (
        <IconSquare onClick={() => setCompleted(true)} className="text-gray-300" />
      ) : (
        <IconSquare className="text-gray-100" />
      )}
      <input
        value={text}
        type="text"
        className={`w-full px-2 py-1 ${
          completed ? "line-through" : ""
        } outline-0 focus:ring focus:ring-slate-200`}
        onChange={handleChange}
      />
    </>
  );
}
