import { act, render } from "@testing-library/react";
import { type ComponentProps, createElement } from "react";

import Navbar from "../Navbar";

jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
jest.mock("next/navigation", () => ({ useParams: () => ({}) }));
jest.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));
jest.mock("@/navigation", () => ({
  locales: ["en", "fr"],
  usePathname: () => "/to-be-inspired",
  Link: ({ children, href }: ComponentProps<"a">) =>
    createElement("a", { href }, children),
}));

it("publishes navbar height on mount and resize, then cleans up", () => {
  const originalObserver = globalThis.ResizeObserver;
  const observe = jest.fn();
  const disconnect = jest.fn();
  let notifyResize = () => {};
  globalThis.ResizeObserver = jest.fn((callback: ResizeObserverCallback) => {
    notifyResize = () => callback([], {} as ResizeObserver);
    return { observe, disconnect, unobserve: jest.fn() };
  });
  const measure = jest
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue({ height: 82 } as DOMRect);

  const { unmount } = render(<Navbar />);
  const navbarHeight = () =>
    document.documentElement.style.getPropertyValue("--site-navbar-height");

  try {
    expect(observe).toHaveBeenCalledWith(document.querySelector("header"));
    expect(navbarHeight()).toBe("82px");

    measure.mockReturnValue({ height: 108 } as DOMRect);
    act(() => notifyResize());
    expect(navbarHeight()).toBe("108px");

    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(navbarHeight()).toBe("");
  } finally {
    unmount();
    measure.mockRestore();
    globalThis.ResizeObserver = originalObserver;
  }
});
