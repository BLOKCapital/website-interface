"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

/** Google Analytics 4 property for blokcapital.io. */
export const GA_ID = "G-D3Q5JCYWJR";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/**
 * Google tag (gtag.js), loaded only after the visitor allows Analytics in the
 * cookie banner, so nothing reaches Google before a choice (the banner's
 * promise). Consent Mode v2 signals mirror the banner: analytics from the
 * Analytics toggle, ad signals from the Marketing toggle. Withdrawing consent
 * updates the signals and deletes the _ga cookies. Page views on client-side
 * navigation come from GA4's enhanced measurement (history changes).
 */
export function Analytics() {
  const consent = useConsent();
  const analytics = consent?.analytics === true;
  const marketing = consent?.marketing === true;

  useEffect(() => {
    const signals = {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    };

    if (window.gtag) {
      window.gtag("consent", "update", signals);
      if (!analytics) {
        // Withdrawn: drop the GA cookies on this domain and its parent.
        const host = location.hostname.replace(/^www\./, "");
        for (const c of document.cookie.split("; ")) {
          const name = c.split("=")[0];
          if (name === "_ga" || name.startsWith("_ga_")) {
            for (const domain of ["", `; domain=.${host}`]) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
          }
        }
      }
      return;
    }
    if (!analytics) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag.js expects the `arguments` object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", signals);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }, [analytics, marketing]);

  return null;
}
