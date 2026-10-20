"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

type ConsentStatus = "undecided" | "accepted" | "rejected";

type MatomoWindow = Window & {
  _mtm?: Array<{ "mtm.startTime": number; event: string }>;
  _paq?: unknown[][];
};

type MatomoConsentContextValue = {
  isProduction: boolean;
  openPreferences: () => void;
};

const CONSENT_STORAGE_KEY = "pinkbombs-analytics-consent";
const MATOMO_SCRIPT_ID = "matomo-tag-manager";
const matomoConsentContext =
  React.createContext<MatomoConsentContextValue | null>(null);
const subscribeToHydration = () => () => {};
const getHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return "undecided";

  try {
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (storedConsent === "accepted" || storedConsent === "rejected") {
      return storedConsent;
    }
  } catch {
    return "undecided";
  }

  return "undecided";
}

export function MatomoConsentProvider({
  children,
  isProduction,
}: {
  children: React.ReactNode;
  isProduction: boolean;
}) {
  const t = useTranslations("site.layout.analyticsConsent");
  const [consent, setConsent] = React.useState<ConsentStatus>(getStoredConsent);

  React.useEffect(() => {
    const syncConsent = (event: StorageEvent) => {
      if (
        event.key === CONSENT_STORAGE_KEY &&
        event.storageArea === window.localStorage &&
        (event.newValue === "accepted" || event.newValue === "rejected")
      ) {
        setConsent(event.newValue);
      }
    };
    window.addEventListener("storage", syncConsent);
    return () => window.removeEventListener("storage", syncConsent);
  }, []);

  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState(false);
  const isHydrated = React.useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  React.useEffect(() => {
    if (!isProduction || !isHydrated) return;

    const matomoWindow = window as MatomoWindow;
    if (consent === "accepted") {
      const trackerQueue = (matomoWindow._paq = matomoWindow._paq || []);
      const scriptAlreadyAdded = document.getElementById(MATOMO_SCRIPT_ID);

      if (!scriptAlreadyAdded) {
        trackerQueue.push(["requireConsent"]);
      }
      trackerQueue.push(["rememberConsentGiven"]);

      if (scriptAlreadyAdded) return;

      const tagManagerQueue = (matomoWindow._mtm = matomoWindow._mtm || []);
      tagManagerQueue.push({ "mtm.startTime": Date.now(), event: "mtm.Start" });

      const script = document.createElement("script");
      script.id = MATOMO_SCRIPT_ID;
      script.async = true;
      script.src =
        "https://cdn.matomo.cloud/pinkbombs.matomo.cloud/container_C2nLYbcS.js";
      document.head.appendChild(script);
    } else if (consent === "rejected" && matomoWindow._paq) {
      matomoWindow._paq.push(["forgetConsentGiven"]);
    }
  }, [consent, isHydrated, isProduction]);

  const chooseConsent = (choice: Exclude<ConsentStatus, "undecided">) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Apply the choice in memory even when persistence is unavailable.
    }
    setConsent(choice);
    setIsPreferencesOpen(false);
  };

  const contextValue = {
    isProduction,
    openPreferences: () => setIsPreferencesOpen(true),
  };

  return (
    <matomoConsentContext.Provider value={contextValue}>
      {children}
      {isProduction &&
        isHydrated &&
        (consent === "undecided" || isPreferencesOpen) && (
          <aside
            aria-labelledby="analytics-consent-title"
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl border border-darkblue1/20 bg-white p-5 shadow-xl sm:p-6"
            role="region"
          >
            <h2 className="mb-2 text-lg font-bold" id="analytics-consent-title">
              {t("title")}
            </h2>
            <p className="mb-5 max-w-2xl text-sm leading-6">
              {t("description")}
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <button
                className="border border-darkblue1 px-4 py-2 text-sm font-semibold text-darkblue1 hover:bg-darkblue1/5"
                onClick={() => chooseConsent("rejected")}
                type="button"
              >
                {t("reject")}
              </button>
              <button
                className="bg-darkblue1 px-4 py-2 text-sm font-semibold text-white hover:bg-darkblue1/90"
                onClick={() => chooseConsent("accepted")}
                type="button"
              >
                {t("accept")}
              </button>
            </div>
          </aside>
        )}
    </matomoConsentContext.Provider>
  );
}

export function MatomoPreferencesButton() {
  const context = React.useContext(matomoConsentContext);
  const t = useTranslations("site.layout.analyticsConsent");

  // if (!context?.isProduction) return null;

  return (
    <button
      className="p-caption text-white underline underline-offset-2 hover:text-v2-yellow"
      onClick={context.openPreferences}
      type="button"
    >
      {t("preferences")}
    </button>
  );
}
