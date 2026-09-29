"use client";

import { useTranslations } from "next-intl";

export const LoadingScreen = () => {
  const t = useTranslations("site.calculator");

  return (
    <div className="flex flex-col justify-center items-center gap-8 px-4 mx-auto">
      <div className="loading-fish">
        <svg
          width="200"
          height="144"
          viewBox="0 0 200 144"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Pink ball */}
          <path
            d="M128.055 143.892C167.79 143.892 200.001 111.68 200.001 71.9458C200.001 32.2112 167.79 0 128.055 0C88.3206 0 56.1094 32.2112 56.1094 71.9458C56.1094 111.68 88.3206 143.892 128.055 143.892Z"
            fill="#EB88DD"
          />

          {/* Fish */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M77.0445 118.556L124.305 104.061C140.677 99.0381 145.549 75.7621 147.289 64.8461C140.364 56.6566 123.06 41.3364 109.215 45.5824L54.329 62.4188C45.8231 65.0284 41.6939 73.1389 41.6458 81.16L29.2445 70.1168L0 79.0868L24.665 102.483L17.6925 136.768L46.937 127.798L50.9528 111.584C56.1615 118.309 66.8299 121.695 77.048 118.563L77.0445 118.556Z"
            fill="#E82D04"
          />

          {/* Fish mouth / gill */}
          <path
            d="M121.197 79.2518C125.894 83.4704 132.619 85.1894 139.089 83.2056C148.908 80.1939 154.423 69.7936 151.411 59.9778"
            stroke="#EB88DD"
            strokeWidth="5.84478"
            strokeMiterlimit="10"
          />

          {/* White eye */}
          <circle
            cx="124.466"
            cy="64.6088"
            r="7.869"
            fill="white"
          />

          {/* Pupil */}
          <g className="loading-fish__pupil">
            <circle
              cx="124.468"
              cy="64.6089"
              r="4.927"
              fill="#13176E"
            />
          </g>

          {/* Fish fin */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M49.2988 47.8619L85.2442 36.8359L104.876 53.9336L68.1362 65.7298L49.2988 47.8619Z"
            fill="#E82D04"
          />
        </svg>
      </div>

      <div className="flex gap-4 flex-col items-center text-center">
        <h2 className="h2 text-pretty text-v2-pink">
          {t("loading.title")}
        </h2>

        <p className="p-lead text-pretty text-v2-pink">
          {t("loading.caption")}
        </p>

        <p className="p-caption text-pretty italic text-v2-pink">
          {t("loading.info")}
        </p>
      </div>
    </div>
  );
};