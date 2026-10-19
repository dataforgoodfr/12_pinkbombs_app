import { act, render } from "@testing-library/react";
import { type ComponentProps, createElement } from "react";

import Navbar from "../Navbar";

let mockPathname = "/to-be-inspired";

jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
jest.mock("next/navigation", () => ({ useParams: () => ({}) }));
jest.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));
jest.mock("@/navigation", () => ({
  locales: ["en", "fr"],
  usePathname: () => mockPathname,
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

describe("homepage navigation theme", () => {
  let markerTop: number;
  let notifyFrame: FrameRequestCallback;

  beforeEach(() => {
    mockPathname = "/";
    markerTop = 800;
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return {
          top: this.hasAttribute("data-home-explode") ? markerTop : 0,
          bottom: 82,
          height: 82,
        } as DOMRect;
      });
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        notifyFrame = callback;
        return 1;
      });
    globalThis.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));
  });

  const originalObserver = globalThis.ResizeObserver;

  afterEach(() => {
    mockPathname = "/to-be-inspired";
    globalThis.ResizeObserver = originalObserver;
    jest.restoreAllMocks();
  });

  it("switches theme only when the blue panel reaches the header and reverses on scroll up", () => {
    const { container, unmount } = render(
      <>
        <Navbar />
        <section data-home-explode />
      </>,
    );
    const header = container.querySelector("header");
    expect(header).toHaveClass("bg-v2-pink");

    act(() => {
      markerTop = 82;
      window.dispatchEvent(new Event("scroll"));
      notifyFrame(0);
    });
    expect(header).toHaveClass("bg-v2-blue");
    expect(
      document.documentElement.style.getPropertyValue(
        "--homepage-top-background",
      ),
    ).toBe("#13176E");

    act(() => {
      markerTop = 600;
      window.dispatchEvent(new Event("scroll"));
      notifyFrame(0);
    });
    expect(header).toHaveClass("bg-v2-pink");
    unmount();
    expect(
      document.documentElement.style.getPropertyValue(
        "--homepage-top-background",
      ),
    ).toBe("");
  });

  it("initializes on restored scroll and removes the override when leaving home", () => {
    markerTop = -400;
    const { container, rerender, unmount } = render(
      <>
        <Navbar />
        <section data-home-explode />
      </>,
    );
    expect(container.querySelector("header")).toHaveClass("bg-v2-blue");
    mockPathname = "/about";
    rerender(
      <>
        <Navbar />
        <section data-home-explode />
      </>,
    );
    expect(container.querySelector("header")).toHaveClass("bg-v2-pink");
    expect(
      document.documentElement.style.getPropertyValue(
        "--homepage-top-background",
      ),
    ).toBe("");
    unmount();
  });
});
