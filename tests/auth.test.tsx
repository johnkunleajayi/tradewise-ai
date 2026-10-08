// @vitest-environment jsdom
import { StrictMode } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "../src/App";
import { googleLoginUrl } from "../src/features/auth/api";

const user = {
  id: "test-user",
  name: "Ada Lovelace",
  email: "ada@example.com",
  avatar_url: "https://example.com/ada.png",
};
const response = (status: number, body: unknown = null) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => body,
});
const fetchMock = vi.fn();

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  localStorage.clear();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  fetchMock.mockReset();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("shows loading while checking the session and never flashes the dashboard", async () => {
  let resolve!: (value: unknown) => void;
  fetchMock.mockReturnValue(
    new Promise((r) => {
      resolve = r;
    }),
  );
  render(<App />);
  expect(
    screen.getByRole("heading", { name: "Getting things ready" }),
  ).toBeTruthy();
  expect(screen.queryByText(/Good to see you/)).toBeNull();
  await act(async () => resolve(response(401)));
  expect(
    await screen.findByRole("button", { name: "Continue with Google" }),
  ).toBeTruthy();
  expect(fetchMock.mock.calls[0][1].credentials).toBe("include");
});

test("signed-out screen supports both themes and builds the backend login URL", async () => {
  fetchMock.mockResolvedValue(response(401));
  render(<App />);
  await screen.findByRole("button", { name: "Continue with Google" });
  fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
  expect(document.documentElement.dataset.theme).toBe("light");
  fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
  expect(document.documentElement.dataset.theme).toBe("dark");
  const url = new URL(googleLoginUrl());
  expect(url.origin).toBe("http://localhost:8000");
  expect(url.pathname).toBe("/api/auth/google/login");
  expect(url.searchParams.get("return_to")).toBe(window.location.origin);
});

test("renders authenticated identity and falls back when the Google avatar fails", async () => {
  fetchMock.mockResolvedValue(response(200, user));
  const view = render(<App />);
  expect(
    await screen.findByRole("heading", { name: "Good to see you, Ada." }),
  ).toBeTruthy();
  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  const avatar = view.container.querySelector(
    'img[src="https://example.com/ada.png"]',
  );
  expect(avatar).toBeTruthy();
  expect(avatar?.getAttribute("referrerpolicy")).toBe("no-referrer");
  fireEvent.error(avatar!);
  expect(screen.getByText("AL")).toBeTruthy();
});

test("logout revokes the server session and removes the dashboard", async () => {
  fetchMock
    .mockResolvedValueOnce(response(200, user))
    .mockResolvedValueOnce(response(204));
  render(<App />);
  fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));
  await screen.findByRole("button", { name: "Continue with Google" });
  expect(screen.queryByText(/Good to see you/)).toBeNull();
  expect(fetchMock.mock.calls[1][0]).toBe(
    "http://localhost:8000/api/auth/logout",
  );
  expect(fetchMock.mock.calls[1][1]).toMatchObject({
    method: "POST",
    credentials: "include",
  });
});

test("logout failure preserves the signed-in state and allows retry", async () => {
  fetchMock
    .mockResolvedValueOnce(response(200, user))
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(response(204));
  render(<App />);
  fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));
  expect((await screen.findByRole("alert")).textContent).toContain(
    "Please try again",
  );
  expect(
    screen.getByRole("heading", { name: "Good to see you, Ada." }),
  ).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
  await screen.findByRole("button", { name: "Continue with Google" });
});

test("network errors show a recovery state and retry checks the session again", async () => {
  fetchMock
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(response(401));
  render(<App />);
  fireEvent.click(await screen.findByRole("button", { name: /Try again/ }));
  await screen.findByRole("button", { name: "Continue with Google" });
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test("an invalid backend response does not grant dashboard access", async () => {
  fetchMock.mockResolvedValue(response(200, { detail: "not a user" }));
  render(<App />);
  await screen.findByRole("button", { name: /Try again/ });
  expect(screen.queryByText(/Good to see you/)).toBeNull();
});

test("a returned OAuth error survives StrictMode and is removed from the address", async () => {
  window.history.replaceState(null, "", "/?auth_error=failed");
  fetchMock.mockResolvedValue(response(401));
  render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  expect((await screen.findByRole("alert")).textContent).toContain(
    "Google sign-in wasn’t completed",
  );
  expect(window.location.search).toBe("");
});

test("returning to the page rechecks expired sessions", async () => {
  fetchMock
    .mockResolvedValueOnce(response(200, user))
    .mockResolvedValueOnce(response(401));
  render(<App />);
  await screen.findByRole("button", { name: "Sign out" });
  fireEvent(window, new Event("pageshow"));
  await screen.findByRole("button", { name: "Continue with Google" });
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
});
