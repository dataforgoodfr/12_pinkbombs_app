import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import HomepageIntro, {
  getExplosionCenter,
  getIntroFrame,
  type IntroGeometry,
  scrollToIntroTarget,
} from "../HomepageIntro";

let mockReducedMotion = false;
let mockScrollValue: { set: (value: number) => void };

jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
    useScroll: () => {
      const scrollY = actual.useMotionValue(0);
      mockScrollValue = scrollY;
      return { scrollY };
    },
  };
});

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const geometry: IntroGeometry = {
  start: 82,
  height: 800,
  plate: { x: 820, y: 300 },
  explosion: { x: 930, y: 400 },
  fishWidth: 240,
};

describe("homepage intro trajectory", () => {
  it("keeps the desktop center aligned when full-height cover crops horizontally", () => {
    expect(
      getExplosionCenter(
        "bomb.svg",
        { x: 400, y: 0, width: 700, height: 800 },
        "cover",
      ),
    ).toEqual({ x: 874.5, y: 399 });
  });

  it("uses the full-height image center without cropping when its natural ratio fits", () => {
    expect(
      getExplosionCenter(
        "bomb.svg",
        { x: 100, y: 0, width: 1050, height: 800 },
        "cover",
      ),
    ).toEqual({ x: 749.5, y: 399 });
  });

  it("anchors the mobile SVG from the section top without a vertical offset", () => {
    const center = getExplosionCenter("bomb-mobile.svg", {
      x: 0,
      y: 0,
      width: 306,
      height: 556,
    });
    expect(center).toEqual({ x: 150.92, y: 184.0885 });
  });

  it.each([
    ["bomb-mobile.svg", 612, 1112, 301.84, 368.177],
    ["bomb.svg", 1050, 800, 649.5, 399],
  ])(
    "maps the actual center of %s including image position and scale",
    (source, width, height, centerX, centerY) => {
      const center = getExplosionCenter(source as string, {
        x: 10,
        y: -50,
        width: Number(width) / 2,
        height: Number(height) / 2,
      });
      expect(center.x).toBeCloseTo(10 + Number(centerX) / 2);
      expect(center.y).toBeCloseTo(-50 + Number(centerY) / 2);
    },
  );

  it("starts horizontal at the actual plate center and clamps before the scene", () => {
    expect(getIntroFrame(0, geometry)).toMatchObject({
      progress: 0,
      turn: 0,
      x: 820,
      y: 300,
      overlayY: 800,
    });
  });

  it("is only halfway through the fall and rotation at half scroll", () => {
    const frame = getIntroFrame(geometry.start + geometry.height / 2, geometry);
    expect(frame.turn).toBe(0.5);
    expect(frame.x).toBe(875);
    expect(frame.y).toBe(350);
  });

  it.each([0.25, 0.5, 0.75, 0.99, 1, 1.5])(
    "falls continuously and finishes only at the end of scroll %s",
    (progress) => {
      const clamped = Math.min(progress, 1);
      const frame = getIntroFrame(
        geometry.start + geometry.height * progress,
        geometry,
      );
      expect(frame.x).toBe(820 + 110 * clamped);
      expect(frame.y).toBe(300 + 100 * clamped);
      expect(frame.turn).toBe(clamped);
      expect(frame.overlayY).toBe(800 * (1 - clamped));
    },
  );

  it("uses responsive geometry, including an off-center explosion", () => {
    const mobile = {
      ...geometry,
      height: 700,
      plate: { x: 190, y: 180 },
      explosion: { x: 204, y: 240 },
    };
    expect(getIntroFrame(mobile.start + mobile.height, mobile)).toMatchObject({
      progress: 1,
      x: 204,
      y: 240,
      turn: 1,
      overlayY: 0,
    });
    expect(getIntroFrame(mobile.start, mobile).y).toBe(180);
  });

  it("retraces the same trajectory when scrolling back", () => {
    const first = getIntroFrame(250, geometry);
    getIntroFrame(882, geometry);
    expect(getIntroFrame(250, geometry)).toEqual(first);
  });
});

describe("intro scroll commands", () => {
  let callback: FrameRequestCallback;
  let scroll: jest.SpyInstance;
  let request: jest.SpyInstance;

  beforeEach(() => {
    scroll = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
    request = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((next) => {
        callback = next;
        return 1;
      });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    jest.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => jest.restoreAllMocks());

  it("reaches the target in 300ms then focuses without scrolling again", () => {
    const target = document.createElement("h2");
    const focus = jest.spyOn(target, "focus");
    scrollToIntroTarget(762, target, false);
    callback(150);
    expect(scroll).toHaveBeenLastCalledWith({
      top: 666.75,
      behavior: "instant",
    });
    callback(300);
    expect(scroll).toHaveBeenLastCalledWith({ top: 762, behavior: "instant" });
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it.each(["wheel", "touchstart", "pointerdown", "keydown"])(
    "cancels on native %s interaction",
    (event) => {
      scrollToIntroTarget(762, null, false);
      window.dispatchEvent(new Event(event));
      expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    },
  );

  it("skips animation for reduced motion", () => {
    scrollToIntroTarget(762, null, true);
    expect(scroll).toHaveBeenCalledWith({ top: 762, behavior: "instant" });
    expect(request).not.toHaveBeenCalled();
  });
});

describe("intro rendering", () => {
  const originalObserver = globalThis.ResizeObserver;
  let notifyResize: () => void;
  let sceneHeight: number;
  let disconnect: jest.Mock;

  beforeEach(() => {
    if (!window.PointerEvent) {
      Object.defineProperty(window, "PointerEvent", {
        configurable: true,
        value: MouseEvent,
      });
    }
    mockReducedMotion = false;
    sceneHeight = 800;
    disconnect = jest.fn();
    globalThis.ResizeObserver = jest.fn((callback: ResizeObserverCallback) => {
      notifyResize = () => callback([], {} as ResizeObserver);
      return { observe: jest.fn(), disconnect, unobserve: jest.fn() };
    });
    jest
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockImplementation(() => sceneHeight);
    jest
      .spyOn(HTMLElement.prototype, "offsetWidth", "get")
      .mockReturnValue(570);
    jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return {
          top: this.id === "homepage-explode" ? 482 : 82,
          left: 0,
        } as DOMRect;
      });
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalObserver;
    document.documentElement.style.removeProperty("--site-navbar-height");
    jest.restoreAllMocks();
  });

  it("renders one command and an accessible progress slider", () => {
    const { container, unmount } = render(<HomepageIntro />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(
      screen.getByRole("slider", { name: "hero.progress" }),
    ).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("renders the impact divider at the bottom of the moving explode section", () => {
    const { container } = render(<HomepageIntro />);
    const divider = container.querySelector("#homepage-explode > svg image");
    expect(divider).toHaveAttribute(
      "href",
      "/site/images/homepage/divider-explode-section.svg",
    );
    expect(divider?.parentElement).toHaveClass("bottom-0");
  });

  it("seeks to a clicked rail position and tracks native scroll progress", async () => {
    render(<HomepageIntro />);
    const slider = screen.getByRole("slider");
    fireEvent.pointerDown(slider, {
      button: 0,
      pointerId: 1,
      clientY: 124,
    });
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 400,
      behavior: "instant",
    });
    act(() => mockScrollValue.set(400));
    await waitFor(() => expect(slider).toHaveAttribute("aria-valuenow", "50"));
    fireEvent.pointerUp(slider, { pointerId: 1 });
  });

  it("drags the thumb through the full rail travel", () => {
    render(<HomepageIntro />);
    const slider = screen.getByRole("slider");
    const thumb = slider.querySelector(".homepage-intro__indicator-thumb")!;
    fireEvent.pointerDown(thumb, {
      button: 0,
      pointerId: 2,
      clientY: 94,
    });
    fireEvent.pointerMove(slider, { pointerId: 2, clientY: 151 });
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 800,
      behavior: "instant",
    });
    fireEvent.pointerUp(slider, { pointerId: 2 });
  });

  it("supports keyboard seeking with arrows and endpoints", () => {
    render(<HomepageIntro />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowUp" });
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 8,
      behavior: "instant",
    });
    fireEvent.keyDown(slider, { key: "End" });
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 800,
      behavior: "instant",
    });
  });

  it("uses the mobile SVG through a responsive picture and remeasures on load", () => {
    const { container, unmount } = render(<HomepageIntro />);
    const source = container.querySelector("picture source");
    expect(source).toHaveAttribute(
      "srcset",
      "/site/images/homepage/bomb-mobile.svg",
    );
    expect(source).toHaveAttribute("media", "(max-width: 1023px)");
    expect(container.querySelector("picture img")).toHaveAttribute(
      "src",
      "/site/images/homepage/bomb.svg",
    );
    sceneHeight = 600;
    fireEvent.load(container.querySelector("picture img")!);
    expect(disconnect).not.toHaveBeenCalled();
    unmount();
  });

  it("switches to blue immediately, moves the blue arrow and restores pink on reverse scroll", async () => {
    const { container, unmount } = render(<HomepageIntro />);
    const blue = container.querySelector(".homepage-intro__fish--blue");
    const pink = container.querySelector(
      ".homepage-intro__fish-pivot > .homepage-intro__fish",
    );
    expect(pink).toHaveStyle({ opacity: "1" });
    act(() => mockScrollValue.set(1));
    await waitFor(() => expect(blue).toHaveStyle({ opacity: "1" }));
    expect(pink).toHaveStyle({ opacity: "0" });
    act(() => mockScrollValue.set(400));
    await waitFor(() =>
      expect(
        container.querySelector(".homepage-intro__entering-arrow"),
      ).toHaveStyle({ transform: "translateY(400px)" }),
    );
    act(() => mockScrollValue.set(800));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "navigation.impact" }),
      ).toBeEnabled(),
    );
    expect(
      container.querySelector(".homepage-intro__entering-arrow button"),
    ).toBeDisabled();
    act(() => mockScrollValue.set(0));
    await waitFor(() => expect(pink).toHaveStyle({ opacity: "1" }));
    expect(blue).toHaveStyle({ opacity: "0" });
    unmount();
  });

  it("renders two normal sections and immediate header-aware commands with reduced motion", () => {
    mockReducedMotion = true;
    jest
      .spyOn(HTMLImageElement.prototype, "currentSrc", "get")
      .mockReturnValue("http://localhost/site/images/homepage/bomb-mobile.svg");
    document.documentElement.style.setProperty("--site-navbar-height", "108px");
    const { container, unmount } = render(<HomepageIntro />);
    expect(container.querySelector(".homepage-intro")).toHaveAttribute(
      "data-static",
      "true",
    );
    expect(
      container.querySelector(".homepage-intro__indicator"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
    const layer = container.querySelector<HTMLElement>(
      ".homepage-intro__bomb",
    )!;
    expect(
      parseFloat(layer.style.getPropertyValue("--intro-explosion-x")),
    ).toBeCloseTo((301.84 / 612) * 570);
    expect(
      parseFloat(layer.style.getPropertyValue("--intro-explosion-y")),
    ).toBeCloseTo((368.177 / 1112) * 800);
    fireEvent.click(screen.getByRole("button", { name: "navigation.explode" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 374,
      behavior: "instant",
    });
    unmount();
  });

  it("recalculates the animated destination on resize and cancels pending navigation on unmount", () => {
    let nextFrame: FrameRequestCallback;
    jest.spyOn(performance, "now").mockReturnValue(0);
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        nextFrame = callback;
        return 1;
      });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    const { unmount } = render(<HomepageIntro />);
    act(() => {
      sceneHeight = 600;
      notifyResize();
    });
    fireEvent.click(screen.getByRole("button", { name: "navigation.explode" }));
    act(() => nextFrame(300));
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 600,
      behavior: "instant",
    });
    fireEvent.click(screen.getByRole("button", { name: "navigation.explode" }));
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(disconnect).toHaveBeenCalled();
  });
});
