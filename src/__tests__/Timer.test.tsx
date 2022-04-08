import "@testing-library/jest-dom";
import React from "react";
import App from "../App";
import { Help } from "../Help";
import { renderWithRouter } from "../test-utils";

describe("main", () => {
  test("loads and displays the add 1 button", async () => {
    const { getByRole } = renderWithRouter(<App />);

    expect(getByRole("button", { name: /add 1/i })).toBeInTheDocument();
  });

  test("loads and displays the add 5 button", async () => {
    const { getByRole } = renderWithRouter(<App />);

    expect(getByRole("button", { name: /add 5/i })).toBeInTheDocument();
  });

  test("loads and displays the help button", async () => {
    const { getByRole } = renderWithRouter(<App />);

    expect(getByRole("button", { name: /help/i })).toBeInTheDocument();
  });

  test("loads and displays the timer", async () => {
    const { findByText } = renderWithRouter(<App />);
    const timer = await findByText("00:00");
    expect(timer).toBeInTheDocument();
  });
});

describe("help", () => {
  test("loads and displays the help title", async () => {
    const { findByText } = renderWithRouter(<Help />);
    const helpTitle = await findByText("Timer — Help");
    expect(helpTitle).toBeInTheDocument();
  });
});
