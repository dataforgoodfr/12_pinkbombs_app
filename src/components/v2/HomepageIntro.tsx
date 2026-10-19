"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import ResponsiveSvgDivider from "@/components/v2/ResponsiveSvgDivider";

type Point = { x: number; y: number };
export type IntroGeometry = {
  start: number;
  height: number;
  plate: Point;
  explosion: Point;
  fishWidth: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const INDICATOR_PADDING = 2;
const INDICATOR_THUMB_HEIGHT = 25;
const INDICATOR_TRAVEL = 84 - INDICATOR_PADDING * 2 - INDICATOR_THUMB_HEIGHT;

export function getIntroFrame(scroll: number, geometry: IntroGeometry) {
  const progress = clamp((scroll - geometry.start) / geometry.height);
  const overlayY = geometry.height * (1 - progress);

  return {
    progress,
    overlayY,
    turn: progress,
    x: geometry.plate.x + (geometry.explosion.x - geometry.plate.x) * progress,
    y: geometry.plate.y + (geometry.explosion.y - geometry.plate.y) * progress,
  };
}

function localPosition(element: HTMLElement, scene: HTMLElement): Point {
  const bounds = element.getBoundingClientRect();
  const origin = scene.getBoundingClientRect();
  return { x: bounds.left - origin.left, y: bounds.top - origin.top };
}

export function getExplosionCenter(
  source: string,
  bounds: Pick<DOMRect, "x" | "y" | "width" | "height">,
  fit: "fill" | "cover" = "fill",
): Point {
  const mobile = source.includes("bomb-mobile.svg");
  const sourceWidth = mobile ? 612 : 1050;
  const sourceHeight = mobile ? 1112 : 800;
  const scale = Math.max(
    bounds.width / sourceWidth,
    bounds.height / sourceHeight,
  );
  const width = fit === "cover" ? sourceWidth * scale : bounds.width;
  const height = fit === "cover" ? sourceHeight * scale : bounds.height;
  return {
    x:
      bounds.x +
      (bounds.width - width) / 2 +
      (mobile ? 301.84 / 612 : 649.5 / 1050) * width,
    y: bounds.y + (mobile ? 368.177 / 1112 : 399 / 800) * height,
  };
}

export function scrollToIntroTarget(
  top: number,
  target: HTMLElement | null,
  immediate: boolean,
) {
  let animation = 0;
  const cancel = () => {
    cancelAnimationFrame(animation);
    ["wheel", "touchstart", "pointerdown", "keydown"].forEach((event) =>
      window.removeEventListener(event, cancel),
    );
  };
  const finish = () => {
    cancel();
    target?.focus({ preventScroll: true });
  };
  if (immediate) {
    window.scrollTo({ top, behavior: "instant" });
    finish();
    return cancel;
  }

  const from = window.scrollY;
  const started = performance.now();
  const step = (now: number) => {
    const progress = clamp((now - started) / 300);
    const eased = 1 - (1 - progress) ** 3;
    window.scrollTo({ top: from + (top - from) * eased, behavior: "instant" });
    if (progress < 1) animation = requestAnimationFrame(step);
    else finish();
  };
  ["wheel", "touchstart", "pointerdown", "keydown"].forEach((event) =>
    window.addEventListener(event, cancel, { passive: true }),
  );
  animation = requestAnimationFrame(step);
  return cancel;
}

export default function HomepageIntro() {
  const t = useTranslations("site.homepage");
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const indicatorThumbRef = useRef<HTMLDivElement>(null);
  const indicatorPointerRef = useRef<{
    pointerId: number;
    offsetY: number;
  } | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLImageElement>(null);
  const bombRef = useRef<HTMLImageElement>(null);
  const [measured, setMeasured] = useState(false);
  const [blueArrowVisible, setBlueArrowVisible] = useState(true);
  const blueArrowVisibleRef = useRef(true);
  const cancelScrollRef = useRef<(() => void) | null>(null);
  const measureRef = useRef<(() => void) | null>(null);
  const staticLayout = reducedMotion;
  const geometry = useMotionValue<IntroGeometry>({
    start: 0,
    height: 1,
    plate: { x: 0, y: 0 },
    explosion: { x: 0, y: 0 },
    fishWidth: 0,
  });
  const { scrollY } = useScroll();
  const frame = useTransform(() =>
    getIntroFrame(scrollY.get(), geometry.get()),
  );
  const overlayY = useTransform(frame, (value) => value.overlayY);
  const fishX = useTransform(frame, (value) => value.x);
  const fishY = useTransform(frame, (value) => value.y);
  const rotate = useTransform(frame, (value) => value.turn * 90);
  const pinkOpacity = useTransform(frame, (value) =>
    value.progress === 0 ? 1 : 0,
  );
  const blueOpacity = useTransform(frame, (value) =>
    value.progress > 0 ? 1 : 0,
  );
  const fishWidth = useTransform(geometry, (value) => value.fishWidth);
  const indicatorY = useTransform(
    frame,
    (value) => value.progress * INDICATOR_TRAVEL,
  );

  useMotionValueEvent(frame, "change", (value) => {
    indicatorRef.current?.setAttribute(
      "aria-valuenow",
      String(Math.round(value.progress * 100)),
    );
    const visible = value.overlayY >= 60;
    if (visible !== blueArrowVisibleRef.current) {
      blueArrowVisibleRef.current = visible;
      setBlueArrowVisible(visible);
    }
  });

  useEffect(() => {
    return () => {
      cancelScrollRef.current?.();
    };
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    const plate = plateRef.current;
    const bomb = bombRef.current;
    if (!track || !scene || !plate || !bomb) return;

    const measure = () => {
      const platePosition = localPosition(plate, scene);
      const bombPosition = localPosition(bomb, bomb.closest("section")!);
      const headerHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--site-navbar-height",
          ),
        ) || 82;
      const source =
        bomb.currentSrc ||
        (window.innerWidth < 1024 ? "bomb-mobile.svg" : "bomb.svg");
      const explosion = getExplosionCenter(
        source,
        {
          ...bombPosition,
          width: bomb.offsetWidth,
          height: bomb.offsetHeight,
        },
        getComputedStyle(bomb).objectFit === "cover" ? "cover" : "fill",
      );
      const layer = bomb.closest<HTMLElement>(".homepage-intro__bomb")!;
      const layerPosition = localPosition(layer, bomb.closest("section")!);
      layer.style.setProperty(
        "--intro-explosion-x",
        `${explosion.x - layerPosition.x}px`,
      );
      layer.style.setProperty(
        "--intro-explosion-y",
        `${explosion.y - layerPosition.y}px`,
      );
      const fishWidth = plate.offsetWidth * (312 / 570);
      scene.style.setProperty("--intro-fish-width", `${fishWidth}px`);
      geometry.set({
        start:
          track.getBoundingClientRect().top + window.scrollY - headerHeight,
        height: scene.offsetHeight,
        plate: {
          x: platePosition.x + (287.789 / 570) * plate.offsetWidth,
          y: platePosition.y + (212.219 / 425) * plate.offsetHeight,
        },
        explosion,
        fishWidth,
      });
      setMeasured(true);
    };

    measureRef.current = measure;
    measure();
    const observer = new ResizeObserver(measure);
    [scene, plate, bomb, document.documentElement].forEach((element) =>
      observer.observe(element),
    );
    window.addEventListener("resize", measure);
    return () => {
      measureRef.current = null;
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [geometry, staticLayout]);

  const goTo = (destination: "explode" | "impact") => {
    cancelScrollRef.current?.();
    const target = document.getElementById(
      destination === "explode" ? "explode-title" : "homepage-impact",
    );
    const headerHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--site-navbar-height",
        ),
      ) || 82;
    const top =
      destination === "explode" && !staticLayout
        ? geometry.get().start + geometry.get().height
        : (destination === "explode"
            ? document.getElementById("homepage-explode")
            : target
          )?.getBoundingClientRect().top;
    if (top === undefined) return;
    const destinationTop =
      destination === "explode" && !staticLayout
        ? top
        : top + window.scrollY - headerHeight;
    cancelScrollRef.current = scrollToIntroTarget(
      destinationTop,
      target,
      !!staticLayout,
    );
  };

  const seekToProgress = (progress: number) => {
    const currentGeometry = geometry.get();
    window.scrollTo({
      top: currentGeometry.start + clamp(progress) * currentGeometry.height,
      behavior: "instant",
    });
  };

  const seekFromPointer = (clientY: number, offsetY: number) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const trackTop = indicator.getBoundingClientRect().top;
    const thumbTop = clientY - trackTop - offsetY;
    seekToProgress((thumbTop - INDICATOR_PADDING) / INDICATOR_TRAVEL);
  };

  const handleIndicatorPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    const thumb = indicatorThumbRef.current;
    const startedOnThumb = thumb?.contains(event.target as Node) ?? false;
    const offsetY =
      startedOnThumb && thumb
        ? event.clientY - thumb.getBoundingClientRect().top
        : INDICATOR_THUMB_HEIGHT / 2;
    indicatorPointerRef.current = { pointerId: event.pointerId, offsetY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    seekFromPointer(event.clientY, offsetY);
  };

  const handleIndicatorPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const pointer = indicatorPointerRef.current;
    if (pointer && pointer.pointerId === event.pointerId) {
      seekFromPointer(event.clientY, pointer.offsetY);
    }
  };

  const handleIndicatorPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (
      indicatorPointerRef.current &&
      indicatorPointerRef.current.pointerId === event.pointerId
    ) {
      indicatorPointerRef.current = null;
    }
  };

  const handleIndicatorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const progress = frame.get().progress;
    let nextProgress: number | undefined;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowRight":
        nextProgress = progress + 0.01;
        break;
      case "ArrowDown":
      case "ArrowLeft":
        nextProgress = progress - 0.01;
        break;
      case "PageUp":
        nextProgress = progress + 0.1;
        break;
      case "PageDown":
        nextProgress = progress - 0.1;
        break;
      case "Home":
        nextProgress = 0;
        break;
      case "End":
        nextProgress = 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    seekToProgress(nextProgress);
  };

  const arrow = (destination: "explode" | "impact", hidden = false) => (
    <button
      type="button"
      className="homepage-intro__arrow"
      disabled={hidden}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      onClick={() => goTo(destination)}
      aria-label={t(
        destination === "explode" ? "navigation.explode" : "navigation.impact",
      )}
      aria-controls={
        destination === "explode" ? "homepage-explode" : "homepage-impact"
      }
    >
      <Image
        src={`/site/images/homepage/down-arrow-${destination === "explode" ? "blue" : "yellow"}.svg`}
        width={34}
        height={20}
        alt=""
      />
    </button>
  );

  return (
    <div
      ref={trackRef}
      className="homepage-intro"
      data-static={staticLayout || undefined}
    >
      <div ref={sceneRef} className="homepage-intro__scene">
        <section
          className="homepage-intro__panel homepage-intro__hero"
          aria-labelledby="intro-title"
        >
          <div className="homepage-intro__content">
            <h1
              id="intro-title"
              className="h1 homepage-intro__title text-v2-magenta"
            >
              {t("hero.title")}{" "}
              <span className="text-v2-blue">{t("hero.title2")}</span>
            </h1>
            <div className="homepage-intro__visual">
              <div className="homepage-intro__plate">
                <Image
                  ref={plateRef}
                  src="/site/images/homepage/plate.svg"
                  width={570}
                  height={425}
                  alt={t("hero.imageAlt")}
                  priority
                />
                <div
                  className="homepage-intro__fish homepage-intro__fish--fallback"
                  aria-hidden="true"
                  style={{
                    visibility:
                      measured && !staticLayout ? "hidden" : undefined,
                  }}
                />
              </div>
            </div>
          </div>
          {staticLayout && arrow("explode")}
        </section>
        <motion.section
          id="homepage-explode"
          data-home-explode
          className="homepage-intro__panel homepage-intro__explode"
          aria-labelledby="explode-title"
          style={{ y: staticLayout ? 0 : measured ? overlayY : "100%" }}
        >
          <div className="homepage-intro__content">
            <h2
              id="explode-title"
              tabIndex={-1}
              className="h1 homepage-intro__title text-v2-pink"
            >
              {t("bomb.title")}{" "}
              <span className="text-v2-red2">{t("bomb.title2")}</span>{" "}
              {t("bomb.title3")}
              <Image
                src="/site/images/homepage/red-line.svg"
                width={437}
                height={14}
                alt=""
                className="homepage-intro__underline"
              />
            </h2>
          </div>
          <div className="homepage-intro__bomb">
            <picture>
              <source
                media="(max-width: 1023px)"
                srcSet="/site/images/homepage/bomb-mobile.svg"
                width={612}
                height={1112}
              />
              <Image
                ref={bombRef}
                src="/site/images/homepage/bomb.svg"
                width={1050}
                height={800}
                alt={t("bomb.imageAlt")}
                onLoad={() => measureRef.current?.()}
                priority
              />
            </picture>
            <div
              className="homepage-intro__fish homepage-intro__fish--static"
              aria-hidden="true"
            />
          </div>
          <ResponsiveSvgDivider
            src="/site/images/homepage/divider-explode-section.svg"
            width={1512}
            height={5}
            className="absolute inset-x-0 bottom-0 block h-[5px] w-full"
          />
          {arrow("impact", !staticLayout && blueArrowVisible)}
        </motion.section>
        <motion.div
          className="homepage-intro__traveler"
          aria-hidden="true"
          style={{
            x: fishX,
            y: fishY,
            width: fishWidth,
            visibility: measured ? "visible" : "hidden",
          }}
        >
          <motion.div className="homepage-intro__fish-pivot" style={{ rotate }}>
            <motion.div
              className="homepage-intro__fish"
              style={{ opacity: pinkOpacity }}
            />
            <motion.div
              className="homepage-intro__fish homepage-intro__fish--blue"
              style={{ opacity: blueOpacity }}
            />
          </motion.div>
        </motion.div>
        {!staticLayout && (
          <motion.div
            className="homepage-intro__entering-arrow"
            style={{ y: measured ? overlayY : "var(--intro-height)" }}
          >
            {arrow("explode", !blueArrowVisible)}
          </motion.div>
        )}
        {!staticLayout && (
          <div
            ref={indicatorRef}
            className="homepage-intro__indicator"
            role="slider"
            tabIndex={0}
            aria-label={t("hero.progress")}
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            onKeyDown={handleIndicatorKeyDown}
            onPointerDown={handleIndicatorPointerDown}
            onPointerMove={handleIndicatorPointerMove}
            onPointerUp={handleIndicatorPointerEnd}
            onPointerCancel={handleIndicatorPointerEnd}
            onLostPointerCapture={handleIndicatorPointerEnd}
          >
            <motion.div
              ref={indicatorThumbRef}
              className="homepage-intro__indicator-thumb"
              style={{ y: indicatorY }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
