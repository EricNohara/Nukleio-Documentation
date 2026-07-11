"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const DEFAULT_APP_URL =
  process.env.NEXT_PUBLIC_NUKLEIO_APP_URL ?? "http://localhost:3000";

const STORAGE_KEY = "nukleio-docs-return-to";

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isAllowedReturnUrl(value: string): boolean {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    // Allow any localhost port during development.
    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    ) {
      return true;
    }

    // Only allow the configured Nukleio origin when deployed.
    const configuredOrigin = normalizeOrigin(DEFAULT_APP_URL);

    return configuredOrigin !== null && url.origin === configuredOrigin;
  } catch {
    return false;
  }
}

export function ReturnToNukleio() {
  const searchParams = useSearchParams();
  const requestedUrl = searchParams.get("returnTo");

  const safeRequestedUrl =
    requestedUrl && isAllowedReturnUrl(requestedUrl)
      ? requestedUrl
      : null;

  useEffect(() => {
    if (safeRequestedUrl) {
      sessionStorage.setItem(STORAGE_KEY, safeRequestedUrl);
    }
  }, [safeRequestedUrl]);

  function getReturnUrl(): string {
    if (safeRequestedUrl) {
      return safeRequestedUrl;
    }

    const storedUrl = sessionStorage.getItem(STORAGE_KEY);

    if (storedUrl && isAllowedReturnUrl(storedUrl)) {
      return storedUrl;
    }

    sessionStorage.removeItem(STORAGE_KEY);

    return DEFAULT_APP_URL;
  }

  return (
    <a
      href={safeRequestedUrl ?? DEFAULT_APP_URL}
      onClick={(event) => {
        event.preventDefault();
        window.location.assign(getReturnUrl());
      }}
      className="nextra-focus x:group x:inline-flex x:items-center x:gap-1.5 x:rounded-md x:px-2 x:py-1.5 x:text-sm x:font-medium x:transition-colors x:hover:bg-gray-100 x:dark:hover:bg-neutral-800"
      aria-label="Return to Nukleio"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="x:transition-transform x:group-hover:-translate-x-0.5"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>

      <span>Return to Nukleio</span>
    </a>
  );
}